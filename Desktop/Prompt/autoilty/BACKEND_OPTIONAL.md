# Backend is Optional

## What Works Without Backend

✅ **All these features work without a backend:**
- User authentication (login/register)
- Browsing products
- Product search and filters
- Shopping cart (localStorage)
- Vendor dashboard (product management)
- Admin panel (product moderation)
- Order history (viewing past orders)
- Image uploads (Supabase Storage)

## What Requires Backend

❌ **Only checkout/payment requires backend:**
- Stripe payment processing
- Creating payment intents securely

## Why Backend is Needed for Payments

Stripe requires your **secret key** to create payment intents. Secret keys must NEVER be exposed in frontend code. The backend securely:
1. Receives payment request from frontend
2. Uses Stripe secret key to create payment intent
3. Returns payment intent client secret to frontend
4. Frontend uses client secret to complete payment

## Options

### Option 1: Deploy Backend (Recommended for Payments)
Deploy to Railway/Render/Heroku to enable checkout functionality.

### Option 2: Skip Backend (Demo/Testing)
- App works for everything except checkout
- Users can browse, add to cart, manage products
- Checkout will show an error message
- Good for testing other features

### Option 3: Use Stripe Test Mode Without Backend
Not recommended - would require exposing secret key (security risk).

## Environment Variables

**Required (for app to work):**
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`

**Optional (only for payments):**
- `REACT_APP_API_URL` - Backend URL for Stripe payments
- `REACT_APP_STRIPE_PUBLISHABLE_KEY` - Only needed if using payments

## Current Status

Your app will work fine without `REACT_APP_API_URL` set. Users just won't be able to complete checkout/payments until you deploy the backend.

