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

/**
 * Send a message to a seller about a posting
 * @param {Object} messageData - { postingId, toUserId, name, email, phone, message }
 * @returns {Promise<Object>} Response with messageId
 */
async function sendMessage(messageData) {
  try {
    // Get token if user is logged in (optional for anonymous messages)
    const token = localStorage.getItem('token');
    
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
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${getApiBaseUrl()}/messages/inbox`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

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
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${getApiBaseUrl()}/messages/conversation/${postingId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

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
    const token = localStorage.getItem('token');
    if (!token) {
      return 0;
    }

    const response = await fetch(`${getApiBaseUrl()}/messages/inbox`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return 0;
    }

    const data = await response.json();
    const unreadCount = data.messages ? data.messages.filter(m => !m.read).length : 0;
    return unreadCount;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
}

/**
 * Update unread badge in navigation
 */
async function updateUnreadBadge() {
  try {
    const badge = document.getElementById('unreadBadge');
    if (!badge) return;

    const count = await getUnreadCount();
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count.toString();
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  } catch (error) {
    console.error('Error updating unread badge:', error);
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

