/**
 * AUTOILTY MARKETPLACE - NOTIFICATIONS SYSTEM
 * 
 * Real-time notification management with Supabase Realtime subscriptions
 * 
 * Features:
 * - Supabase Realtime subscriptions (INSERT and UPDATE events)
 * - Optimistic updates when marking as read
 * - Derived unread count from notifications array
 * - Automatic UI updates on state changes
 */

class NotificationSystem {
  constructor() {
    this.notifications = [];
    this.unreadCount = 0; // Derived from notifications array
    this.isInitialized = false;
    this.supabaseClient = null;
    this.realtimeChannel = null;
    this.currentUserId = null;
    this.callbacks = {
      onNewNotification: [],
      onUnreadCountChange: []
    };
  }

  /**
   * Initialize Supabase client
   */
  initSupabaseClient() {
    // Check if Supabase is loaded
    if (typeof supabase === 'undefined') {
      console.error('❌ Supabase client not loaded. Please ensure @supabase/supabase-js is loaded.');
      return null;
    }

    // Get Supabase credentials from config
    const supabaseUrl = window.SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = window.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
      console.warn('⚠️ Supabase URL or Anon Key not configured. Using polling fallback.');
      return null;
    }

    // Create Supabase client with auth token
    const authToken = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (!authToken) {
      console.warn('⚠️ No auth token found. Cannot initialize Supabase client.');
      return null;
    }

    try {
      // Initialize Supabase client
      const client = supabase.createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });

      // Set auth token (if using JWT)
      if (authToken) {
        client.auth.setSession({
          access_token: authToken,
          refresh_token: ''
        }).catch(err => {
          console.warn('Could not set Supabase session:', err);
          // Continue anyway - we might be using a custom JWT
        });
      }

      return client;
    } catch (error) {
      console.error('❌ Error initializing Supabase client:', error);
      return null;
    }
  }

  /**
   * Get current user ID from auth
   */
  getCurrentUserId() {
    const user = getCurrentUser ? getCurrentUser() : null;
    if (user && user.id) {
      return user.id.toString();
    }
    
    // Fallback: try to get from token or localStorage
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        return userData.id ? userData.id.toString() : null;
      } catch (e) {
        console.error('Error parsing auth_user:', e);
      }
    }
    
    return null;
  }

  /**
   * Initialize notification system
   */
  async init() {
    if (this.isInitialized) {
      console.log('⚠️ Notification system already initialized');
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (!token) {
      console.log('ℹ️ User not authenticated, skipping notification initialization');
      return;
    }

    // Get current user ID
    this.currentUserId = this.getCurrentUserId();
    if (!this.currentUserId) {
      console.warn('⚠️ Could not get current user ID, skipping notification initialization');
      return;
    }

    // Initialize Supabase client
    this.supabaseClient = this.initSupabaseClient();

    // Load initial notifications
    await this.loadNotifications();

    // Setup Realtime subscription if Supabase is available, otherwise fallback to polling
    if (this.supabaseClient) {
      this.setupRealtimeSubscription();
    } else {
      console.warn('⚠️ Supabase Realtime not available, using polling fallback');
      this.startPollingFallback();
    }

    this.isInitialized = true;
    console.log('✅ Notification system initialized');
  }

  /**
   * Setup Supabase Realtime subscription
   */
  setupRealtimeSubscription() {
    if (!this.supabaseClient || !this.currentUserId) {
      return;
    }

    // Clean up existing subscription
    if (this.realtimeChannel) {
      this.realtimeChannel.unsubscribe();
    }

    // Create new channel for notifications
    this.realtimeChannel = this.supabaseClient
      .channel(`notifications:${this.currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, and DELETE
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${this.currentUserId}`
        },
        (payload) => {
          this.handleRealtimeEvent(payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Subscribed to notifications realtime channel');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Error subscribing to notifications channel');
        }
      });
  }

  /**
   * Handle Realtime event (INSERT, UPDATE, DELETE)
   */
  handleRealtimeEvent(payload) {
    console.log('🔔 Realtime event received:', payload.eventType, payload);

    if (payload.eventType === 'INSERT') {
      // New notification inserted
      const newNotification = payload.new;
      this.notifications.unshift(newNotification); // Add to beginning
      this.recalculateUnreadCount();
      this.updateUI();
      this.triggerNewNotificationCallbacks(newNotification);
    } else if (payload.eventType === 'UPDATE') {
      // Notification updated (e.g., marked as read)
      const updatedNotification = payload.new;
      const oldNotification = payload.old;
      
      // Find and update the notification in local array
      const index = this.notifications.findIndex(n => n.id === updatedNotification.id);
      if (index !== -1) {
        // Update existing notification
        this.notifications[index] = updatedNotification;
      } else {
        // Notification not in local array, add it
        this.notifications.unshift(updatedNotification);
      }
      
      // Recalculate unread count (important: this ensures count stays in sync)
      this.recalculateUnreadCount();
      this.updateUI();
    } else if (payload.eventType === 'DELETE') {
      // Notification deleted
      const deletedId = payload.old.id;
      this.notifications = this.notifications.filter(n => n.id !== deletedId);
      this.recalculateUnreadCount();
      this.updateUI();
    }
  }

  /**
   * Recalculate unread count from notifications array
   * This is the source of truth for unread count
   */
  recalculateUnreadCount() {
    const previousCount = this.unreadCount;
    this.unreadCount = this.notifications.filter(n => !n.read_at).length;
    
    // Trigger callbacks if count changed
    if (this.unreadCount !== previousCount) {
      this.triggerUnreadCountChange();
    }
  }

  /**
   * Load notifications from API
   */
  async loadNotifications() {
    try {
      if (!window.notificationsAPI) {
        console.error('❌ notificationsAPI not available');
        return;
      }

      const data = await window.notificationsAPI.getNotifications({ limit: 50 });
      const previousNotifications = [...this.notifications];
      this.notifications = data.notifications || [];
      
      // Recalculate unread count after loading
      this.recalculateUnreadCount();
      
      // Check for new notifications (for callbacks)
      const newNotifications = this.notifications.filter(n => 
        !previousNotifications.find(pn => pn.id === n.id)
      );
      
      if (newNotifications.length > 0) {
        newNotifications.forEach(n => this.triggerNewNotificationCallbacks(n));
      }

      this.updateUI();
    } catch (error) {
      console.error('❌ Error loading notifications:', error);
    }
  }

  /**
   * Mark notification as read (with optimistic update)
   */
  async markAsRead(notificationId) {
    try {
      if (!window.notificationsAPI) {
        return false;
      }

      // OPTIMISTIC UPDATE: Update local state immediately
      const notification = this.notifications.find(n => n.id === notificationId);
      const wasUnread = notification && !notification.read_at;
      
      if (notification && wasUnread) {
        // Optimistically mark as read
        notification.read_at = new Date().toISOString();
        this.recalculateUnreadCount();
        this.updateUI();
      }

      // Make API call to update database
      const success = await window.notificationsAPI.markNotificationAsRead(notificationId);
      
      if (!success && notification && wasUnread) {
        // Rollback optimistic update on failure
        notification.read_at = null;
        this.recalculateUnreadCount();
        this.updateUI();
        console.error('❌ Failed to mark notification as read, rolled back optimistic update');
        return false;
      }

      // Realtime subscription will confirm the update, but we've already updated optimistically
      // If Realtime event comes back, it will just update the same notification again (no-op)
      return success;
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      
      // Rollback optimistic update on error
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification && notification.read_at) {
        notification.read_at = null;
        this.recalculateUnreadCount();
        this.updateUI();
      }
      
      return false;
    }
  }

  /**
   * Mark all notifications as read (with optimistic update)
   */
  async markAllAsRead() {
    try {
      if (!window.notificationsAPI) {
        return 0;
      }

      // OPTIMISTIC UPDATE: Mark all as read immediately
      const unreadNotifications = this.notifications.filter(n => !n.read_at);
      const previousUnreadCount = this.unreadCount;
      const now = new Date().toISOString();
      
      unreadNotifications.forEach(n => {
        n.read_at = now;
      });
      
      this.unreadCount = 0;
      this.triggerUnreadCountChange();
      this.updateUI();

      // Make API call to update database
      const count = await window.notificationsAPI.markAllNotificationsAsRead();
      
      if (count === 0 && previousUnreadCount > 0) {
        // Rollback optimistic update on failure
        unreadNotifications.forEach(n => {
          n.read_at = null;
        });
        this.recalculateUnreadCount();
        this.updateUI();
        console.error('❌ Failed to mark all notifications as read, rolled back optimistic update');
        return 0;
      }

      // Realtime subscription will confirm updates, but we've already updated optimistically
      return count || unreadNotifications.length;
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
      
      // Rollback optimistic update on error
      this.recalculateUnreadCount();
      this.updateUI();
      
      return 0;
    }
  }

  /**
   * Polling fallback (if Supabase Realtime is not available)
   */
  startPollingFallback() {
    // Poll every 30 seconds
    setInterval(() => {
      this.loadNotifications();
    }, 30000);
  }

  /**
   * Register callback for new notifications
   */
  onNewNotification(callback) {
    this.callbacks.onNewNotification.push(callback);
  }

  /**
   * Register callback for unread count changes
   */
  onUnreadCountChange(callback) {
    this.callbacks.onUnreadCountChange.push(callback);
  }

  /**
   * Trigger unread count change callbacks
   */
  triggerUnreadCountChange() {
    this.callbacks.onUnreadCountChange.forEach(cb => {
      try {
        cb(this.unreadCount);
      } catch (error) {
        console.error('❌ Error in unread count change callback:', error);
      }
    });
  }

  /**
   * Trigger new notification callbacks
   */
  triggerNewNotificationCallbacks(notification) {
    this.callbacks.onNewNotification.forEach(cb => {
      try {
        cb(notification);
      } catch (error) {
        console.error('❌ Error in new notification callback:', error);
      }
    });
  }

  /**
   * Update notification UI
   */
  updateUI() {
    // Update bell badge
    const badge = document.getElementById('notificationBadge');
    if (badge) {
      if (this.unreadCount > 0) {
        badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount.toString();
        badge.style.display = 'inline-flex';
      } else {
        badge.style.display = 'none';
      }
    }

    // Update dropdown if open
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown && dropdown.classList.contains('show')) {
      this.renderDropdown();
    }
  }

  /**
   * Render notification dropdown
   */
  renderDropdown() {
    const container = document.getElementById('notificationList');
    const emptyState = document.getElementById('notificationEmptyState');
    
    if (!container) return;

    if (this.notifications.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = this.notifications.map(notification => {
      const isUnread = !notification.read_at;
      const timeAgo = window.notificationsAPI?.formatTimeAgo(notification.created_at) || '';
      
      let icon = 'message-circle';
      if (notification.type === 'question') icon = 'help-circle';
      else if (notification.type === 'posting_update') icon = 'file-text';
      else if (notification.type === 'system') icon = 'info';
      else if (notification.type === 'message') icon = 'message-square';

      return `
        <li class="notification-item ${isUnread ? 'unread' : ''}" data-id="${notification.id}">
          <i data-lucide="${icon}" class="notification-icon"></i>
          <div class="notification-content">
            <div class="notification-title">${this.escapeHtml(notification.title)}</div>
            ${notification.body ? `<div class="notification-body">${this.escapeHtml(notification.body)}</div>` : ''}
            <div class="notification-time">${timeAgo}</div>
          </div>
          ${isUnread ? '<div class="notification-dot"></div>' : ''}
        </li>
      `;
    }).join('');

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }

    // Add click listeners to notification items
    container.querySelectorAll('.notification-item').forEach(item => {
      item.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const notificationId = parseInt(item.dataset.id);
        const notification = this.notifications.find(n => n.id === notificationId);
        
        if (notification && !notification.read_at) {
          await this.markAsRead(notificationId);
        }
        
        this.closeDropdown();
        
        if (notification && notification.link) {
          window.location.href = notification.link;
        }
      });
    });
  }

  /**
   * Handle notification click
   */
  async handleNotificationClick(notificationId, link) {
    // Mark as read
    await this.markAsRead(notificationId);

    // Navigate to link if provided
    if (link) {
      window.location.href = link;
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Toggle notification dropdown
   */
  toggleDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    if (!dropdown) return;

    const isOpen = dropdown.classList.contains('show');
    
    if (isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  /**
   * Open notification dropdown
   */
  openDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    if (!dropdown) return;

    // Load notifications if needed
    if (this.notifications.length === 0) {
      this.loadNotifications();
    } else {
      this.renderDropdown();
    }

    dropdown.classList.add('show');
  }

  /**
   * Close notification dropdown
   */
  closeDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown) {
      dropdown.classList.remove('show');
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    // Unsubscribe from Realtime channel
    if (this.realtimeChannel) {
      this.realtimeChannel.unsubscribe();
      this.realtimeChannel = null;
    }

    this.closeDropdown();
    this.isInitialized = false;
    this.notifications = [];
    this.unreadCount = 0;
  }
}

// Initialize global notification system
if (typeof window !== 'undefined') {
  window.notificationSystem = new NotificationSystem();
  
  // Setup notification toggle button click handler
  function setupNotificationToggle() {
    const toggle = document.getElementById('notificationToggle');
    if (toggle) {
      // Remove any existing listeners
      const newToggle = toggle.cloneNode(true);
      toggle.parentNode.replaceChild(newToggle, toggle);
      
      // Add click handler
      newToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.notificationSystem) {
          window.notificationSystem.toggleDropdown();
        }
        return false;
      });
    }
  }

  // Setup mark all as read button
  function setupMarkAllAsRead() {
    const markAllBtn = document.getElementById('markAllReadBtn');
    if (markAllBtn) {
      markAllBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.notificationSystem) {
          await window.notificationSystem.markAllAsRead();
        }
      });
    }
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('notificationDropdown');
    const toggle = document.getElementById('notificationToggle');
    
    if (dropdown && dropdown.classList.contains('show')) {
      if (!dropdown.contains(e.target) && toggle && !toggle.contains(e.target)) {
        if (window.notificationSystem) {
          window.notificationSystem.closeDropdown();
        }
      }
    }
  });

  // Close dropdown on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const dropdown = document.getElementById('notificationDropdown');
      if (dropdown && dropdown.classList.contains('show')) {
        if (window.notificationSystem) {
          window.notificationSystem.closeDropdown();
        }
      }
    }
  });

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupNotificationToggle();
      setupMarkAllAsRead();
      // Only init if user is authenticated
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (token) {
        window.notificationSystem.init();
      }
    });
  } else {
    setupNotificationToggle();
    setupMarkAllAsRead();
    // Only init if user is authenticated
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (token) {
      window.notificationSystem.init();
    }
  }
}
