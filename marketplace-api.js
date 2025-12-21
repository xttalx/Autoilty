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
    image: (() => {
      if (!posting.image_url) {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
      }
      const baseUrl = (typeof window !== 'undefined' && window.API_URL) 
        ? window.API_URL.replace('/api', '')
        : 'https://autoilty-production.up.railway.app';
      const imagePath = posting.image_url.startsWith('/') 
        ? posting.image_url 
        : `/uploads/${posting.image_url}`;
      return `${baseUrl}${imagePath}`;
    })(),
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

          <button class="btn btn-primary btn-full contact-seller-btn" data-posting-id="${product.id}" data-seller-username="${product.username}" style="margin-top: var(--spacing-sm); padding: var(--spacing-xs) var(--spacing-sm); font-size: 0.875rem;">
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

  // Add Contact Seller button handlers
  container.querySelectorAll('.contact-seller-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const postingId = btn.dataset.postingId;
      const sellerUsername = btn.dataset.sellerUsername;
      
      // Get posting details from stored postings or card data
      const card = btn.closest('.product-card');
      if (card && typeof window.openContactModal === 'function') {
        const postingUserId = card.dataset.postingUserId;
        const postingTitle = card.querySelector('.product-name')?.textContent || 'Posting';
        
        // Try to get full posting data from stored postings
        let posting = null;
        if (typeof window.currentPostings !== 'undefined' && Array.isArray(window.currentPostings)) {
          posting = window.currentPostings.find(p => p.id == postingId);
        }
        
        window.openContactModal({
          postingId: postingId,
          postingTitle: posting ? posting.title : postingTitle,
          toUserId: posting ? posting.user_id : postingUserId,
          sellerUsername: posting ? posting.username : sellerUsername
        });
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
 */
function getPostingImageUrl(imageUrl) {
  if (!imageUrl) {
    // Return a data URI SVG placeholder instead of external URL
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
  }
  
  const baseUrl = getImageBaseUrl();
  // Ensure image_url starts with /uploads/ (backend returns it this way)
  const imagePath = imageUrl.startsWith('/') 
    ? imageUrl 
    : `/uploads/${imageUrl}`;
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
