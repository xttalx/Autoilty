# URL Configuration Guide - What Goes Where?

## 🔗 Two Different URLs You'll Need

When deploying, you'll have **TWO different URLs**:

1. **Backend URL** - Where your server/API runs (Railway backend service)
2. **Frontend URL** - Where your website is hosted (Railway frontend service, Vercel, etc.)

---

## 📍 Backend URL (API Server)

**What it is:** Your Express.js server that handles API requests

**Where to get it:**
- After deploying backend to Railway
- Railway → Your Backend Service → Settings → Domains
- Example: `https://autoilty-backend-production.up.railway.app`

**Where to use it:**

### File: `public/config.js`

Replace this line:
```javascript
return 'YOUR_RAILWAY_BACKEND_URL/api';  // 👈 UPDATE THIS!
```

**With your actual backend URL:**
```javascript
return 'https://autoilty-backend-production.up.railway.app/api';
```

**Full example:**
```javascript
window.API_URL = window.API_URL || (() => {
  const hostname = window.location.hostname;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  
  if (isLocal) {
    return 'http://localhost:5000/api';
  }
  
  // Production: Your Railway backend URL
  return 'https://autoilty-backend-production.up.railway.app/api';
})();
```

---

## 🌐 Frontend URL (Your Website)

**What it is:** The public URL where people visit your marketplace

**Where to get it:**
- After deploying frontend to Railway OR Vercel
- Railway: Settings → Domains → Your frontend service domain
- Vercel: Project → Domains → Your deployment URL
- Example: `https://autoilty-frontend.up.railway.app` or `https://autoilty.vercel.app`

**Where to use it:**

### Railway Backend → Environment Variables

1. Go to Railway → Your Backend Service
2. Click **"Variables"** tab
3. Add new variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: Your frontend URL
   - Example: `https://autoilty-frontend.up.railway.app`

**Multiple frontend URLs (if you have dev/staging/production):**
```
https://autoilty-frontend.up.railway.app,https://autoilty.vercel.app
```
(Comma-separated list)

---

## 📝 Step-by-Step Example

Let's say you deploy and get these URLs:

### Step 1: Deploy Backend to Railway
- **Backend URL**: `https://autoilty-backend-production-abc123.up.railway.app`

### Step 2: Deploy Frontend to Railway
- **Frontend URL**: `https://autoilty-frontend-production-xyz789.up.railway.app`

### Step 3: Update Configuration

**A. Update `public/config.js`:**
```javascript
// Replace this line:
return 'YOUR_RAILWAY_BACKEND_URL/api';

// With your BACKEND URL:
return 'https://autoilty-backend-production-abc123.up.railway.app/api';
```

**B. Add Frontend URL to Railway Backend Variables:**
```
Key: FRONTEND_URL
Value: https://autoilty-frontend-production-xyz789.up.railway.app
```

**C. Commit and push:**
```bash
git add public/config.js
git commit -m "Configure backend URL"
git push origin main
```

### Step 4: Test

- Visit frontend URL: `https://autoilty-frontend-production-xyz789.up.railway.app`
- Frontend automatically calls backend at: `https://autoilty-backend-production-abc123.up.railway.app/api`

---

## 🎯 Quick Reference

| What | Where to Find | Where to Use | Example |
|------|--------------|--------------|---------|
| **Backend URL** | Railway backend service → Settings → Domains | `public/config.js` | `https://autoilty-backend.up.railway.app` |
| **Frontend URL** | Railway frontend service OR Vercel → Domains | Railway backend → Variables → `FRONTEND_URL` | `https://autoilty-frontend.up.railway.app` |

---

## 🔍 How to Find Your URLs

### Railway URLs:

1. **Backend URL:**
   - Railway Dashboard → Your Backend Service
   - Click **"Settings"** tab
   - Scroll to **"Domains"** section
   - Copy the domain (e.g., `autoilty-backend-production.up.railway.app`)

2. **Frontend URL:**
   - Railway Dashboard → Your Frontend Service
   - Click **"Settings"** tab
   - Scroll to **"Domains"** section
   - Copy the domain (e.g., `autoilty-frontend-production.up.railway.app`)

### Vercel URLs:

1. Vercel Dashboard → Your Project
2. Click on a deployment
3. Copy the deployment URL (e.g., `autoilty.vercel.app`)

---

## ✅ Checklist

Before going live, verify:

- [ ] Backend deployed and you have the backend URL
- [ ] Frontend deployed and you have the frontend URL
- [ ] Updated `public/config.js` with backend URL
- [ ] Added `FRONTEND_URL` environment variable in Railway backend
- [ ] Committed and pushed changes
- [ ] Tested the live site

---

## 🆘 Common Mistakes

❌ **Wrong:** Using frontend URL in `config.js`
```javascript
return 'https://autoilty-frontend.up.railway.app/api';  // ❌ WRONG!
```

✅ **Correct:** Using backend URL in `config.js`
```javascript
return 'https://autoilty-backend.up.railway.app/api';  // ✅ CORRECT!
```

---

## 📱 Real Example

**Scenario:** You deployed both backend and frontend to Railway

**Backend Service:**
- Railway URL: `https://autoilty-backend-production.up.railway.app`
- This runs your `server.js` file

**Frontend Service:**
- Railway URL: `https://autoilty-frontend-production.up.railway.app`
- This serves your HTML/CSS/JS files

**Configuration:**

1. **`public/config.js`** → Set to backend URL:
   ```javascript
   return 'https://autoilty-backend-production.up.railway.app/api';
   ```

2. **Railway Backend Variables** → Set frontend URL:
   ```
   FRONTEND_URL=https://autoilty-frontend-production.up.railway.app
   ```

**Result:**
- User visits: `https://autoilty-frontend-production.up.railway.app`
- Frontend makes API calls to: `https://autoilty-backend-production.up.railway.app/api`
- Backend allows requests from: `https://autoilty-frontend-production.up.railway.app` (CORS)

---

## 💡 Remember

- **Backend URL** = Where your API/server runs → Goes in `public/config.js`
- **Frontend URL** = Where your website is hosted → Goes in Railway backend environment variables (`FRONTEND_URL`)

---

**Still confused?** Follow `QUICK-DEPLOY.md` step by step - it will guide you through getting both URLs and configuring them correctly!


