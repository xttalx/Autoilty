# Railway Setup Guide - Step by Step

Complete guide to deploy your Autoilty Marketplace to Railway.

## 🚀 Step 1: Login to Railway

1. Go to **https://railway.app**
2. Click **"Login"** or **"Start a New Project"**
3. Click **"Login with GitHub"** (recommended - connects to your repo)
4. Authorize Railway to access your GitHub account

---

## 📦 Step 2: Deploy Backend (API Server)

### 2.1 Create New Project

1. In Railway dashboard, click **"New Project"** button
2. Select **"Deploy from GitHub repo"**
3. You'll see a list of your GitHub repositories
4. Find and select **`xttalx/Autoilty`**
5. Click on it

Railway will automatically:
- Detect it's a Node.js project
- Start installing dependencies
- Begin deploying

**Wait for deployment to complete** (you'll see logs in real-time)

### 2.2 Get Your Backend URL

1. Once deployment starts, click on your **service** (it will have a name like "autoilty" or similar)
2. Go to **"Settings"** tab
3. Scroll down to **"Domains"** section
4. Click **"Generate Domain"** button
5. Railway will create a domain like: `autoilty-production-xxxxx.up.railway.app`
6. **Copy this URL** - this is your **BACKEND URL**
   - Example: `https://autoilty-production-abc123.up.railway.app`

### 2.3 Configure Environment Variables

1. Still in your backend service, click **"Variables"** tab
2. Click **"New Variable"** button
3. Add these variables one by one:

   **Variable 1: JWT_SECRET**
   - **Key**: `JWT_SECRET`
   - **Value**: Create a random secret string (e.g., `aut0ilty-m4rk3tpl4ce-s3cr3t-k3y-2024-r4nd0m`)
   - Click **"Add"**

   **Variable 2: FRONTEND_URL** (we'll update this later after deploying frontend)
   - **Key**: `FRONTEND_URL`
   - **Value**: Leave empty for now, we'll add it after deploying frontend
   - Or set it to: `http://localhost:3000` temporarily
   - Click **"Add"**

   **Variable 3: GOOGLE_PLACES_API_KEY** (only if using Business Directory)
   - **Key**: `GOOGLE_PLACES_API_KEY`
   - **Value**: Your Google Places API key (if you have one)
   - Click **"Add"**

Railway will automatically redeploy when you add variables.

### 2.4 Verify Backend is Running

1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. Check the logs - you should see:
   ```
   🚀 Server running on http://localhost:5000
   📁 Database: /app/database.sqlite
   📸 Uploads: /app/uploads
   ```

4. Test your backend:
   - Open a new browser tab
   - Go to: `https://your-backend-url.up.railway.app/api/health`
   - You should see: `{"status":"ok","timestamp":"..."}`

✅ **Backend is now deployed!**

---

## 🎨 Step 3: Deploy Frontend (Your Website)

### 3.1 Create Frontend Service

1. In Railway dashboard, go back to your **project** (click project name at top)
2. Click **"New Service"** button (or **"+"** button)
3. Select **"GitHub Repo"**
4. Select **`xttalx/Autoilty`** again (same repository)
5. Railway will create a new service

### 3.2 Configure Frontend Service

1. Click on the **new frontend service** you just created
2. Go to **"Settings"** tab
3. Configure:

   **Root Directory**: Leave as `/` (default)

   **Build Command**: Leave empty (no build needed for static files)

   **Start Command**: 
   ```
   npx serve . -l $PORT
   ```

4. Go to **"Variables"** tab
5. Add variable:
   - **Key**: `PORT`
   - **Value**: `3000`
   - Click **"Add"**

### 3.3 Get Frontend URL

1. Go to **"Settings"** tab
2. Scroll to **"Domains"** section
3. Click **"Generate Domain"** button
4. Railway will create a domain like: `autoilty-production-xxxxx.up.railway.app`
5. **Copy this URL** - this is your **FRONTEND URL**
   - Example: `https://autoilty-production-frontend-xyz789.up.railway.app`

### 3.4 Verify Frontend is Running

1. Open a new browser tab
2. Go to your frontend URL
3. You should see your Autoilty homepage!

✅ **Frontend is now deployed!**

---

## ⚙️ Step 4: Connect Frontend to Backend

### 4.1 Update Frontend Configuration

Now you need to tell your frontend where the backend is:

1. In your local project, open `public/config.js`
2. Find line 30:
   ```javascript
   return 'YOUR_RAILWAY_BACKEND_URL/api';  // 👈 UPDATE THIS!
   ```
3. Replace `YOUR_RAILWAY_BACKEND_URL` with your actual backend URL:
   ```javascript
   return 'https://autoilty-production-abc123.up.railway.app/api';
   ```
   (Use the backend URL you got in Step 2.2)

4. Save the file

### 4.2 Update Backend CORS

1. Go back to Railway → Your Backend Service
2. Go to **"Variables"** tab
3. Find `FRONTEND_URL` variable (or create it if you didn't)
4. Update the value to your **frontend URL**:
   - Example: `https://autoilty-production-frontend-xyz789.up.railway.app`
5. Save

### 4.3 Commit and Push Changes

In your local terminal:

```bash
# Make sure you're in the project directory
cd "C:\Data Transfer\Users\Jasraj\Desktop\Prompt\autoilty"

# Add the updated config file
git add public/config.js

# Commit
git commit -m "Configure backend URL for Railway deployment"

# Push to GitHub
git push origin main
```

Railway will automatically detect the push and redeploy!

---

## ✅ Step 5: Test Your Live Site

1. Visit your **frontend URL** (e.g., `https://autoilty-production-frontend-xyz789.up.railway.app`)
2. Test the features:
   - Browse marketplace
   - Register a new account
   - Login
   - Create a posting
   - Search businesses (if configured)

### Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. You should see: `API URL configured: https://your-backend-url.up.railway.app/api`
4. No errors should appear

---

## 🔧 Step 6: Configure Custom Domain (Optional)

If you want a custom domain instead of `.railway.app`:

1. In Railway → Your Frontend Service → Settings → Domains
2. Click **"Custom Domain"**
3. Enter your domain (e.g., `autoilty.com`)
4. Follow Railway's instructions to add DNS records

---

## 📊 Railway Dashboard Overview

Your Railway project should now have:

```
📁 Autoilty Project
  ├── 🔧 Backend Service (API Server)
  │   ├── Domain: https://autoilty-backend-xxx.up.railway.app
  │   ├── Variables: JWT_SECRET, FRONTEND_URL, etc.
  │   └── Deployments: Active deployment
  │
  └── 🎨 Frontend Service (Website)
      ├── Domain: https://autoilty-frontend-xxx.up.railway.app
      ├── Variables: PORT
      └── Deployments: Active deployment
```

---

## 🔍 Troubleshooting

### Backend Not Starting

**Check logs:**
1. Railway → Backend Service → Deployments
2. Click latest deployment → View logs
3. Look for errors

**Common issues:**
- Missing environment variables → Add them in Variables tab
- Port conflicts → Railway sets PORT automatically, don't override
- Build errors → Check package.json dependencies

### Frontend Can't Connect to Backend

**Check:**
1. Is backend URL correct in `public/config.js`?
2. Are CORS settings correct? (Check `FRONTEND_URL` variable)
3. Is backend service running? (Check deployments)
4. Open browser console - any errors?

### Database Errors

**Solution:**
- Database creates automatically on first run
- Check logs for SQLite errors
- Ensure Railway has write permissions

### Service Won't Deploy

**Check:**
1. Repository is connected correctly
2. No syntax errors in code
3. All dependencies in package.json
4. Check deployment logs for specific errors

---

## 📝 Quick Reference

### Your URLs After Setup

**Backend API:**
```
https://autoilty-backend-production-xxxxx.up.railway.app
```

**Frontend Website:**
```
https://autoilty-frontend-production-xxxxx.up.railway.app
```

### Environment Variables Checklist

**Backend Service:**
- ✅ `JWT_SECRET` - Random secret string
- ✅ `FRONTEND_URL` - Your frontend URL
- ✅ `GOOGLE_PLACES_API_KEY` - (Optional, if using)

**Frontend Service:**
- ✅ `PORT` - Set to `3000`

### Files Updated

- ✅ `public/config.js` - Updated with backend URL
- ✅ Committed and pushed to GitHub

---

## 🎉 Success!

Your Autoilty Marketplace is now live and publicly accessible!

**Share your frontend URL** and anyone can access your marketplace.

---

## 🔄 Auto-Deployments

**Good news!** Railway automatically deploys when you push to GitHub:

1. Make changes locally
2. `git add .`
3. `git commit -m "Your changes"`
4. `git push origin main`
5. Railway automatically detects and redeploys! ✨

---

## 💰 Railway Pricing

- **Free Tier**: $5 credit per month (usually enough for small apps)
- **Starter Plan**: $5/month + usage
- **Monitor Usage**: Dashboard → Usage tab

Your app will likely stay within free tier limits for normal usage.

---

## 🆘 Need Help?

1. Check Railway logs: Service → Deployments → Latest → Logs
2. Check browser console for frontend errors
3. Verify all URLs are correct
4. See `QUICK-DEPLOY.md` for quick reference

---

**You're all set!** Your marketplace is now live on Railway! 🚀

