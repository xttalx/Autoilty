
let API_BASE_URL = 'https://autoilty-production.up.railway.app/api';  // Default fallback

if (typeof window !== 'undefined') {
  if (window.API_URL) {
    API_BASE_URL = window.API_URL;
  } else if (window.API_BASE_URL) {
    API_BASE_URL = window.API_BASE_URL;
  }
  // Store for reuse (safe assignment, no redeclaration)
  window.API_BASE_URL = API_BASE_URL;
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

    const url = `${API_BASE_URL}/postings${params.toString() ? '?' + params.toString() : ''}`;
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
    const response = await fetch(`${API_BASE_URL}/postings/${id}`);
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
  // Get base URL (without /api) for image URLs
  const baseUrl = (typeof window !== 'undefined' && window.API_URL) 
    ? window.API_URL.replace('/api', '')
    : 'https://autoilty-production.up.railway.app';
  
  return {
    id: posting.id,
    name: posting.title,
    title: posting.title,
    price: parseFloat(posting.price),
    category: posting.category.toLowerCase(),
    image: posting.image_url 
      ? `${baseUrl}${posting.image_url}` 
      : 'https://via.placeholder.com/400',
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
    // Re-initialize icons for the empty state
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
    return;
  }

  container.innerHTML = postings.map(posting => {
    const product = postingToProduct(posting);
    return `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400'">
        </div>
        <div class="product-info">
          <span class="product-category">${product.category.toUpperCase()}</span>
          <h3 class="product-name">${product.name}</h3>
          ${product.location ? `<p style="font-size: 0.875rem; color: var(--color-text-light); margin: var(--spacing-xs) 0;"><i data-lucide="map-pin" style="width: 0.875rem; height: 0.875rem; display: inline-block;"></i> ${product.location}</p>` : ''}
          <p class="product-price">$${product.price.toFixed(2)} CAD</p>
          <p style="font-size: 0.875rem; color: var(--color-text-light);">by ${product.username}</p>
        </div>
      </div>
    `;
  }).join('');

  // Re-initialize icons
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }

  // Add click handlers
  container.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const productId = card.dataset.productId;
      // Could navigate to a detail page
      showNotification('View posting details (feature coming soon)');
    });
  });
}

// Export functions
window.fetchPostings = fetchPostings;
window.fetchPosting = fetchPosting;
window.postingToProduct = postingToProduct;
window.renderPostingsAsProducts = renderPostingsAsProducts;

