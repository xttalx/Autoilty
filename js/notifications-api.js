/**
 * AUTOILTY MARKETPLACE - NOTIFICATIONS API (CLIENT-SIDE)
 * 
 * Client-side notification utilities and API calls
 */

// Get API base URL
function getApiBaseUrl() {
  if (typeof window !== 'undefined' && window.API_BASE_URL) {
    return window.API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.API_URL) {
    return window.API_URL;
  }
  return 'https://autoilty-production.up.railway.app/api';
}

// Get auth token
function getToken() {
  const authToken = localStorage.getItem('auth_token');
  if (authToken) return authToken;
  return localStorage.getItem('token');
}

// Check if user is authenticated
function isAuthenticated() {
  return !!getToken();
}

/**
 * Get user notifications
 * @param {Object} options - { limit, offset, unreadOnly }
 * @returns {Promise<Object>} Response with notifications array
 */
async function getNotifications(options = {}) {
  try {
    if (!isAuthenticated()) {
      return { notifications: [] };
    }

    const { limit = 50, offset = 0, unreadOnly = false } = options;
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      unreadOnly: unreadOnly.toString()
    });

    const token = getToken();
    const response = await fetch(`${getApiBaseUrl()}/notifications?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { notifications: [] };
  }
}

/**
 * Get unread notification count
 * @returns {Promise<number>} Unread count
 */
async function getUnreadNotificationCount() {
  try {
    if (!isAuthenticated()) {
      return 0;
    }

    const token = getToken();
    const response = await fetch(`${getApiBaseUrl()}/notifications/unread-count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return 0;
    }

    const data = await response.json();
    return data.unreadCount || 0;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
}

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<boolean>} Success status
 */
async function markNotificationAsRead(notificationId) {
  try {
    if (!isAuthenticated()) {
      return false;
    }

    const token = getToken();
    const response = await fetch(`${getApiBaseUrl()}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
}

/**
 * Mark all notifications as read
 * @returns {Promise<number>} Number of notifications marked as read
 */
async function markAllNotificationsAsRead() {
  try {
    if (!isAuthenticated()) {
      return 0;
    }

    const token = getToken();
    const response = await fetch(`${getApiBaseUrl()}/notifications/read-all`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return 0;
    }

    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return 0;
  }
}

/**
 * Format time ago string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted time ago
 */
function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.notificationsAPI = {
    getNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    formatTimeAgo
  };
}
