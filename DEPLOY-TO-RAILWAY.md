# Deploy to Railway - Step by Step Guide

This guide will help you deploy Autoilty Marketplace to Railway and make it publicly accessible.

## 🚀 Quick Deployment Steps

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"** or **"Login"**
3. Sign up with **GitHub** (recommended - connects to your repo automatically)

### Step 2: Deploy from GitHub

1. Once logged in, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub repositories
4. Select your repository: **`xttalx/Autoilty`**
5. Railway will automatically detect it's a Node.js project and start deploying

### Step 3: Configure Environment Variables

1. In your Railway project dashboard, go to **"Variables"** tab
2. Click **"New Variable"**
3. Add these environment variables:

```
JWT_SECRET=your-super-secret-random-string-change-this
PORT=5000
```

**To generate a secure JWT_SECRET:**
```bash
# You can use this online tool or generate locally
# Or use any long random string like:
JWT_SECRET=aut0ilty-m4rk3tpl4ce-s3cr3t-k3y-2024-ch4ng3-th1s
```

**Optional (if using Business Directory):**
```
GOOGLE_PLACES_API_KEY=your-google-places-api-key
```

4. Click **"Add"** for each variable

### Step 4: Configure Build Settings

Railway usually auto-detects, but verify:

1. Go to **"Settings"** tab
2. **Build Command**: `npm install` (or leave empty - auto-detected)
3. **Start Command**: `npm start`

### Step 5: Set Up Public Domain

1. In Railway dashboard, go to **"Settings"** tab
2. Scroll to **"Domains"** section
3. Click **"Generate Domain"** or **"Custom Domain"**
4. Railway will give you a URL like: `autoilty-production.up.railway.app`
5. Copy this URL - you'll need it for frontend configuration

### Step 6: Update Frontend API URLs

You need to update the frontend to point to your Railway backend URL.

1. In Railway, copy your deployment URL (e.g., `https://autoilty-production.up.railway.app`)

2. Update these files:

**File: `auth.js`**
Change line 7:
```javascript
const API_BASE_URL = 'https://your-railway-url.up.railway.app/api';
```

**File: `marketplace-api.js`**
Change line 7:
```javascript
const API_BASE_URL = 'https://your-railway-url.up.railway.app/api';
```

**File: `directory.js`**
Change line 7:
```javascript
const API_BASE_URL = 'https://your-railway-url.up.railway.app/api';
```

3. Commit and push these changes:
```bash
git add auth.js marketplace-api.js directory.js
git commit -m "Update API URLs for Railway deployment"
git push origin main
```

Railway will automatically redeploy when you push.

### Step 7: Deploy Frontend (Separate Service)

You have two options:

#### Option A: Railway Static Site (Recommended)

1. In Railway, click **"New Service"**
2. Select **"Empty Service"**
3. Connect to the same GitHub repo
4. Configure:
   - **Root Directory**: `/`
   - **Build Command**: (leave empty or `npm install`)
   - **Start Command**: `npx serve . -l $PORT`
5. Install serve package: Add to package.json or Railway will install it
6. Railway will give you a frontend URL

#### Option B: Deploy Frontend to Vercel/Netlify (Alternative)

1. Go to [vercel.com](https://vercel.com) or [netlify.com](https://netlify.com)
2. Import your GitHub repository
3. Configure:
   - **Framework**: Other/Static
   - **Build Command**: (leave empty)
   - **Output Directory**: `/`
4. Add environment variable for API URL (if needed)

### Step 8: Configure CORS

Update your Railway backend to allow requests from your frontend domain.

**File: `server.js`**
Update the CORS configuration around line 27-30:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-frontend-domain.com',
  credentials: true
}));
```

Or allow multiple origins:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000', // Local development
    'https://your-frontend-domain.com', // Production frontend
    'https://your-railway-frontend.up.railway.app' // Railway frontend
  ],
  credentials: true
}));
```

### Step 9: Set Up Environment Variables for Frontend

If deploying frontend separately, you may need to configure API URL.

**For Vercel:**
- Go to Project Settings → Environment Variables
- Add: `VITE_API_URL` or similar (if using a build tool)

**For Railway Static:**
- Can use environment variables if using a build process
- Or hardcode the backend URL in the JavaScript files

### Step 10: Test Your Deployment

1. Visit your Railway backend URL: `https://your-backend.up.railway.app/api/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

2. Visit your frontend URL
3. Test the application:
   - Browse marketplace
   - Register/login
   - Create a posting
   - Search businesses (if configured)

## 🔧 Important Configuration

### Database Persistence

Railway provides persistent storage, so your SQLite database will persist between deployments.

**Database file location**: Will be in `/app/database.sqlite` in Railway

### File Uploads

Uploaded images will be stored in `/app/uploads/` directory in Railway.

**Important**: These persist between deployments on Railway.

### Environment Variables Summary

**Backend (Railway):**
```
JWT_SECRET=your-secret-key
PORT=5000 (Railway auto-sets this)
FRONTEND_URL=https://your-frontend-domain.com (optional)
GOOGLE_PLACES_API_KEY=your-key (if using business directory)
```

## 🐛 Troubleshooting

### Backend Not Starting

1. Check Railway logs: Click on your service → "Deployments" → View logs
2. Common issues:
   - Missing environment variables
   - Port mismatch (Railway sets PORT automatically)
   - Build errors

### Frontend Can't Connect to Backend

1. Check CORS settings in `server.js`
2. Verify API URLs in frontend files are correct
3. Check Railway backend logs for CORS errors

### Database Not Working

1. SQLite works on Railway with persistent storage
2. Check logs for database errors
3. Database file is created automatically

### File Uploads Not Working

1. Verify `uploads/` directory exists (created automatically)
2. Check file permissions in Railway
3. Check Railway logs for upload errors

## 📊 Railway Pricing

- **Free Tier**: $5 credit per month (usually enough for small apps)
- **Starter Plan**: $5/month + usage
- **Pro Plan**: $20/month + usage

Your app will likely stay within free tier limits for small usage.

## 🔄 Auto-Deployments

Railway automatically deploys when you push to GitHub!

1. Make changes locally
2. Commit: `git add . && git commit -m "Your changes"`
3. Push: `git push origin main`
4. Railway automatically detects and deploys

## 📝 Checklist

- [ ] Created Railway account
- [ ] Connected GitHub repository
- [ ] Added environment variables (JWT_SECRET, etc.)
- [ ] Updated frontend API URLs
- [ ] Configured CORS for frontend domain
- [ ] Deployed backend successfully
- [ ] Deployed frontend (Railway or separate)
- [ ] Tested application
- [ ] Verified database persistence
- [ ] Tested file uploads

## 🎉 Success!

Once deployed, your app will be publicly accessible at:
- **Backend API**: `https://your-backend.up.railway.app`
- **Frontend**: `https://your-frontend-domain.com`

Share these URLs and your marketplace will be live!

---

**Need help?** Check Railway documentation: https://docs.railway.app


