/**
 * AUTOILTY MARKETPLACE - SHARED JAVASCRIPT
 * 
 * Features:
 * - Cart management (localStorage)
 * - Supabase integration
 * - Navigation & UI helpers
 * - Animations & micro-interactions
 * - Cart drawer functionality
 */

// ============================================
// SUPABASE CONFIGURATION
// ============================================
let supabaseClient = null;

// Try multiple methods to get environment variables
function getSupabaseConfig() {
  // Method 1: window.env (from public/env.js)
  if (typeof window !== 'undefined' && window.env) {
    return {
      url: window.env.SUPABASE_URL,
      key: window.env.SUPABASE_ANON_KEY,
    };
  }
  
  // Method 2: Inline script tag with data attributes (could be added to HTML)
  if (typeof document !== 'undefined') {
    const script = document.querySelector('script[data-supabase-url]');
    if (script) {
      return {
        url: script.dataset.supabaseUrl,
        key: script.dataset.supabaseKey,
      };
    }
  }
  
  // Method 3: Return null if not configured (will use fallback)
  return { url: null, key: null };
}

// Initialize Supabase client
try {
  const config = getSupabaseConfig();
  
  if (config.url && config.key && typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(config.url, config.key);
  }
} catch (error) {
  console.warn('Supabase not configured, using fallback products:', error);
}

// ============================================
// PRODUCT DATA (FALLBACK)
// ============================================
// Make FALLBACK_PRODUCTS globally accessible
window.FALLBACK_PRODUCTS = [
  // Auto Products
  {
    id: '1',
    name: 'Premium Car Wax',
    price: 49.99,
    category: 'auto',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop',
    description: 'Professional-grade car wax for long-lasting shine and protection.',
    featured: true,
    new: true,
    in_stock: true,
  },
  {
    id: '2',
    name: 'Microfiber Towels Set',
    price: 29.99,
    category: 'auto',
    image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&h=400&fit=crop',
    description: 'Premium microfiber towels for streak-free detailing.',
    featured: true,
    new: false,
    in_stock: true,
  },
  {
    id: '3',
    name: 'Ceramic Coating Kit',
    price: 149.99,
    category: 'auto',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
    description: 'Complete ceramic coating system for ultimate protection.',
    featured: false,
    new: true,
    in_stock: true,
  },
  {
    id: '4',
    name: 'Detailer Brush Set',
    price: 24.99,
    category: 'auto',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    description: 'Professional brush set for interior and exterior detailing.',
    featured: false,
    new: false,
    in_stock: true,
  },
  {
    id: '5',
    name: 'Wheel Cleaner',
    price: 19.99,
    category: 'auto',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=400&fit=crop',
    description: 'Heavy-duty wheel cleaner for brake dust and grime.',
    featured: false,
    new: false,
    in_stock: true,
  },
  {
    id: '6',
    name: 'Paint Correction Compound',
    price: 39.99,
    category: 'auto',
    image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=400&h=400&fit=crop',
    description: 'Advanced compound for removing scratches and swirl marks.',
    featured: true,
    new: false,
    in_stock: true,
  },
  // Clothing Products
  {
    id: '7',
    name: 'Autoilty Logo T-Shirt',
    price: 34.99,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    description: 'Premium cotton t-shirt with embroidered Autoilty logo.',
    featured: true,
    new: true,
    in_stock: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: '8',
    name: 'Detailer Hoodie',
    price: 79.99,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    description: 'Comfortable hoodie perfect for detailers on the job.',
    featured: false,
    new: true,
    in_stock: true,
    sizes: ['M', 'L', 'XL', 'XXL'],
  },
  {
    id: '9',
    name: 'Autoilty Cap',
    price: 24.99,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop',
    description: 'Classic snapback cap with embroidered logo.',
    featured: false,
    new: false,
    in_stock: true,
    sizes: ['One Size'],
  },
  {
    id: '10',
    name: 'Professional Detailer Apron',
    price: 44.99,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop',
    description: 'Durable apron with multiple pockets for tools.',
    featured: false,
    new: false,
    in_stock: true,
    sizes: ['M', 'L', 'XL'],
  },
];

// ============================================
// PRODUCT MANAGEMENT
// ============================================
/**
 * Fetch products from Supabase or return fallback
 */
async function getProducts() {
  try {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from('products')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      
      if (!error && data && data.length > 0) {
        // Transform Supabase data to match our structure
        return data.map(product => ({
          id: product.id,
          name: product.title || product.name,
          price: parseFloat(product.price),
          category: product.category === 'auto' || product.category === 'clothing' 
            ? product.category 
            : 'auto',
          image: product.images && product.images[0] 
            ? product.images[0] 
            : 'https://via.placeholder.com/400',
          description: product.description || '',
          featured: product.featured || false,
          new: product.new || false,
          in_stock: product.in_stock !== false,
          sizes: product.sizes || [],
        }));
      }
    }
  } catch (error) {
    console.warn('Error fetching from Supabase, using fallback:', error);
  }
  
  // Return fallback products
  return window.FALLBACK_PRODUCTS || [];
}

// ============================================
// CART MANAGEMENT
// ============================================
const CART_STORAGE_KEY = 'autoilty_cart';

/**
 * Get cart from localStorage
 */
function getCart() {
  try {
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
  } catch (error) {
    console.error('Error reading cart:', error);
    return [];
  }
}

/**
 * Save cart to localStorage
 */
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
}

/**
 * Add product to cart
 */
function addToCart(product) {
  const cart = getCart();
  cart.push({
    ...product,
    cartId: Date.now() + Math.random(), // Unique ID for cart item
  });
  saveCart(cart);
  updateCartUI();
  
  // Micro-animation feedback
  showNotification('Added to cart!');
}

/**
 * Remove item from cart by index
 */
function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartUI();
}

/**
 * Clear entire cart
 */
function clearCart() {
  saveCart([]);
  updateCartUI();
}

/**
 * Get cart item count
 */
function getCartItemCount() {
  return getCart().length;
}

/**
 * Get cart total
 */
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.price, 0);
}

// ============================================
// CART UI UPDATES
// ============================================
/**
 * Update all cart UI elements
 */
function updateCartUI() {
  const count = getCartItemCount();
  const total = getCartTotal();
  
  // Update cart badges
  document.querySelectorAll('#cartBadge, .cart-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
  });
  
  // Update floating cart badge
  const floatingBadge = document.getElementById('floatingCartBadge');
  if (floatingBadge) {
    floatingBadge.textContent = count;
    floatingBadge.style.display = count > 0 ? 'block' : 'none';
  }
  
  // Update cart drawer items
  const cartDrawer = document.getElementById('cartDrawer');
  const cartItems = document.getElementById('cartItems');
  
  if (cartDrawer && cartItems) {
    const cart = getCart();
    
    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="empty-state">Your cart is empty</p>';
    } else {
      cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-info">
            <h3 class="cart-item-name">${item.name}</h3>
            ${item.selectedSize ? `<p class="cart-item-size">Size: ${item.selectedSize}</p>` : ''}
            <p class="cart-item-price">$${item.price.toFixed(2)} CAD</p>
          </div>
          <div class="cart-item-controls">
            <button class="cart-item-remove" data-index="${index}" aria-label="Remove ${item.name}">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      `).join('');
      
      // Re-initialize icons
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
      
      // Add remove handlers
      cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.dataset.index);
          removeFromCart(index);
          updateCartUI();
        });
      });
    }
    
    // Update cart total
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
      cartTotal.textContent = `$${total.toFixed(2)} CAD`;
    }
  }
}

// ============================================
// CART DRAWER
// ============================================
/**
 * Open cart drawer
 */
function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (drawer) {
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    updateCartUI();
  }
}

/**
 * Close cart drawer
 */
function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (drawer) {
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

/**
 * Initialize cart drawer
 */
function initCartDrawer() {
  const cartToggle = document.getElementById('cartToggle');
  const floatingCartBtn = document.getElementById('floatingCartBtn');
  const cartClose = document.getElementById('cartClose');
  const cartOverlay = document.getElementById('cartOverlay');
  const continueShopping = document.getElementById('continueShopping');
  
  if (cartToggle) {
    cartToggle.addEventListener('click', openCartDrawer);
  }
  
  if (floatingCartBtn) {
    floatingCartBtn.addEventListener('click', openCartDrawer);
  }
  
  if (cartClose) {
    cartClose.addEventListener('click', closeCartDrawer);
  }
  
  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCartDrawer);
  }
  
  if (continueShopping) {
    continueShopping.addEventListener('click', closeCartDrawer);
  }
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
    }
  });
}

// ============================================
// NOTIFICATIONS
// ============================================
/**
 * Show notification toast
 */
function showNotification(message, duration = 3000) {
  // Remove existing notification
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }
  
  // Create new notification
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Remove after duration
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, duration);
}

// Add slide out animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ============================================
// INITIALIZATION
// ============================================
/**
 * Initialize all features on page load
 */
function init() {
  // Update cart UI
  updateCartUI();
  
  // Initialize cart drawer
  initCartDrawer();
  
  // Add smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export functions for use in HTML
window.getProducts = getProducts;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.getCart = getCart;
window.getCartItemCount = getCartItemCount;
window.getCartTotal = getCartTotal;
window.updateCartUI = updateCartUI;
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.showNotification = showNotification;

