/* eslint-env browser */
/**
 * Contact Seller Modal - Reusable modal component
 */

/**
 * Open Contact Seller modal
 * @param {Object} options - { postingId, toUserId, sellerName }
 */
function openContactSellerModal(options) {
  const { postingId, toUserId, sellerName } = options;
  
  // Check if user is authenticated (required)
  if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
    // Redirect to login if not authenticated
    const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `login.html?return=${returnUrl}`;
    return;
  }
  
  // Double check with localStorage
  const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
  if (!token) {
    const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `login.html?return=${returnUrl}`;
    return;
  }
  
  if (!toUserId) {
    console.error('Contact Seller modal: toUserId is required');
    return;
  }
  
  const overlay = document.getElementById('contactModalOverlay');
  const modal = document.getElementById('contactModal');
  const form = document.getElementById('contactModalForm');
  const messageInput = document.getElementById('contactModalMessage');
  const postingIdInput = document.getElementById('contactModalPostingId');
  const toUserIdInput = document.getElementById('contactModalToUserId');
  const errorDiv = document.getElementById('contactModalError');
  
  if (!overlay || !modal || !form) {
    console.error('Contact Seller modal elements not found');
    return;
  }
  
  // Set form values
  if (postingIdInput) postingIdInput.value = postingId || '';
  if (toUserIdInput) toUserIdInput.value = toUserId;
  
  // Clear message and error
  if (messageInput) messageInput.value = '';
  if (errorDiv) {
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
  }
  
  // Show modal
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  // Focus message input after animation
  setTimeout(() => {
    if (messageInput) messageInput.focus();
  }, 300);
  
  // Update title if seller name provided
  const title = modal.querySelector('.contact-modal-header h3');
  if (title && sellerName) {
    title.textContent = `Contact ${sellerName}`;
  }
}

/**
 * Close Contact Seller modal
 */
function closeContactSellerModal() {
  const overlay = document.getElementById('contactModalOverlay');
  const modal = document.getElementById('contactModal');
  const form = document.getElementById('contactModalForm');
  const errorDiv = document.getElementById('contactModalError');
  
  if (overlay) overlay.classList.remove('open');
  if (form) form.reset();
  if (errorDiv) {
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
  }
  
  document.body.style.overflow = '';
}

/**
 * Initialize Contact Seller modal (call on page load)
 */
function initContactSellerModal() {
  const overlay = document.getElementById('contactModalOverlay');
  const closeBtn = document.getElementById('contactModalClose');
  const cancelBtn = document.getElementById('contactModalCancel');
  const form = document.getElementById('contactModalForm');
  
  if (!overlay) return;
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeContactSellerModal();
    }
  });
  
  // Close on X button
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeContactSellerModal();
    });
  }
  
  // Close on Cancel button
  if (cancelBtn) {
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeContactSellerModal();
    });
  }
  
  // Handle form submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const postingIdInput = document.getElementById('contactModalPostingId');
      const toUserIdInput = document.getElementById('contactModalToUserId');
      const messageInput = document.getElementById('contactModalMessage');
      const errorDiv = document.getElementById('contactModalError');
      const submitBtn = form.querySelector('button[type="submit"]');
      
      if (!toUserIdInput || !messageInput) {
        console.error('Contact Seller form: required inputs not found');
        return;
      }
      
      // Check authentication again
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (!token) {
        if (errorDiv) {
          errorDiv.textContent = 'Please log in to send messages';
          errorDiv.style.display = 'block';
        }
        closeContactSellerModal();
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        setTimeout(() => {
          window.location.href = `login.html?return=${returnUrl}`;
        }, 1000);
        return;
      }
      
      const postingId = postingIdInput ? parseInt(postingIdInput.value) : null;
      const toUserId = parseInt(toUserIdInput.value);
      const message = messageInput.value.trim();
      
      // Validation
      if (!message) {
        if (errorDiv) {
          errorDiv.textContent = 'Please enter a message';
          errorDiv.style.display = 'block';
        }
        if (messageInput) messageInput.focus();
        return;
      }
      
      // Hide error
      if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
      }
      
      // Disable submit button
      if (submitBtn) {
        submitBtn.disabled = true;
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i data-lucide="loader" class="btn-icon spin"></i> Sending...';
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
          lucide.createIcons();
        }
        
        try {
          // Get API base URL
          const apiBaseUrl = typeof getApiBaseUrl === 'function' 
            ? getApiBaseUrl() 
            : (window.API_BASE_URL || 'https://autoilty-production.up.railway.app/api');
          
          // Get token (required)
          const token = typeof getToken === 'function' 
            ? getToken() 
            : (localStorage.getItem('auth_token') || localStorage.getItem('token'));
          
          if (!token) {
            throw new Error('Authentication required. Please log in to send messages.');
          }
          
          // Send message using fetch (messages-api.js sendMessage requires different format)
          const response = await fetch(`${apiBaseUrl}/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              postingId: postingId || null,
              toUserId: toUserId,
              message: message
            })
          });
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to send message');
          }
          
          // Success - show message and close modal
          const successMessage = 'Message sent successfully!';
          if (typeof showNotification === 'function') {
            showNotification(successMessage);
          } else {
            alert(successMessage);
          }
          
          closeContactSellerModal();
          
        } catch (error) {
          console.error('Error sending message:', error);
          if (errorDiv) {
            let errorMessage = error.message || 'Failed to send message. Please try again.';
            // Handle authentication errors
            if (errorMessage.includes('401') || errorMessage.includes('403') || errorMessage.includes('Authentication')) {
              errorMessage = 'Please log in to send messages.';
              closeContactSellerModal();
              setTimeout(() => {
                const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
                window.location.href = `login.html?return=${returnUrl}`;
              }, 1000);
            }
            errorDiv.textContent = errorMessage;
            errorDiv.style.display = 'block';
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
              lucide.createIcons();
            }
          }
        }
      }
    });
  }
  
  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.keyCode === 27) {
      if (overlay && overlay.classList.contains('open')) {
        closeContactSellerModal();
      }
    }
  });
}

// Export to global scope
if (typeof window !== 'undefined') {
  window.openContactSellerModal = openContactSellerModal;
  window.closeContactSellerModal = closeContactSellerModal;
  window.initContactSellerModal = initContactSellerModal;
  
  // Also export to module scope for direct access
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { openContactSellerModal, closeContactSellerModal, initContactSellerModal };
  }
}

