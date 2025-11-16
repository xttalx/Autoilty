# Vercel Deployment Guide for Autoilty

## Frontend Deployment (Vercel)

### Step 1: Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

### Step 2: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Sign in with GitHub
   - Click "Add New Project"

2. **Import Your Repository**
   - Select the `xttalx/Autoilty` repository
   - Vercel will auto-detect it's a React app

3. **Configure Project Settings**
   - **Root Directory**: Set to `Desktop/Prompt/autoilty/client` (since your React app is nested in this path)
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)
   - **Install Command**: `npm install`
   
   **OR** if Root Directory option doesn't work:
   - Leave Root Directory empty (use repository root)
   - **Build Command**: `cd Desktop/Prompt/autoilty/client && npm run build`
   - **Output Directory**: `Desktop/Prompt/autoilty/client/build`
   - **Install Command**: `cd Desktop/Prompt/autoilty/client && npm install`

4. **Add Environment Variables**
   Go to Settings > Environment Variables and add:
   ```
   REACT_APP_SUPABASE_URL=https://riimwxyjsqatyvttdajp.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```
   **Important**: Replace `your_supabase_anon_key` and `your_stripe_publishable_key` with actual values
   **Important**: Replace `your-backend-url` with your actual backend deployment URL

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://autoilty.vercel.app` (or your custom domain)

### Step 3: Deploy via CLI (Alternative)

```bash
cd client
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No** (first time)
- Project name? **autoilty** (or your choice)
- Directory? **./** (current directory)
- Override settings? **No**

Then add environment variables via dashboard or CLI:
```bash
vercel env add REACT_APP_SUPABASE_URL
vercel env add REACT_APP_SUPABASE_ANON_KEY
vercel env add REACT_APP_STRIPE_PUBLISHABLE_KEY
vercel env add REACT_APP_API_URL
```

## Backend Deployment

Your backend (Express server) needs to be deployed separately. Recommended options:

### Option 1: Railway (Recommended)
1. Go to https://railway.app
2. New Project > Deploy from GitHub
3. Select your repository
4. Set Root Directory to `server`
5. Add environment variables:
   - `STRIPE_SECRET_KEY`
   - `PORT` (auto-set by Railway)
   - `FRONTEND_URL` (your Vercel URL)
   - `NODE_ENV=production`

### Option 2: Render
1. Go to https://render.com
2. New Web Service
3. Connect GitHub repository
4. Set:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node index.js`
5. Add environment variables

### Option 3: Vercel Serverless Functions
Convert your Express server to Vercel serverless functions (more complex, but keeps everything on Vercel)

## Post-Deployment Checklist

- [ ] Update `REACT_APP_API_URL` in Vercel with your backend URL
- [ ] Update `FRONTEND_URL` in backend with your Vercel URL
- [ ] Test authentication flow
- [ ] Test product upload (image storage)
- [ ] Test checkout and payment
- [ ] Test order history
- [ ] Set up custom domain (optional)

## Environment Variables Summary

### Frontend (Vercel)
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`
- `REACT_APP_API_URL` (your backend URL)

### Backend (Railway/Render)
- `STRIPE_SECRET_KEY`
- `FRONTEND_URL` (your Vercel URL)
- `PORT` (usually auto-set)
- `NODE_ENV=production`

## Troubleshooting

### Build Fails
- Check that Root Directory is set to `client`
- Verify all dependencies are in `client/package.json`
- Check build logs in Vercel dashboard

### Environment Variables Not Working
- Make sure variables start with `REACT_APP_` prefix
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

### API Calls Failing
- Verify `REACT_APP_API_URL` points to your deployed backend
- Check CORS settings in backend
- Ensure backend is running and accessible

### Images Not Loading
- Verify Supabase Storage bucket is public
- Check image URLs in database
- Ensure Storage policies are set correctly

