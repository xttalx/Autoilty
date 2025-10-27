# 🚀 Autoilty - Quick Start Guide

## ⚡ Fastest Way to Run (Static Site)

The project works as a **static HTML site** without any backend setup!

### Option 1: Just Open in Browser (Simplest)

1. Navigate to project folder:
   ```bash
   cd "C:\Data Transfer\Users\Jasraj\Desktop\Prompt\autoilty"
   ```

2. Open `index.html` in your browser
   - Double-click `index.html`
   - Or drag it into a browser window

3. That's it! The site is running.

**Note:** This runs without a backend. Features that require backend won't work (like user registration), but most content is available.

---

## 🔧 Full Stack Setup (Backend + Frontend)

### Prerequisites

Install these before proceeding:

1. **Node.js** (Required)
   - Download: https://nodejs.org/
   - Choose LTS version
   - Run installer
   - Restart PowerShell

2. **MongoDB** (Required)
   - Option A: Local - https://www.mongodb.com/try/download/community
   - Option B: Cloud (Atlas) - https://www.mongodb.com/cloud/atlas (free tier)

### Backend Setup

**Step 1: Create environment file**
```bash
cd backend
copy .env.example .env
```

**Step 2: Edit `.env` file** (use Notepad or any editor)

Set these values:
```env
MONGODB_URI=mongodb://localhost:27017/autoilty
JWT_SECRET=my-super-secret-key-change-this-1234567890123456
PORT=5000
```

**Step 3: Install and start**
```bash
npm install
npm start
```

You should see:
```
✅ Autoilty Backend Server Running
🌐 Port: 5000
```

---

## 🧪 Test if Backend is Working

Open in browser: http://localhost:5000/api/health

If you see JSON response, backend is running! ✅

---

## 📊 What's Running Where

| Component | URL | Status |
|-----------|-----|--------|
| Homepage | `index.html` | ✅ Works without backend |
| Forum | `forum.html` | ✅ Works without backend |
| Backend API | http://localhost:5000 | ⚠️ Requires Node.js |
| Frontend (React) | http://localhost:3000 | ⚠️ Requires setup |

---

## 🐳 Alternative: Docker (If you have Docker installed)

```bash
docker-compose up --build
```

This starts everything automatically:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- MongoDB: localhost:27017
- Redis: localhost:6379

---

## 📝 Common Issues & Solutions

### Issue: "node is not recognized"
**Solution:** Install Node.js from https://nodejs.org/

### Issue: "MongoDB connection error"
**Solution:** 
- Start MongoDB: `net start MongoDB`
- Or use Atlas: Change `MONGODB_URI` in `.env` to Atlas connection string

### Issue: Port 5000 already in use
**Solution:** Change `PORT=5000` to `PORT=5001` in `.env`

---

## ✅ Recommended Path

**For Quick Testing:**
1. Just open `index.html` in browser ✅

**For Full Features:**
1. Install Node.js
2. Install MongoDB
3. Follow backend setup steps above
4. Run `npm start` in backend folder
5. Test at http://localhost:5000/api/health

**For Production:**
1. Set up MongoDB Atlas (cloud)
2. Configure production `.env`
3. Deploy using Docker or cloud platform

---

## 📚 Detailed Guides

- **Complete Setup:** See `SETUP_INSTRUCTIONS.md`
- **Backend Setup:** See `backend/README_SETUP.md`
- **Project Analysis:** See `PROJECT_ANALYSIS.md`
- **Deployment:** See `DEPLOYMENT.md`

---

**Need help?** Check the terminal output for error messages.

