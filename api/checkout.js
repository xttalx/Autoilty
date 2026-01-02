/**
 * AUTOILTY MARKETPLACE - STRIPE CHECKOUT API
 * 
 * Creates a Stripe Checkout Session for cart items
 * Endpoint: /api/checkout
 * Method: POST
 * 
 * Body: { cart: [...] }
 * Response: { url: "checkout.stripe.com/..." }
 */

// Import Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { cart } = req.body;
    
    // Validate cart
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Validate Stripe key
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }
    
    // Calculate total (in cents for Stripe)
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const totalCents = Math.round(total * 100);
    
    // Create line items for Stripe
    const lineItems = cart.map(item => ({
      price_data: {
        currency: 'cad',
        product_data: {
          name: item.name,
          description: item.selectedSize ? `Size: ${item.selectedSize}` : item.description || '',
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: 1,
    }));
    
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin || 'https://autoilty.com'}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://autoilty.com'}/cart.html`,
      currency: 'cad',
      metadata: {
        cart: JSON.stringify(cart),
      },
    });
    
    // Return checkout URL
    return res.status(200).json({
      url: session.url,
      sessionId: session.id,
    });
    
  } catch (error) {
    console.error('Checkout error:', error);
    
    return res.status(500).json({
      error: 'Checkout failed',
      message: error.message,
    });
  }
};







