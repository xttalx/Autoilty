/* eslint-env browser */
/**
 * AUTOILTY MARKETPLACE - MESSAGES API
 * 
 * Functions for sending and retrieving messages between buyers and sellers
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

// Get auth token from localStorage (supports both 'auth_token' and 'token' for compatibility)
function getToken() {
  // Try auth_token first (used by auth.js)
  const authToken = localStorage.getItem('auth_token');
  if (authToken) return authToken;
  
  // Fallback to token (for backward compatibility)
  return localStorage.getItem('token');
}

// Check if user is authenticated
function isAuthenticated() {
  return !!getToken();
}

// Redirect to login if not authenticated
function redirectToLogin(returnUrl = null) {
  const currentUrl = returnUrl || window.location.pathname;
  window.location.href = `login.html?return=${encodeURIComponent(currentUrl)}`;
}

/**
 * Send a message to a seller about a posting
 * @param {Object} messageData - { postingId, toUserId, name, email, phone, message }
 * @returns {Promise<Object>} Response with messageId
 */
async function sendMessage(messageData) {
  try {
    // Get token if user is logged in (optional for anonymous messages)
    const token = getToken();
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add auth header only if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${getApiBaseUrl()}/messages`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(messageData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

/**
 * Get inbox messages for the logged-in user
 * @returns {Promise<Object>} Response with messages array
 */
async function getInboxMessages() {
  try {
    const token = getToken();
    if (!token) {
      redirectToLogin();
      throw new Error('Authentication required');
    }

    const response = await fetch(`${getApiBaseUrl()}/messages/inbox`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401 || response.status === 403) {
      // Token expired or invalid - redirect to login
      redirectToLogin();
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch messages');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching inbox:', error);
    throw error;
  }
}

/**
 * Get conversation for a specific posting
 * @param {number} postingId - ID of the posting
 * @returns {Promise<Object>} Response with posting details and messages
 */
async function getConversation(postingId) {
  try {
    const token = getToken();
    if (!token) {
      redirectToLogin();
      throw new Error('Authentication required');
    }

    const response = await fetch(`${getApiBaseUrl()}/messages/conversation/${postingId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401 || response.status === 403) {
      // Token expired or invalid - redirect to login
      redirectToLogin();
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch conversation');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
}

/**
 * Get unread message count for the logged-in user
 * @returns {Promise<number>} Number of unread messages
 */
async function getUnreadCount() {
  try {
    const token = getToken();
    if (!token) {
      return 0; // Not logged in, no unread messages
    }

    // Use dedicated unread-count endpoint if available, otherwise fallback to inbox
    const response = await fetch(`${getApiBaseUrl()}/messages/unread-count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401 || response.status === 403) {
      // Token expired - return 0 (will be handled by other auth checks)
      return 0;
    }

    if (!response.ok) {
      // If endpoint doesn't exist, fallback to counting from inbox
      try {
        const inboxResponse = await fetch(`${getApiBaseUrl()}/messages/inbox`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (inboxResponse.ok) {
          const data = await inboxResponse.json();
          return data.messages ? data.messages.filter(m => !m.read).length : 0;
        }
      } catch (e) {
        // Ignore fallback errors
      }
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
 * Update unread badge in navigation (only shows when logged in)
 */
async function updateUnreadBadge() {
  try {
    const badge = document.getElementById('unreadBadge');
    if (!badge) return;

    // Only show badge if user is authenticated
    if (!isAuthenticated()) {
      badge.style.display = 'none';
      return;
    }

    const count = await getUnreadCount();
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count.toString();
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  } catch (error) {
    console.error('Error updating unread badge:', error);
    const badge = document.getElementById('unreadBadge');
    if (badge) badge.style.display = 'none';
  }
}

// Export functions to global scope
if (typeof window !== 'undefined') {
  window.sendMessage = sendMessage;
  window.getInboxMessages = getInboxMessages;
  window.getConversation = getConversation;
  window.getUnreadCount = getUnreadCount;
  window.updateUnreadBadge = updateUnreadBadge;
}

