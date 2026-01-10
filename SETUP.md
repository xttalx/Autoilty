# Autoilty Marketplace - Setup Guide

Complete setup guide for deploying the Autoilty Marketplace on Vercel with Supabase and Stripe integration.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Vercel account (free tier works)
- Supabase account (free tier works)
- Stripe account (free tier works)

---

## 📋 Step 1: Clone & Setup Repository

```bash
# Clone your repository
git clone <your-repo-url>
cd autoilty-marketplace

# Install dependencies (optional, for local testing)
npm install
```

---

## 🗄️ Step 2: Setup Supabase

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your **Project URL** and **anon/public key**

### 2.2 Create Products Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  name TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('auto', 'clothing')),
  image TEXT,
  images TEXT[],
  description TEXT,
  sizes TEXT[],
  featured BOOLEAN DEFAULT false,
  new BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view approved products"
ON products FOR SELECT
TO public
USING (status = 'approved');

-- Insert sample data (optional)
INSERT INTO products (title, name, price, category, image, description, featured, new, in_stock) VALUES
('Premium Car Wax', 'Premium Car Wax', 49.99, 'auto', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400', 'Professional-grade car wax', true, true, true),
('Microfiber Towels Set', 'Microfiber Towels Set', 29.99, 'auto', 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400', 'Premium microfiber towels', true, false, true),
('Autoilty Logo T-Shirt', 'Autoilty Logo T-Shirt', 34.99, 'clothing', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 'Premium cotton t-shirt', true, true, true);
```

### 2.3 Get Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

---

## 💳 Step 3: Setup Stripe

### 3.1 Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Create account or sign in
3. Go to **Developers** → **API keys**

### 3.2 Get Stripe Keys

1. Copy **Publishable key** (starts with `pk_...`)
2. Copy **Secret key** (starts with `sk_...`) - Keep this secret!

### 3.3 Test Mode

- Use test mode keys for development
- Test card: `4242 4242 4242 4242`
- Any future expiry date, any CVC

---

## ⚙️ Step 4: Deploy to Vercel

### 4.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import your repository

### 4.2 Configure Project Settings

**Framework Preset:** Other

**Build Command:** (leave empty)

**Output Directory:** (leave empty)

**Install Command:** `npm install`

### 4.3 Add Environment Variables

Go to **Settings** → **Environment Variables** and add:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
STRIPE_SECRET_KEY=sk_test_your-secret-key-here
```

**Important:** 
- Add to **Production**, **Preview**, and **Development**
- Replace placeholder values with your actual keys

### 4.4 Deploy

Click **Deploy** and wait for build to complete.

---

## 🔧 Step 5: Update Frontend Configuration

### 5.1 Environment Variables (Client-Side)

For client-side Supabase access, you can either:

**Option A: Use Vercel Environment Variables** (Recommended)

Add to `vercel.json`:

```json
{
  "env": {
    "SUPABASE_URL": "@supabase_url",
    "SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

**Option B: Hardcode in script.js** (Not recommended for production)

Update `script.js`:

```javascript
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';
```

**Option C: Use Build-time Injection**

Create `public/env.js`:

```javascript
window.env = {
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key',
};
```

Add to `<head>` of all HTML files:

```html
<script src="/env.js"></script>
```

---

## ✅ Step 6: Test Locally (Optional)

```bash
# Install dependencies
npm install

# Run local server
npm run dev

# Open http://localhost:3000
```

---

## 🧪 Step 7: Test Everything

### Test Products
- ✅ Visit `/marketplace.html` - products should load
- ✅ Search functionality works
- ✅ Filter tabs work

### Test Cart
- ✅ Add items to cart
- ✅ Cart drawer opens
- ✅ Cart badge updates

### Test Checkout
- ✅ Go to `/cart.html`
- ✅ Click "Proceed to Checkout"
- ✅ Stripe Checkout opens
- ✅ Use test card: `4242 4242 4242 4242`
- ✅ Complete checkout
- ✅ Redirects to `/success.html`

---

## 🐛 Troubleshooting

### Products Not Loading

1. Check Supabase URL and key in environment variables
2. Verify RLS policies allow public read
3. Check browser console for errors
4. Verify products table has `status = 'approved'`

### Cart Not Working

1. Check browser localStorage is enabled
2. Verify `script.js` is loaded
3. Check console for JavaScript errors

### Checkout Failing

1. Verify `STRIPE_SECRET_KEY` is set in Vercel
2. Check API endpoint: `/api/checkout`
3. Verify Stripe keys are from same account (test/live)
4. Check Vercel function logs

### Build Errors

1. Check `vercel.json` syntax
2. Verify Node.js version (18.x)
3. Check function runtime in Vercel dashboard

---

## 📁 Project Structure

```
autoilty-marketplace/
├── index.html          # Homepage
├── marketplace.html    # Marketplace page
├── product.html        # Product detail
├── cart.html          # Cart page
├── success.html       # Success page
├── styles.css         # All styles (Grok-inspired)
├── script.js          # Shared JavaScript
├── api/
│   └── checkout.js    # Stripe Checkout API
├── vercel.json        # Vercel configuration
├── package.json       # Dependencies
└── SETUP.md          # This file
```

---

## 🎨 Design Notes

- **Design Inspiration:** grok.com
- **Color Scheme:** Pure white (#FFFFFF) background, black (#000000) text
- **Typography:** Inter font family
- **Spacing:** Generous, breathable
- **Animations:** Smooth, subtle micro-interactions

---

## 📞 Support

For issues or questions:
- Check Vercel logs: Dashboard → Deployment → Functions
- Check browser console for client errors
- Verify all environment variables are set correctly

---

## 🎉 You're Done!

Your marketplace should now be live at `https://your-project.vercel.app`

**Next Steps:**
- Add real product images
- Customize colors/branding
- Add more products via Supabase
- Enable Stripe live mode when ready

Happy selling! 🚗✨









