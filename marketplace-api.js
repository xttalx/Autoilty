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

/**
 * Generate star rating HTML
 * @param {number} rating - Rating from 0 to 5
 * @returns {string} HTML for star rating
 */
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let html = '';
  for (let i = 0; i < fullStars; i++) {
    html += '<span style="color: #ffc107;">★</span>';
  }
  if (hasHalfStar) {
    html += '<span style="color: #ffc107;">☆</span>';
  }
  for (let i = 0; i < emptyStars; i++) {
    html += '<span style="color: #e0e0e0;">★</span>';
  }
  return html;
}

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

          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--spacing-xs);">
            <span class="product-category">${product.category.toUpperCase()}</span>
            ${posting.is_top_deal ? '<span class="top-deal-badge" style="background: #ff9800; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">Top Deal</span>' : ''}
          </div>

          <h3 class="product-name">${product.name}</h3>

          ${product.location ? `<p style="font-size: 0.875rem; color: var(--color-text-light); margin: var(--spacing-xs) 0; display: flex; align-items: center; gap: 0.25rem;"><i data-lucide="map-pin" style="width: 0.875rem; height: 0.875rem; flex-shrink: 0;"></i> ${product.location}</p>` : ''}

          <!-- Ratings and Reviews -->
          <div class="listing-rating" style="display: flex; align-items: center; gap: var(--spacing-xs); margin: var(--spacing-xs) 0;">
            <div class="rating-stars" style="display: flex; align-items: center; gap: 2px;" aria-label="${posting.rating || 0} out of 5 stars">
              ${generateStarRating(posting.rating || 0)}
            </div>
            <span style="font-size: 0.875rem; color: var(--color-text-light);">
              ${posting.rating ? posting.rating.toFixed(1) : 'N/A'} (${posting.review_count || 0} ${posting.review_count === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          <p class="product-price" style="font-size: 1.5rem; font-weight: 600; margin: var(--spacing-sm) 0;">$${product.price.toFixed(2)} CAD</p>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm);">
            <p style="font-size: 0.875rem; color: var(--color-text-light); margin: 0;">by ${product.username}</p>
            ${posting.vin_verified ? '<span class="vin-verified-badge" style="background: #4caf50; color: white; padding: 0.125rem 0.5rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.25rem;"><i data-lucide="check-circle" style="width: 0.75rem; height: 0.75rem;"></i> VIN Verified</span>' : ''}
          </div>

          <!-- Action Links -->
          <div class="listing-actions" style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--color-border);">
            <a href="posting-detail.html?id=${product.id}" 
               class="product-link" 
               aria-label="Contact seller about ${product.name}">
              <i data-lucide="message-circle" style="width: 0.875rem; height: 0.875rem; margin-right: 0.375rem; vertical-align: middle;"></i>
              Contact Seller
            </a>
            
            <div class="listing-secondary-actions" style="display: flex; align-items: center; gap: 0.75rem;">
              <a href="posting-detail.html?id=${product.id}#buy-now" 
                 class="product-link" 
                 aria-label="Buy now for $${product.price.toFixed(2)}">
                <i data-lucide="credit-card" style="width: 0.875rem; height: 0.875rem; margin-right: 0.375rem; vertical-align: middle;"></i>
                Buy Now
              </a>
              
              <div class="social-share-dropdown" style="position: relative;">
                <button class="social-share-btn product-link-icon" 
                        type="button"
                        aria-label="Share this listing"
                        aria-expanded="false"
                        data-posting-id="${product.id}"
                        style="min-width: 44px; min-height: 44px; padding: 0.5rem;">
                  <i data-lucide="share-2" style="width: 1rem; height: 1rem;"></i>
                </button>
                <div class="social-share-menu" style="display: none; position: absolute; top: 100%; right: 0; margin-top: 0.25rem; background: white; border: 1px solid var(--color-border); border-radius: var(--radius); box-shadow: var(--shadow-md); z-index: 100; min-width: 180px; padding: var(--spacing-xs);">
                  <a href="#" class="social-share-link" data-platform="facebook" data-posting-id="${product.id}" style="display: flex; align-items: center; gap: var(--spacing-sm); padding: var(--spacing-sm); border-radius: var(--radius); transition: background 0.2s; text-decoration: none; color: var(--color-text);">
                    <i data-lucide="facebook" style="width: 1rem; height: 1rem;"></i>
                    Share on Facebook
                  </a>
                  <a href="#" class="social-share-link" data-platform="twitter" data-posting-id="${product.id}" style="display: flex; align-items: center; gap: var(--spacing-sm); padding: var(--spacing-sm); border-radius: var(--radius); transition: background 0.2s; text-decoration: none; color: var(--color-text);">
                    <i data-lucide="twitter" style="width: 1rem; height: 1rem;"></i>
                    Share on Twitter
                  </a>
                  <a href="#" class="social-share-link" data-platform="whatsapp" data-posting-id="${product.id}" style="display: flex; align-items: center; gap: var(--spacing-sm); padding: var(--spacing-sm); border-radius: var(--radius); transition: background 0.2s; text-decoration: none; color: var(--color-text);">
                    <i data-lucide="message-circle" style="width: 1rem; height: 1rem;"></i>
                    Share on WhatsApp
                  </a>
                  <button class="social-share-link" data-platform="copy" data-posting-id="${product.id}" style="display: flex; align-items: center; gap: var(--spacing-sm); padding: var(--spacing-sm); border-radius: var(--radius); transition: background 0.2s; background: none; border: none; width: 100%; text-align: left; cursor: pointer; color: var(--color-text); font-family: inherit; font-size: inherit;">
                    <i data-lucide="copy" style="width: 1rem; height: 1rem;"></i>
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Similar Postings (shown on hover or below) -->
          <div class="similar-postings" data-posting-id="${product.id}" style="display: none; margin-top: var(--spacing-md); padding-top: var(--spacing-md); border-top: 1px solid var(--color-border);">
            <p style="font-size: 0.875rem; font-weight: 600; margin-bottom: var(--spacing-sm); color: var(--color-text-light);">Similar Listings</p>
            <div class="similar-postings-list" id="similarPostings${product.id}">
              <!-- Similar postings loaded dynamically -->
            </div>
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

      // Don't navigate if clicking the Contact Seller link, form, or any interactive element
      if (e.target.closest('.product-link') || 
          e.target.closest('.product-link-icon') ||
          e.target.closest('.social-share-btn') ||
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

  // Links now navigate directly, no need for click handlers

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

  window.generateStarRating = generateStarRating;

}
