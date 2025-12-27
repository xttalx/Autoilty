/* eslint-env browser */
/**
 * Contact Seller Modal - Reusable modal component
 * Handles opening/closing modal and form submission
 */

/**
 * Open Contact Seller modal
 * @param {Object} options - { postingId, toUserId, sellerName }
 */
function openContactSellerModal(options) {
  const { postingId, toUserId, sellerName } = options || {};
  
  // Check if user is authenticated (required)
  if (typeof isAuthenticated === 'function' && !isAuthenticated()) {
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
  
  // Get all required elements with null checks
  const overlay = document.getElementById('contactModalOverlay');
  if (!overlay) {
    console.error('Contact Seller modal: overlay element (#contactModalOverlay) not found');
    return;
  }
  
  const modal = overlay.querySelector('.contact-modal');
  const form = document.getElementById('contactModalForm');
  if (!form) {
    console.error('Contact Seller modal: form element (#contactModalForm) not found');
    return;
  }
  
  const messageInput = document.getElementById('contactModalMessage');
  const postingIdInput = document.getElementById('contactModalPostingId');
  const toUserIdInput = document.getElementById('contactModalToUserId');
  const errorDiv = document.getElementById('contactModalError');
  
  // Set form values
  if (postingIdInput) {
    postingIdInput.value = postingId || '';
  }
  if (toUserIdInput) {
    toUserIdInput.value = toUserId;
  }
  
  // Clear message and error
  if (messageInput) {
    messageInput.value = '';
  }
  if (errorDiv) {
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
  }
  
  // Update title if seller name provided
  if (modal && sellerName) {
    const title = modal.querySelector('.contact-modal-header h3');
    if (title) {
      title.textContent = `Contact ${sellerName}`;
    }
  }
  
  // Show modal
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  // Focus message input after animation
  setTimeout(() => {
    if (messageInput) {
      messageInput.focus();
    }
  }, 300);
}

/**
 * Close Contact Seller modal
 */
function closeContactSellerModal() {
  const overlay = document.getElementById('contactModalOverlay');
  const form = document.getElementById('contactModalForm');
  const errorDiv = document.getElementById('contactModalError');
  
  if (overlay) {
    overlay.classList.remove('open');
  }
  
  if (form) {
    form.reset();
  }
  
  if (errorDiv) {
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
  }
  
  document.body.style.overflow = '';
}

/**
 * Initialize Contact Seller modal (call on page load)
 * Sets up event listeners for close buttons and form submission
 */
function initContactSellerModal() {
  const overlay = document.getElementById('contactModalOverlay');
  if (!overlay) {
    console.warn('Contact Seller modal: overlay element not found, modal may not work');
    return;
  }
  
  const closeBtn = document.getElementById('contactModalClose');
  const cancelBtn = document.getElementById('contactModalCancel');
  const form = document.getElementById('contactModalForm');
  
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
        if (errorDiv) {
          errorDiv.textContent = 'Form error: required fields missing';
          errorDiv.style.display = 'block';
        }
        return;
      }
      
      // Check authentication
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
      
      const postingId = postingIdInput ? (postingIdInput.value ? parseInt(postingIdInput.value) : null) : null;
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
      
      // Disable submit button and show loading state
      let originalHTML = '';
      if (submitBtn) {
        submitBtn.disabled = true;
        originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i data-lucide="loader" class="btn-icon spin"></i> Sending...';
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
          lucide.createIcons();
        }
      }
      
      try {
        // Get API base URL
        let apiBaseUrl = 'https://autoilty-production.up.railway.app/api';
        if (typeof getApiBaseUrl === 'function') {
          apiBaseUrl = getApiBaseUrl();
        } else if (window.API_BASE_URL) {
          apiBaseUrl = window.API_BASE_URL;
        }
        
        // Send message to backend
        const response = await fetch(`${apiBaseUrl}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            postingId: postingId,
            toUserId: toUserId,
            message: message
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to send message');
        }
        
        // Success - show notification and close modal
        const successMessage = 'Message sent!';
        if (typeof showNotification === 'function') {
          showNotification(successMessage);
        } else {
          alert(successMessage);
        }
        
        closeContactSellerModal();
        
      } catch (error) {
        console.error('Error sending message:', error);
        
        // Show error message
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
        
        // Re-enable submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
          if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
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
}
