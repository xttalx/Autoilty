# 🚀 Autoilty Deployment Guide

Complete deployment instructions for all platforms.

---

## 🎯 Quick Deploy Options

### Option 1: Docker (Recommended)

**Requirements:**
- Docker Desktop installed
- Docker Compose v2+

**Steps:**

1. **Clone repository**
```bash
git clone https://github.com/xttalx/Autoilty.git
cd autoilty
```

2. **Configure environment**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your values (MongoDB URI, OpenAI API key, etc.)
```

3. **Start services**
```bash
docker-compose up -d
```

4. **Access application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

5. **View logs**
```bash
docker-compose logs -f
```

6. **Stop services**
```bash
docker-compose down
```

---

### Option 2: Railway (Backend)

**Deploy backend to Railway in 5 minutes:**

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login**
```bash
railway login
```

3. **Deploy backend**
```bash
cd backend
railway init
railway up
```

4. **Set environment variables in Railway dashboard:**
- `MONGODB_URI` (use MongoDB Atlas)
- `OPENAI_API_KEY`
- `JWT_SECRET`
- `FRONTEND_URL`

5. **Get your API URL** from Railway dashboard

---

### Option 3: Vercel (Frontend)

**Deploy frontend to Vercel:**

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel
```

3. **Configure environment variables** in Vercel dashboard:
- `REACT_APP_API_URL=https://your-railway-backend-url`

4. **Access your site** at the Vercel URL

---

### Option 4: Render (Full Stack)

**Deploy both frontend and backend on Render:**

1. **Create account** at render.com

2. **Deploy Backend:**
   - New → Web Service
   - Connect your GitHub repo
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Add environment variables

3. **Deploy Frontend:**
   - New → Static Site
   - Connect your GitHub repo
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `build`

4. **Configure environment variables** for both services

---

## 🗄️ Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create account** at mongodb.com/cloud/atlas

2. **Create cluster**
   - Choose free tier (M0)
   - Select region closest to your users
   - Create cluster

3. **Create database user**
   - Database Access → Add New User
   - Choose password authentication
   - Save credentials

4. **Whitelist IP**
   - Network Access → Add IP Address
   - Allow access from anywhere: `0.0.0.0/0` (for development)
   - Or add specific IPs for production

5. **Get connection string**
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your database user password
   - Add to `MONGODB_URI` in `.env`

---

## 🔑 OpenAI API Setup

1. **Create account** at platform.openai.com

2. **Generate API key**
   - Dashboard → API Keys → Create new secret key
   - Copy key immediately (shown only once)

3. **Add to environment**
```env
OPENAI_API_KEY=sk-your-key-here
```

4. **Set usage limits** (recommended)
   - Organization Settings → Limits
   - Set monthly budget limit

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (automatic on Vercel/Railway/Render)
- [ ] Configure CORS to allow only your frontend domain
- [ ] Set up MongoDB IP whitelist (don't use 0.0.0.0/0 in production)
- [ ] Enable rate limiting (already configured)
- [ ] Set `NODE_ENV=production`
- [ ] Review and test authentication flows
- [ ] Enable MongoDB Atlas backup
- [ ] Set up error monitoring (Sentry recommended)
- [ ] Configure custom domain with SSL

---

## 🌐 Custom Domain Setup

### Vercel (Frontend)

1. **Add domain** in Vercel dashboard
2. **Update DNS** records as instructed
3. **Wait for SSL** certificate (automatic)

### Railway (Backend)

1. **Generate Railway domain** or add custom
2. **Configure** `FRONTEND_URL` in environment variables
3. **Update frontend** `REACT_APP_API_URL` to Railway domain

---

## 📊 Monitoring & Logs

### View Logs

**Docker:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Railway:**
```bash
railway logs
```

**Vercel:**
- Dashboard → Deployments → Function Logs

### Error Monitoring

**Recommended: Sentry**

1. **Install Sentry**
```bash
# Backend
npm install @sentry/node

# Frontend  
npm install @sentry/react
```

2. **Initialize in code**
```javascript
// Backend (server.js)
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });

// Frontend (index.js)
import * as Sentry from "@sentry/react";
Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Automatic Deployment)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm install
      - run: cd backend && npm test
      - uses: railway/cli@v3
        with:
          service: backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm install
      - run: cd frontend && npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
          vercel-args: '--prod'
```

---

## 🐛 Troubleshooting

### Frontend can't connect to backend

**Check:**
1. Backend is running: `curl http://localhost:5000/api/health`
2. CORS is configured correctly
3. `REACT_APP_API_URL` points to correct backend URL
4. Check browser console for errors

### MongoDB connection fails

**Check:**
1. Connection string format is correct
2. Password doesn't contain special characters (URL encode if it does)
3. IP is whitelisted in MongoDB Atlas
4. Network allows outbound connections to MongoDB

### OpenAI API errors

**Check:**
1. API key is valid and active
2. You have API credits/billing enabled
3. Rate limits not exceeded
4. Model name is correct (`gpt-4-turbo-preview`)

### Docker containers not starting

**Check:**
```bash
docker-compose ps
docker-compose logs
docker system prune -a  # Clean up if needed
```

---

## 📈 Performance Optimization

### Production Checklist

- [ ] Enable Redis for session caching
- [ ] Set up CDN (Cloudflare) for static assets
- [ ] Optimize images (use WebP format)
- [ ] Enable gzip compression (included in nginx config)
- [ ] Implement lazy loading for routes
- [ ] Use React.lazy() for code splitting
- [ ] Monitor bundle size (use source-map-explorer)
- [ ] Set up database indexes in MongoDB
- [ ] Enable MongoDB connection pooling
- [ ] Configure proper cache headers

---

## 🔄 Update & Maintenance

### Update Application

```bash
# Pull latest code
git pull origin main

# Update dependencies
cd backend && npm update
cd ../frontend && npm update

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

### Backup Database

```bash
# Manual backup
docker exec -it autoilty-mongo-1 mongodump --out /backup

# Automated daily backup (add to crontab)
0 2 * * * docker exec autoilty-mongo-1 mongodump --out /backup/$(date +\%Y-\%m-\%d)
```

---

## 🎯 Production Environment Variables

### Backend (.env)

```env
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/autoilty?retryWrites=true&w=majority

# Security
JWT_SECRET=your-production-secret-min-32-chars
SESSION_SECRET=your-session-secret

# OpenAI
OPENAI_API_KEY=sk-your-production-key

# Frontend
FRONTEND_URL=https://autoilty.com

# Redis (if using)
REDIS_URL=redis://your-redis-url:6379

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Sentry (optional)
SENTRY_DSN=https://your-sentry-dsn
```

### Frontend (.env.production)

```env
REACT_APP_API_URL=https://api.autoilty.com
REACT_APP_WS_URL=wss://api.autoilty.com
REACT_APP_SENTRY_DSN=https://your-sentry-dsn
REACT_APP_GA_ID=G-XXXXXXXXXX
```

---

## ✅ Post-Deployment Checklist

- [ ] Test AI chat on all pages
- [ ] Verify user registration/login
- [ ] Test forum posting
- [ ] Check bilingual switching (EN/FR)
- [ ] Test on mobile devices
- [ ] Verify SSL certificate
- [ ] Test payment integration (if applicable)
- [ ] Check email notifications
- [ ] Review error logs
- [ ] Set up uptime monitoring
- [ ] Configure backup strategy
- [ ] Test disaster recovery
- [ ] Document any production-specific configs

---

## 🆘 Support

**Issues?** Check:
1. [GitHub Issues](https://github.com/xttalx/Autoilty/issues)
2. Review logs: `docker-compose logs -f`
3. Check health endpoints: `/api/health`
4. Verify all environment variables are set

---

**🎉 Congratulations! Your Autoilty platform is now deployed and running!**

