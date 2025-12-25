/* eslint-env browser */  
// SAFE API_BASE_URL - NO REDECLARATION ERROR
if (typeof window !== 'undefined') {

  if (!window.API_BASE_URL_SET) {

    let baseUrl = 'https://autoilty-production.up.railway.app/api';  // Default



    if (window.API_URL) {

      baseUrl = window.API_URL;

    } else if (window.API_BASE_URL) {

      baseUrl = window.API_BASE_URL;

    }



    window.API_BASE_URL = baseUrl;

    window.API_BASE_URL_SET = true;  // Prevent re-running

  }

}



// Use the safe global value - no const redeclaration
// Access window.API_BASE_URL directly to avoid redeclaration errors on multiple script loads
function getApiBaseUrl() {
  return window.API_BASE_URL || 'https://autoilty-production.up.railway.app/api';
}



/**

 * Fetch all postings from API

 */

async function fetchPostings(filters = {}) {

  try {

    const params = new URLSearchParams();

    if (filters.category) params.append('category', filters.category);

    if (filters.search) params.append('search', filters.search);

    if (filters.page) params.append('page', filters.page);

    if (filters.limit) params.append('limit', filters.limit);



    const url = `${getApiBaseUrl()}/postings${params.toString() ? '?' + params.toString() : ''}`;

    const response = await fetch(url);



    if (!response.ok) {

      throw new Error('Failed to fetch postings');

    }



    const data = await response.json();

    return data;

  } catch (error) {

    console.error('Error fetching postings:', error);

    throw error;

  }

}



/**

 * Fetch single posting

 */

async function fetchPosting(id) {

  try {

    const response = await fetch(`${getApiBaseUrl()}/postings/${id}`);

    if (!response.ok) {

      throw new Error('Failed to fetch posting');

    }

    return await response.json();

  } catch (error) {

    console.error('Error fetching posting:', error);

    throw error;

  }

}



/**

 * Convert posting to product format for compatibility

 */

function postingToProduct(posting) {
  return {
    id: posting.id,
    name: posting.title,
    title: posting.title,
    price: parseFloat(posting.price),
    category: posting.category.toLowerCase(),
    image: posting.image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==',
    description: posting.description,
    location: posting.location,
    username: posting.username,
    created_at: posting.created_at
  };
}



/**

 * Render postings as product cards

 */

function renderPostingsAsProducts(postings, container) {
  // Store postings globally for Contact Seller button access
  if (typeof window !== 'undefined') {
    window.currentPostings = postings;
  }

  if (!postings || postings.length === 0) {

    container.innerHTML = `

      <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-xxl);">

        <i data-lucide="package" style="width: 4rem; height: 4rem; margin: 0 auto var(--spacing-md); color: var(--color-text-light); display: block;"></i>

        <h3 style="margin-bottom: var(--spacing-xs);">No postings yet</h3>

        <p style="color: var(--color-text-light); margin-bottom: var(--spacing-md);">Be the first to create one!</p>

        <a href="my-postings.html" class="btn btn-primary" style="display: inline-flex;">

          <i data-lucide="plus" class="btn-icon"></i>

          Create Posting

        </a>

      </div>

    `;

    if (typeof lucide !== 'undefined' && lucide.createIcons) {

      lucide.createIcons();

    }

    return;

  }



  container.innerHTML = postings.map(posting => {

    const product = postingToProduct(posting);

    return `

      <div class="product-card" data-product-id="${product.id}" data-posting-user-id="${posting.user_id}">

        <div class="product-image">

          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">

        </div>

        <div class="product-info">

          <span class="product-category">${product.category.toUpperCase()}</span>

          <h3 class="product-name">${product.name}</h3>

          ${product.location ? `<p style="font-size: 0.875rem; color: var(--color-text-light); margin: var(--spacing-xs) 0;"><i data-lucide="map-pin" style="width: 0.875rem; height: 0.875rem; display: inline-block;"></i> ${product.location}</p>` : ''}

          <p class="product-price">$${product.price.toFixed(2)} CAD</p>

          <p style="font-size: 0.875rem; color: var(--color-text-light); margin-bottom: var(--spacing-sm);">by ${product.username}</p>

          <button class="btn btn-primary btn-full contact-seller-btn" data-posting-id="${product.id}" data-posting-user-id="${posting.user_id}" data-seller-username="${product.username}" style="margin-top: var(--spacing-sm); padding: var(--spacing-xs) var(--spacing-sm); font-size: 0.875rem;">
            <i data-lucide="message-circle" class="btn-icon"></i>
            Contact Seller
          </button>
          
          <!-- Inline message form (hidden by default) -->
          <div class="contact-form-container" data-posting-id="${product.id}" style="display: none; margin-top: var(--spacing-sm); padding: var(--spacing-sm); background: #f9f9f9; border-radius: var(--radius); border: 1px solid var(--color-border);">
            <form class="contact-form-inline" data-posting-id="${product.id}">
              <input type="hidden" name="postingId" value="${product.id}">
              <input type="hidden" name="toUserId" value="${posting.user_id}">
              <input type="hidden" name="fromName" id="contactName_${product.id}" value="">
              <input type="hidden" name="fromEmail" id="contactEmail_${product.id}" value="">
              
              <div class="form-group" style="margin-bottom: var(--spacing-xs);">
                <textarea name="message" class="form-input" rows="3" placeholder="Type your message..." required style="font-size: 0.875rem; padding: var(--spacing-xs); resize: vertical;" id="contactMessage_${product.id}"></textarea>
              </div>
              
              <div class="contact-form-error" data-posting-id="${product.id}" style="color: var(--color-error); font-size: 0.75rem; margin-bottom: var(--spacing-xs); display: none;"></div>
              
              <div style="display: flex; gap: var(--spacing-xs);">
                <button type="submit" class="btn btn-primary" style="flex: 1; padding: var(--spacing-xs); font-size: 0.875rem;">
                  <i data-lucide="send" class="btn-icon" style="width: 0.875rem; height: 0.875rem;"></i>
                  Send
                </button>
                <button type="button" class="btn btn-secondary contact-form-cancel" data-posting-id="${product.id}" style="padding: var(--spacing-xs); font-size: 0.875rem;">
                  Cancel
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

    `;

  }).join('');



  if (typeof lucide !== 'undefined' && lucide.createIcons) {

    lucide.createIcons();

  }



  container.querySelectorAll('.product-card').forEach(card => {

    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {

      // Don't navigate if clicking the Contact Seller button
      if (e.target.closest('.contact-seller-btn')) {
        return;
      }

      const productId = card.dataset.productId;

      if (productId) {

        // Navigate to posting detail page

        window.location.href = `posting-detail.html?id=${productId}`;

      }

    });

  });

  // Add Contact Seller button handlers - show/hide inline form
  container.querySelectorAll('.contact-seller-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      const postingId = btn.dataset.postingId;
      if (!postingId) {
        console.error('Posting ID not found');
        return;
      }
      
      // Find the inline form container for this posting
      const formContainer = container.querySelector(`.contact-form-container[data-posting-id="${postingId}"]`);
      if (!formContainer) {
        console.error('Contact form container not found');
        return;
      }
      
      // Toggle form visibility
      const isVisible = formContainer.style.display !== 'none';
      
      if (isVisible) {
        // Hide form
        formContainer.style.display = 'none';
      } else {
        // Show form and pre-fill if user is logged in
        formContainer.style.display = 'block';
        
        // Pre-fill name and email if user is logged in
        if (typeof getCurrentUser === 'function' && typeof isAuthenticated === 'function') {
          const currentUser = getCurrentUser();
          if (currentUser && isAuthenticated()) {
            const nameInput = formContainer.querySelector(`#contactName_${postingId}`);
            const emailInput = formContainer.querySelector(`#contactEmail_${postingId}`);
            if (nameInput) nameInput.value = currentUser.username || '';
            if (emailInput) emailInput.value = currentUser.email || '';
          }
        }
        
        // Scroll form into view
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      
      // Re-initialize icons
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      }
    });
  });
  
  // Handle form submissions
  container.querySelectorAll('.contact-form-inline').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const postingId = form.dataset.postingId;
      const formContainer = form.closest('.contact-form-container');
      const errorDiv = formContainer ? formContainer.querySelector('.contact-form-error') : null;
      
      if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
      }
      
      const formData = {
        postingId: parseInt(form.querySelector('input[name="postingId"]')?.value),
        toUserId: parseInt(form.querySelector('input[name="toUserId"]')?.value),
        name: form.querySelector('input[name="fromName"]')?.value.trim() || '',
        email: form.querySelector('input[name="fromEmail"]')?.value.trim() || '',
        message: form.querySelector('textarea[name="message"]')?.value.trim() || ''
      };
      
      // Pre-fill from logged-in user if available
      if (typeof getCurrentUser === 'function' && typeof isAuthenticated === 'function') {
        const currentUser = getCurrentUser();
        if (currentUser && isAuthenticated()) {
          if (!formData.name) formData.name = currentUser.username || '';
          if (!formData.email) formData.email = currentUser.email || '';
        }
      }
      
      // Validation
      if (!formData.message) {
        if (errorDiv) {
          errorDiv.textContent = 'Message is required';
          errorDiv.style.display = 'block';
        }
        return;
      }
      
      if (!formData.name || !formData.email) {
        if (errorDiv) {
          errorDiv.textContent = 'Name and email are required';
          errorDiv.style.display = 'block';
        }
        return;
      }
      
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader" class="btn-icon spin"></i> Sending...';
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
          lucide.createIcons();
        }
      }
      
      try {
        // Get API base URL
        const apiBaseUrl = typeof window !== 'undefined' && window.API_BASE_URL 
          ? window.API_BASE_URL 
          : 'https://autoilty-production.up.railway.app/api';
        
        const response = await fetch(`${apiBaseUrl}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send message');
        }
        
        // Success - show message and hide form
        if (formContainer) {
          formContainer.style.display = 'none';
        }
        
        // Show success notification
        if (typeof showNotification === 'function') {
          showNotification('Message sent successfully!');
        } else {
          alert('Message sent successfully!');
        }
        
        // Reset form
        form.reset();
        
      } catch (error) {
        console.error('Error sending message:', error);
        if (errorDiv) {
          errorDiv.textContent = error.message || 'Failed to send message. Please try again.';
          errorDiv.style.display = 'block';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i data-lucide="send" class="btn-icon"></i> Send';
          if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
          }
        }
      }
    });
  });
  
  // Handle cancel buttons
  container.querySelectorAll('.contact-form-cancel').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const postingId = btn.dataset.postingId;
      if (!postingId) return;
      
      const formContainer = container.querySelector(`.contact-form-container[data-posting-id="${postingId}"]`);
      if (formContainer) {
        formContainer.style.display = 'none';
        const form = formContainer.querySelector('.contact-form-inline');
        if (form) form.reset();
        const errorDiv = formContainer.querySelector('.contact-form-error');
        if (errorDiv) {
          errorDiv.style.display = 'none';
          errorDiv.textContent = '';
        }
      }
    });
  });

}



/**
 * Get base URL for images (backend serves uploads at root level)
 */
function getImageBaseUrl() {
  if (typeof window !== 'undefined' && window.API_URL) {
    // Remove /api suffix to get base URL
    return window.API_URL.replace('/api', '');
  }
  return 'https://autoilty-production.up.railway.app';
}

/**
 * Construct full image URL from posting image_url field
 * image_url is now a full Supabase Storage URL, so return as-is
 */
function getPostingImageUrl(imageUrl) {
  if (!imageUrl) {
    // Return a data URI SVG placeholder instead of external URL
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
  }
  
  // If already a full URL (from Supabase Storage), return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Legacy support: if it's a relative path, prepend base URL (for old postings)
  const baseUrl = getImageBaseUrl();
  const imagePath = imageUrl.startsWith('/') 
    ? imageUrl 
    : `/${imageUrl}`;
  return `${baseUrl}${imagePath}`;
}

// Export functions to global scope

if (typeof window !== 'undefined') {

  window.fetchPostings = fetchPostings;

  window.fetchPosting = fetchPosting;

  window.postingToProduct = postingToProduct;

  window.renderPostingsAsProducts = renderPostingsAsProducts;

  window.getPostingImageUrl = getPostingImageUrl;

  window.getImageBaseUrl = getImageBaseUrl;

}
