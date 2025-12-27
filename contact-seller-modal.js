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
  
  if (!postingId || !toUserId) {
    console.error('Contact Seller modal: postingId and toUserId are required');
    return;
  }
  
  const overlay = document.getElementById('contactModalOverlay');
  const modal = document.getElementById('contactModal');
  const form = document.getElementById('contactModalForm');
  const nameInput = document.getElementById('contactModalName');
  const emailInput = document.getElementById('contactModalEmail');
  const messageInput = document.getElementById('contactModalMessage');
  const postingIdInput = document.getElementById('contactModalPostingId');
  const toUserIdInput = document.getElementById('contactModalToUserId');
  const errorDiv = document.getElementById('contactModalError');
  
  if (!overlay || !modal || !form) {
    console.error('Contact Seller modal elements not found');
    return;
  }
  
  // Set form values
  if (postingIdInput) postingIdInput.value = postingId;
  if (toUserIdInput) toUserIdInput.value = toUserId;
  
  // Pre-fill name/email if user is logged in
  if (typeof getCurrentUser === 'function') {
    const currentUser = getCurrentUser();
    if (currentUser && nameInput && emailInput) {
      nameInput.value = currentUser.username || '';
      emailInput.value = currentUser.email || '';
    }
  }
  
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
      const nameInput = document.getElementById('contactModalName');
      const emailInput = document.getElementById('contactModalEmail');
      const messageInput = document.getElementById('contactModalMessage');
      const errorDiv = document.getElementById('contactModalError');
      const submitBtn = form.querySelector('button[type="submit"]');
      
      if (!postingIdInput || !toUserIdInput || !nameInput || !emailInput || !messageInput) {
        console.error('Contact Seller form: required inputs not found');
        return;
      }
      
      const postingId = parseInt(postingIdInput.value);
      const toUserId = parseInt(toUserIdInput.value);
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();
      
      // Validation
      if (!name) {
        if (errorDiv) {
          errorDiv.textContent = 'Please enter your name';
          errorDiv.style.display = 'block';
        }
        if (nameInput) nameInput.focus();
        return;
      }
      
      if (!email || !email.includes('@')) {
        if (errorDiv) {
          errorDiv.textContent = 'Please enter a valid email address';
          errorDiv.style.display = 'block';
        }
        if (emailInput) emailInput.focus();
        return;
      }
      
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
          
          // Get token if logged in
          const token = typeof getToken === 'function' 
            ? getToken() 
            : (localStorage.getItem('auth_token') || localStorage.getItem('token'));
          
          const headers = { 'Content-Type': 'application/json' };
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
          
          // Send message
          const response = await fetch(`${apiBaseUrl}/messages`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
              postingId: postingId,
              toUserId: toUserId,
              name: name,
              email: email,
              phone: null,
              message: message
            })
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to send message');
          }
          
          // Success - show message and close modal
          if (typeof showNotification === 'function') {
            showNotification('Message sent successfully!');
          } else {
            alert('Message sent successfully!');
          }
          
          closeContactSellerModal();
          
        } catch (error) {
          console.error('Error sending message:', error);
          if (errorDiv) {
            errorDiv.textContent = error.message || 'Failed to send message. Please try again.';
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
}

