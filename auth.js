/**
 * AUTOILTY MARKETPLACE - AUTHENTICATION HELPER
 * 
 * Client-side authentication utilities
 */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
  return !!localStorage.getItem('auth_token');
}

/**
 * Get auth token
 */
function getAuthToken() {
  return localStorage.getItem('auth_token');
}

/**
 * Get current user
 */
function getCurrentUser() {
  const userStr = localStorage.getItem('auth_user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Logout user
 */
function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  window.location.href = 'login.html';
}

/**
 * Get auth headers for API requests
 */
function getAuthHeaders() {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

/**
 * Make authenticated API request
 */
async function authenticatedFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {})
    }
  });

  // If unauthorized, redirect to login
  if (response.status === 401 || response.status === 403) {
    logout();
    throw new Error('Session expired. Please login again.');
  }

  return response;
}

/**
 * Verify token and get current user from server
 */
async function verifyAuth() {
  try {
    const response = await authenticatedFetch('/auth/me');
    if (!response.ok) {
      throw new Error('Invalid token');
    }
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Auth verification failed:', error);
    logout();
    return null;
  }
}

/**
 * Require authentication - redirect to login if not authenticated
 */
function requireAuth(returnUrl = null) {
  if (!isAuthenticated()) {
    const loginUrl = returnUrl 
      ? `login.html?return=${encodeURIComponent(returnUrl)}`
      : `login.html?return=${encodeURIComponent(window.location.pathname)}`;
    window.location.href = loginUrl;
    return false;
  }
  return true;
}

// Export functions globally
window.isAuthenticated = isAuthenticated;
window.getAuthToken = getAuthToken;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
window.getAuthHeaders = getAuthHeaders;
window.authenticatedFetch = authenticatedFetch;
window.verifyAuth = verifyAuth;
window.requireAuth = requireAuth;

