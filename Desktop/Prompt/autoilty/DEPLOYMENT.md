# Deployment Guide

## Frontend Deployment (Netlify/Vercel)

### Option 1: Netlify

1. **Build the React app:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy:**
   - Go to https://netlify.com
   - Drag and drop the `client/build` folder
   - Or connect your Git repository

3. **Environment Variables:**
   - Go to Site Settings > Environment Variables
   - Add:
     - `REACT_APP_SUPABASE_URL`
     - `REACT_APP_SUPABASE_ANON_KEY`
     - `REACT_APP_STRIPE_PUBLISHABLE_KEY`
     - `REACT_APP_API_URL` (your backend URL)

### Option 2: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd client
   vercel
   ```

3. **Add Environment Variables:**
   - In Vercel Dashboard > Settings > Environment Variables
   - Add the same variables as above

## Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI:**
   ```bash
   npm i -g heroku
   ```

2. **Create Heroku App:**
   ```bash
   heroku create your-app-name
   ```

3. **Set Environment Variables:**
   ```bash
   heroku config:set STRIPE_SECRET_KEY=your_key
   heroku config:set SUPABASE_URL=your_url
   heroku config:set PORT=5000
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

### Option 2: Railway

1. Go to https://railway.app
2. New Project > Deploy from GitHub
3. Select your repository
4. Add environment variables
5. Deploy

### Option 3: Render

1. Go to https://render.com
2. New Web Service
3. Connect repository
4. Set build command: `npm install`
5. Set start command: `node server/index.js`
6. Add environment variables
7. Deploy

## Database (Supabase)

Supabase handles hosting automatically. No deployment needed!

## Post-Deployment Checklist

- [ ] Update CORS settings in backend to allow frontend domain
- [ ] Update `REACT_APP_API_URL` in frontend to production backend URL
- [ ] Switch Stripe keys from test to live (when ready)
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS
- [ ] Test all features in production
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy

## CORS Configuration

Update `server/index.js` to allow your frontend domain:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

## Environment Variables Summary

### Frontend (.env)
```
REACT_APP_SUPABASE_URL=
REACT_APP_SUPABASE_ANON_KEY=
REACT_APP_STRIPE_PUBLISHABLE_KEY=
REACT_APP_API_URL=
```

### Backend (.env)
```
STRIPE_SECRET_KEY=
PORT=5000
NODE_ENV=production
FRONTEND_URL=
```

