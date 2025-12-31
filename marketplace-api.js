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
  // Clean up image URL - ensure it's a valid full URL or use placeholder
  let imageUrl = posting.image_url || '';
  
  // If image_url exists and is a full URL, use it as-is
  if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
    // Fix any double slashes after https://
    imageUrl = imageUrl.replace(/https:\/\/([^/])/, 'https://$1');
  } else if (imageUrl && !imageUrl.startsWith('data:')) {
    // Legacy support: if it's a relative path, prepend base URL
    const baseUrl = 'https://autoilty-production.up.railway.app';
    imageUrl = imageUrl.startsWith('/') ? `${baseUrl}${imageUrl}` : `${baseUrl}/${imageUrl}`;
  } else if (!imageUrl) {
    // Use placeholder if no image
    imageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
  }
  
  return {
    id: posting.id,
    name: posting.title,
    title: posting.title,
    price: parseFloat(posting.price),
    category: posting.category.toLowerCase(),
    image: imageUrl,
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

          <button class="btn btn-primary btn-full contact-seller-btn" 
                  data-posting-id="${product.id}" 
                  data-posting-user-id="${posting.user_id}" 
                  data-seller-username="${product.username || 'Seller'}"
                  type="button"
                  style="margin-top: var(--spacing-sm);">
            <i data-lucide="message-circle" class="btn-icon"></i>
            Contact Seller
          </button>

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

      // Don't navigate if clicking the Contact Seller button, form, or any interactive element
      if (e.target.closest('.contact-seller-btn') || 
          e.target.closest('.contact-form-container') || 
          e.target.closest('.contact-form-inline') ||
          e.target.closest('textarea') ||
          e.target.closest('button[type="submit"]') ||
          e.target.closest('button[type="button"].contact-form-cancel')) {
        return;
      }

      const productId = card.dataset.productId;

      if (productId) {

        // Navigate to posting detail page

        window.location.href = `posting-detail.html?id=${productId}`;

      }

    });

  });

  // Add Contact Seller button handlers - open modal
  container.querySelectorAll('.contact-seller-btn').forEach(btn => {
    // Remove existing listeners by cloning
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    // Add click handler to new button
    newBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      const postingId = newBtn.dataset.postingId;
      const toUserId = newBtn.dataset.postingUserId;
      const sellerName = newBtn.dataset.sellerUsername || newBtn.getAttribute('data-seller-username');
      
      console.log('Contact Seller button clicked:', { postingId, toUserId, sellerName });
      
      if (!postingId || !toUserId) {
        console.error('Contact Seller: postingId and toUserId are required', { postingId, toUserId });
        return;
      }
      
      // Open modal using global function
      if (typeof window.openContactSellerModal === 'function') {
        window.openContactSellerModal({
          postingId: postingId ? parseInt(postingId) : null,
          toUserId: parseInt(toUserId),
          sellerName: sellerName || 'Seller'
        });
      } else if (typeof openContactSellerModal === 'function') {
        openContactSellerModal({
          postingId: postingId ? parseInt(postingId) : null,
          toUserId: parseInt(toUserId),
          sellerName: sellerName || 'Seller'
        });
      } else {
        console.error('openContactSellerModal function not found. Available functions:', Object.keys(window).filter(k => k.includes('Contact')));
        alert('Contact Seller feature is not available. Please refresh the page.');
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
