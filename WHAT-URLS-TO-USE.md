# What URLs to Replace? - Simple Explanation

## 🎯 The Answer in One Sentence

You'll get **2 URLs** when you deploy:
1. **Backend URL** → Put in `public/config.js`
2. **Frontend URL** → Put in Railway backend environment variable `FRONTEND_URL`

---

## 📍 URL #1: Backend URL (API Server)

### Where You Get It:
After deploying your backend to Railway:
- Railway Dashboard → Your Backend Service → Settings → Domains
- Example: `https://autoilty-backend-production.up.railway.app`

### Where to Put It:
**File: `public/config.js`**

**Find this line (around line 30):**
```javascript
return 'YOUR_RAILWAY_BACKEND_URL/api';  // 👈 UPDATE THIS!
```

**Replace with your actual backend URL:**
```javascript
return 'https://autoilty-backend-production.up.railway.app/api';
```

**✅ Complete Example:**
```javascript
// Before (needs updating):
return 'YOUR_RAILWAY_BACKEND_URL/api';

// After (updated with your Railway backend URL):
return 'https://autoilty-backend-production.up.railway.app/api';
```

---

## 🌐 URL #2: Frontend URL (Your Website)

### Where You Get It:
After deploying your frontend to Railway OR Vercel:
- Railway: Settings → Domains → Your frontend service
- Vercel: Project dashboard → Deployment URL
- Example: `https://autoilty-frontend.up.railway.app` or `https://autoilty.vercel.app`

### Where to Put It:
**Railway Backend Service → Environment Variables**

1. Go to Railway → Your Backend Service
2. Click **"Variables"** tab
3. Click **"New Variable"**
4. Add:
   - **Key**: `FRONTEND_URL`
   - **Value**: Your frontend URL (e.g., `https://autoilty-frontend.up.railway.app`)
5. Click **"Add"**

---

## 📝 Complete Example Scenario

Let's say you deploy and Railway gives you:

**Backend Service URL:**
```
https://autoilty-backend-production-abc123.up.railway.app
```

**Frontend Service URL:**
```
https://autoilty-frontend-production-xyz789.up.railway.app
```

### What to Do:

**1. Update `public/config.js`:**
```javascript
// Change this:
return 'YOUR_RAILWAY_BACKEND_URL/api';

// To this:
return 'https://autoilty-backend-production-abc123.up.railway.app/api';
```

**2. Add Environment Variable in Railway Backend:**
```
Key: FRONTEND_URL
Value: https://autoilty-frontend-production-xyz789.up.railway.app
```

**3. Commit and push:**
```bash
git add public/config.js
git commit -m "Configure backend URL"
git push origin main
```

---

## 🎯 Visual Summary

```
┌─────────────────────────────────────────┐
│  BACKEND URL                            │
│  (Your API Server)                      │
│  Example:                               │
│  https://autoilty-backend.up.railway.app│
│                                         │
│  ↓ Put this in: public/config.js       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  FRONTEND URL                           │
│  (Your Website)                         │
│  Example:                               │
│  https://autoilty-frontend.up.railway.app│
│                                         │
│  ↓ Put this in: Railway Variables      │
│    Key: FRONTEND_URL                    │
└─────────────────────────────────────────┘
```

---

## ✅ Quick Checklist

- [ ] Deploy backend → Get backend URL
- [ ] Update `public/config.js` with backend URL
- [ ] Deploy frontend → Get frontend URL  
- [ ] Add `FRONTEND_URL` variable in Railway backend
- [ ] Commit changes
- [ ] Test your live site!

---

**Still unsure?** Open `QUICK-DEPLOY.md` and follow it step by step - it shows you exactly where to find and paste each URL! 🚀


