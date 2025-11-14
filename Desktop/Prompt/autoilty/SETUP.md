# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Supabase Setup

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Fill in project details
   - Wait for project to be created

2. **Run Database Schema**
   - In Supabase Dashboard, go to SQL Editor
   - Copy and paste contents of `supabase/schema.sql`
   - Click "Run" to execute

3. **Get API Credentials**
   - Go to Settings > API
   - Copy:
     - Project URL (e.g., `https://xxxxx.supabase.co`)
     - Anon/public key

### 3. Stripe Setup

1. **Create Stripe Account**
   - Go to https://stripe.com
   - Sign up or log in
   - Go to Developers > API keys

2. **Get API Keys**
   - Copy Publishable key (starts with `pk_`)
   - Copy Secret key (starts with `sk_`)
   - **Important**: Use test keys for development

### 4. Environment Variables

**Root `.env` file:**
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
PORT=5000
NODE_ENV=development
```

**Client `.env` file** (create in `client/` folder):
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_API_URL=http://localhost:5000
```

### 5. Run the Application

```bash
# Run both frontend and backend
npm run dev
```

Or separately:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### 6. Create Admin User

1. Register a new account through the app
2. Go to Supabase Dashboard > Table Editor > users
3. Find your user record
4. Edit the `role` field and change from `buyer` to `admin`
5. Save

### 7. Test the Application

1. **As Buyer:**
   - Register/Login
   - Browse marketplace
   - Add products to cart
   - Checkout (use Stripe test card: 4242 4242 4242 4242)

2. **As Vendor:**
   - Register with "Vendor" role
   - Go to Dashboard
   - Add products
   - Wait for admin approval

3. **As Admin:**
   - Login with admin account
   - Go to Admin panel
   - Approve/reject products

## Troubleshooting

### Port Already in Use
If port 3000 or 5000 is in use:
- Change `PORT` in `.env` for backend
- Change port in `client/package.json` scripts

### Supabase Connection Issues
- Verify your URL and keys are correct
- Check Supabase project is active
- Ensure RLS policies are enabled

### Stripe Payment Issues
- Verify you're using test keys
- Check Stripe dashboard for errors
- Ensure backend is running

### CORS Errors
- Ensure backend CORS is configured
- Check API URL in frontend `.env`

## Next Steps

- Customize product categories
- Add image upload to cloud storage (Supabase Storage or AWS S3)
- Implement order history
- Add email notifications
- Deploy to production

