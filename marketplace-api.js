/**
 * AUTOILTY MARKETPLACE - API INTEGRATION
 * 
 * Handles marketplace postings from backend API
 */

// API Base URL - uses window.API_URL if set, otherwise defaults
const API_BASE_URL = (typeof window !== 'undefined' && window.API_URL) 
  ? window.API_URL 
  : 'http://localhost:5000/api';

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
  return {
    id: posting.id,
    name: posting.title,
    title: posting.title,
    price: parseFloat(posting.price),
    category: posting.category.toLowerCase(),
    image: posting.image_url ? `http://localhost:5000${posting.image_url}` : 'https://via.placeholder.com/400',
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
    container.innerHTML = '<p class="empty-state">No postings found. Try adjusting your filters.</p>';
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

