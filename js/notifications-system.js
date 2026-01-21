/**
 * AUTOILTY MARKETPLACE - NOTIFICATIONS SYSTEM
 * 
 * Real-time notification management with UI components
 */

class NotificationSystem {
  constructor() {
    this.notifications = [];
    this.unreadCount = 0;
    this.pollInterval = null;
    this.pollIntervalMs = 30000; // 30 seconds
    this.isInitialized = false;
    this.callbacks = {
      onNewNotification: [],
      onUnreadCountChange: []
    };
  }

  /**
   * Initialize notification system
   */
  async init() {
    if (this.isInitialized) return;
    
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (!token) {
      console.log('User not authenticated, skipping notification initialization');
      return;
    }

    // Load initial notifications
    await this.loadNotifications();
    await this.loadUnreadCount();

    // Start polling for new notifications
    this.startPolling();

    this.isInitialized = true;
    console.log('✅ Notification system initialized');
  }

  /**
   * Load notifications from API
   */
  async loadNotifications() {
    try {
      if (!window.notificationsAPI) {
        console.error('notificationsAPI not available');
        return;
      }

      const data = await window.notificationsAPI.getNotifications({ limit: 50 });
      const previousCount = this.unreadCount;
      this.notifications = data.notifications || [];
      
      // Calculate unread count
      this.unreadCount = this.notifications.filter(n => !n.read_at).length;
      
      // Trigger callbacks if unread count changed
      if (this.unreadCount !== previousCount) {
        this.triggerUnreadCountChange();
      }

      this.updateUI();
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  /**
   * Load unread count from API
   */
  async loadUnreadCount() {
    try {
      if (!window.notificationsAPI) {
        return;
      }

      const previousCount = this.unreadCount;
      this.unreadCount = await window.notificationsAPI.getUnreadNotificationCount();
      
      if (this.unreadCount !== previousCount) {
        this.triggerUnreadCountChange();
      }

      this.updateUI();
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  }

  /**
   * Start polling for new notifications
   */
  startPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }

    this.pollInterval = setInterval(() => {
      this.loadUnreadCount();
      // Also check for new notifications occasionally
      if (Math.random() < 0.3) { // 30% chance to load full notifications
        this.loadNotifications();
      }
    }, this.pollIntervalMs);
  }

  /**
   * Stop polling
   */
  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    try {
      if (!window.notificationsAPI) {
        return false;
      }

      const success = await window.notificationsAPI.markNotificationAsRead(notificationId);
      
      if (success) {
        // Update local state
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read_at) {
          notification.read_at = new Date().toISOString();
          this.unreadCount = Math.max(0, this.unreadCount - 1);
          this.triggerUnreadCountChange();
          this.updateUI();
        }
      }

      return success;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      if (!window.notificationsAPI) {
        return 0;
      }

      const count = await window.notificationsAPI.markAllNotificationsAsRead();
      
      if (count > 0) {
        // Update local state
        this.notifications.forEach(n => {
          if (!n.read_at) {
            n.read_at = new Date().toISOString();
          }
        });
        this.unreadCount = 0;
        this.triggerUnreadCountChange();
        this.updateUI();
      }

      return count;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return 0;
    }
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
        console.error('Error in unread count change callback:', error);
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
    if (dropdown && dropdown.style.display !== 'none') {
      this.renderDropdown();
    }
  }

  /**
   * Render notification dropdown
   */
  renderDropdown() {
    const container = document.getElementById('notificationList');
    if (!container) return;

    if (this.notifications.length === 0) {
      container.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--color-text-light);">
          <i data-lucide="bell-off" style="width: 3rem; height: 3rem; margin: 0 auto 1rem; display: block; opacity: 0.5;"></i>
          <p>No notifications yet</p>
        </div>
      `;
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      }
      return;
    }

    container.innerHTML = this.notifications.map(notification => {
      const isUnread = !notification.read_at;
      const timeAgo = window.notificationsAPI?.formatTimeAgo(notification.created_at) || '';
      
      let icon = 'message-circle';
      if (notification.type === 'question') icon = 'help-circle';
      else if (notification.type === 'posting_update') icon = 'file-text';
      else if (notification.type === 'system') icon = 'info';

      return `
        <div 
          class="notification-item ${isUnread ? 'unread' : ''}" 
          data-notification-id="${notification.id}"
          style="padding: 1rem; border-bottom: 1px solid var(--color-border); cursor: pointer; transition: background-color 0.2s; ${isUnread ? 'background-color: #f0f7ff;' : ''}"
          onclick="window.notificationSystem.handleNotificationClick('${notification.id}', '${notification.link || ''}')"
        >
          <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
            <div style="flex-shrink: 0; margin-top: 0.25rem;">
              <i data-lucide="${icon}" style="width: 1.25rem; height: 1.25rem; color: var(--color-primary);"></i>
            </div>
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.25rem;">
                <h4 style="font-size: 0.875rem; font-weight: ${isUnread ? '600' : '500'}; margin: 0; color: var(--color-text);">
                  ${this.escapeHtml(notification.title)}
                </h4>
                ${isUnread ? '<div style="width: 8px; height: 8px; background: var(--color-primary); border-radius: 50%; flex-shrink: 0; margin-top: 0.25rem;"></div>' : ''}
              </div>
              ${notification.body ? `<p style="font-size: 0.8125rem; color: var(--color-text-light); margin: 0 0 0.5rem 0; line-height: 1.4;">${this.escapeHtml(notification.body)}</p>` : ''}
              <p style="font-size: 0.75rem; color: var(--color-text-light); margin: 0;">${timeAgo}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
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
    const overlay = document.getElementById('notificationOverlay');
    
    if (!dropdown || !overlay) return;

    const isOpen = dropdown.style.display !== 'none';
    
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
    const overlay = document.getElementById('notificationOverlay');
    
    if (!dropdown || !overlay) return;

    // Load notifications if needed
    if (this.notifications.length === 0) {
      this.loadNotifications();
    } else {
      this.renderDropdown();
    }

    dropdown.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close notification dropdown
   */
  closeDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    const overlay = document.getElementById('notificationOverlay');
    
    if (dropdown) dropdown.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stopPolling();
    this.closeDropdown();
    this.isInitialized = false;
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
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupNotificationToggle();
      // Only init if user is authenticated
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (token) {
        window.notificationSystem.init();
      }
    });
  } else {
    setupNotificationToggle();
    // Only init if user is authenticated
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (token) {
      window.notificationSystem.init();
    }
  }
}
