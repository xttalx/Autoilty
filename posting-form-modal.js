/**
 * AUTOILTY - POSTING FORM MODAL
 * Reusable posting form modal that can be opened from any page
 */

// Global state
let editingPostingId = null;

/**
 * Open the posting form modal
 * @param {number|null} postingId - If provided, opens in edit mode for that posting
 */
async function openPostingFormModal(postingId = null) {
  // Check if modal HTML exists, if not create it
  let modal = document.getElementById('postingFormModal');
  
  if (!modal) {
    createPostingFormModal();
    modal = document.getElementById('postingFormModal');
  }
  
  if (!modal) {
    console.error('Could not create posting form modal');
    return;
  }
  
  editingPostingId = postingId;
  const modalTitle = document.getElementById('postingFormModalTitle');
  const postingForm = document.getElementById('postingFormModalForm');
  const imagePreview = document.getElementById('postingFormImagePreview');
  const previewImg = document.getElementById('postingFormPreviewImg');
  
  try {
    // Reset form
    if (postingForm) {
      postingForm.reset();
    }
    if (imagePreview) {
      imagePreview.style.display = 'none';
    }
    
    if (postingId) {
      // Edit mode - load existing posting
      if (modalTitle) {
        modalTitle.textContent = 'Edit Posting';
      }
      
      // Fetch posting data
      const apiUrl = window.API_URL || 'https://autoilty-production.up.railway.app/api';
      const token = getAuthToken();
      
      if (!token) {
        // Redirect to login if not authenticated
        window.location.href = `login.html?return=${encodeURIComponent(window.location.href)}`;
        return;
      }
      
      try {
        const response = await fetch(`${apiUrl}/postings/${postingId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to load posting');
        }
        
        const posting = await response.json();
        
        // Populate form
        document.getElementById('postingFormTitle').value = posting.title || '';
        document.getElementById('postingFormDescription').value = posting.description || '';
        document.getElementById('postingFormPrice').value = posting.price || '';
        document.getElementById('postingFormCategory').value = posting.category || '';
        document.getElementById('postingFormLocation').value = posting.location || '';
        
        // Show existing image if available
        if (posting.image_url && previewImg) {
          previewImg.src = posting.image_url;
          if (imagePreview) {
            imagePreview.style.display = 'block';
          }
        }
      } catch (error) {
        console.error('Error loading posting:', error);
        alert('Failed to load posting. Please try again.');
        return;
      }
    } else {
      // Create mode
      if (modalTitle) {
        modalTitle.textContent = 'Create New Posting';
      }
    }
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Initialize icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  } catch (error) {
    console.error('Error opening posting form modal:', error);
  }
}

/**
 * Close the posting form modal
 */
function closePostingFormModal() {
  const modal = document.getElementById('postingFormModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  const form = document.getElementById('postingFormModalForm');
  if (form) {
    form.reset();
  }
  
  const imagePreview = document.getElementById('postingFormImagePreview');
  if (imagePreview) {
    imagePreview.style.display = 'none';
  }
  
  editingPostingId = null;
}

/**
 * Create the posting form modal HTML structure
 */
function createPostingFormModal() {
  const modalHTML = `
    <div class="modal-overlay" id="postingFormModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); z-index: 1000; align-items: center; justify-content: center; overflow-y: auto;">
      <div class="modal" style="background: white; border-radius: 12px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto; margin: 2rem auto; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
        <div class="modal-header" style="padding: var(--spacing-lg); border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center;">
          <h2 class="modal-title" id="postingFormModalTitle" style="margin: 0; font-size: 1.5rem; font-weight: 600;">Create New Posting</h2>
          <button class="modal-close" id="postingFormModalClose" aria-label="Close modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: background 0.2s;">
            <i data-lucide="x"></i>
          </button>
        </div>
        <form id="postingFormModalForm" class="modal-body" style="padding: var(--spacing-lg);">
          <div class="form-group" style="margin-bottom: var(--spacing-md);">
            <label for="postingFormTitle" class="form-label" style="display: block; margin-bottom: var(--spacing-xs); font-weight: 500;">Title *</label>
            <input 
              type="text" 
              id="postingFormTitle" 
              name="title" 
              class="form-input" 
              placeholder="e.g., 2020 Toyota Camry"
              required
              style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 8px; font-size: 1rem;"
            >
          </div>

          <div class="form-group" style="margin-bottom: var(--spacing-md);">
            <label for="postingFormDescription" class="form-label" style="display: block; margin-bottom: var(--spacing-xs); font-weight: 500;">Description *</label>
            <textarea 
              id="postingFormDescription" 
              name="description" 
              class="form-input" 
              rows="4"
              placeholder="Describe your item in detail..."
              required
              style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 8px; font-size: 1rem; resize: vertical; font-family: inherit;"
            ></textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); margin-bottom: var(--spacing-md);">
            <div class="form-group">
              <label for="postingFormPrice" class="form-label" style="display: block; margin-bottom: var(--spacing-xs); font-weight: 500;">Price (CAD) *</label>
              <input 
                type="number" 
                id="postingFormPrice" 
                name="price" 
                class="form-input" 
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 8px; font-size: 1rem;"
              >
            </div>

            <div class="form-group">
              <label for="postingFormCategory" class="form-label" style="display: block; margin-bottom: var(--spacing-xs); font-weight: 500;">Category *</label>
              <select 
                id="postingFormCategory" 
                name="category" 
                class="form-select"
                required
                style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 8px; font-size: 1rem; background: white;"
              >
                <option value="">Select category</option>
                <option value="Cars">Cars</option>
                <option value="Parts">Parts</option>
                <option value="Services">Services</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: var(--spacing-md);">
            <label for="postingFormLocation" class="form-label" style="display: block; margin-bottom: var(--spacing-xs); font-weight: 500;">Location</label>
            <input 
              type="text" 
              id="postingFormLocation" 
              name="location" 
              class="form-input" 
              placeholder="e.g., Toronto, ON"
              style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 8px; font-size: 1rem;"
            >
          </div>

          <div class="form-group" style="margin-bottom: var(--spacing-md);">
            <label for="postingFormImage" class="form-label" style="display: block; margin-bottom: var(--spacing-xs); font-weight: 500;">Image</label>
            <input 
              type="file" 
              id="postingFormImage" 
              name="image" 
              class="form-input" 
              accept="image/*"
              style="width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 8px; font-size: 1rem;"
            >
            <p class="form-hint" style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--color-text-light);">Upload an image (max 5MB, JPEG/PNG/GIF/WebP)</p>
            <div id="postingFormImagePreview" style="margin-top: var(--spacing-sm); display: none;">
              <img id="postingFormPreviewImg" src="" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 1px solid var(--color-border);">
            </div>
          </div>

          <div class="form-message" id="postingFormMessage" style="display: none; padding: var(--spacing-sm); border-radius: 8px; margin-bottom: var(--spacing-md);"></div>

          <div class="modal-footer" style="padding-top: var(--spacing-md); border-top: 1px solid var(--color-border); display: flex; justify-content: flex-end; gap: var(--spacing-sm);">
            <button type="button" class="btn btn-secondary" id="postingFormCancelBtn" style="padding: 0.75rem 1.5rem; border: 1px solid var(--color-border); border-radius: 8px; background: white; cursor: pointer; font-weight: 500;">Cancel</button>
            <button type="submit" class="btn btn-primary" id="postingFormSubmitBtn" style="padding: 0.75rem 1.5rem; background: var(--color-primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem;">
              <i data-lucide="save" class="btn-icon"></i>
              Save Posting
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  // Insert modal into body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Setup event listeners
  setupPostingFormModalListeners();
}

/**
 * Setup event listeners for the posting form modal
 */
function setupPostingFormModalListeners() {
  // Close button
  const closeBtn = document.getElementById('postingFormModalClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', closePostingFormModal);
  }
  
  // Cancel button
  const cancelBtn = document.getElementById('postingFormCancelBtn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closePostingFormModal);
  }
  
  // Close on overlay click
  const modal = document.getElementById('postingFormModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'postingFormModal') {
        closePostingFormModal();
      }
    });
  }
  
  // Image preview
  const imageInput = document.getElementById('postingFormImage');
  if (imageInput) {
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const previewImg = document.getElementById('postingFormPreviewImg');
          const imagePreview = document.getElementById('postingFormImagePreview');
          if (previewImg) {
            previewImg.src = e.target.result;
          }
          if (imagePreview) {
            imagePreview.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
  
  // Form submission
  const form = document.getElementById('postingFormModalForm');
  if (form) {
    form.addEventListener('submit', handlePostingFormSubmit);
  }
}

/**
 * Handle posting form submission
 */
async function handlePostingFormSubmit(e) {
  e.preventDefault();
  
  // Check authentication
  if (typeof getAuthToken === 'undefined' || typeof isAuthenticated === 'undefined') {
    // Redirect to login if auth functions not available
    window.location.href = `login.html?return=${encodeURIComponent(window.location.href)}`;
    return;
  }
  
  if (!isAuthenticated()) {
    window.location.href = `login.html?return=${encodeURIComponent(window.location.href)}`;
    return;
  }
  
  const form = e.target;
  const formData = new FormData(form);
  const isEdit = editingPostingId !== null;
  const apiUrl = window.API_URL || 'https://autoilty-production.up.railway.app/api';
  const url = isEdit 
    ? `${apiUrl}/postings/${editingPostingId}`
    : `${apiUrl}/postings`;

  const submitBtn = document.getElementById('postingFormSubmitBtn');
  const formMessage = document.getElementById('postingFormMessage');

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i data-lucide="loader-2" class="btn-icon"></i> Saving...';
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }
  
  if (formMessage) {
    formMessage.style.display = 'none';
  }

  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: headers,
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to save posting');
    }

    // Show success message
    if (typeof showNotification === 'function') {
      showNotification(isEdit ? 'Posting updated successfully!' : 'Posting created successfully!', 'success');
    } else {
      alert(isEdit ? 'Posting updated successfully!' : 'Posting created successfully!');
    }
    
    closePostingFormModal();
    
    // Reload current page or redirect to my-postings if on my-postings page
    if (window.location.pathname.includes('my-postings.html')) {
      window.location.reload();
    } else {
      // Refresh marketplace or current page to show new posting
      window.location.reload();
    }
  } catch (error) {
    console.error('Error saving posting:', error);
    if (formMessage) {
      formMessage.textContent = error.message || 'Failed to save posting. Please try again.';
      formMessage.className = 'form-message form-message-error';
      formMessage.style.backgroundColor = '#fee';
      formMessage.style.color = '#c33';
      formMessage.style.display = 'block';
    }
    
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i data-lucide="save" class="btn-icon"></i> Save Posting';
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      }
    }
  }
}

// Make functions globally available
if (typeof window !== 'undefined') {
  window.openPostingFormModal = openPostingFormModal;
  window.closePostingFormModal = closePostingFormModal;
}

