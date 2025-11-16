# Running Autoilty Locally (Without Deployment)

You can run the app completely locally without any deployment platforms.

## Quick Start - Run Everything Locally

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-all
```

### Step 2: Set Up Environment Variables

**Create `.env` in root directory:**
```env
REACT_APP_SUPABASE_URL=https://riimwxyjsqatyvttdajp.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Create `.env` in `client` directory:**
```env
REACT_APP_SUPABASE_URL=https://riimwxyjsqatyvttdajp.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_key
REACT_APP_API_URL=http://localhost:5000
```

### Step 3: Run the Application

**Option A: Run Both Together (Recommended)**
```bash
npm run dev
```
This starts both frontend (port 3000) and backend (port 5000) automatically.

**Option B: Run Separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

### Step 4: Access the App

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## What Works Locally

✅ Everything works locally:
- User authentication
- Product browsing
- Shopping cart
- Vendor dashboard
- Admin panel
- Order history
- Image uploads
- **Payment processing** (if backend is running)

## Troubleshooting

### Port Already in Use
If port 3000 or 5000 is in use:
- Change `PORT` in root `.env` for backend
- Or kill the process using the port:
  ```bash
  # Windows PowerShell
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

### Backend Not Starting
- Check that `STRIPE_SECRET_KEY` is set in root `.env`
- Verify Node.js is installed: `node --version`
- Check for errors in the terminal

### Frontend Not Starting
- Check that Supabase variables are set in `client/.env`
- Clear cache: `cd client && npm start -- --reset-cache`
- Delete `node_modules` and reinstall if needed

### White Screen
- Open browser console (F12) and check for errors
- Verify Supabase environment variables are correct
- Check that Supabase project is active

## Building for Production (Without Deployment)

If you want to build the app but not deploy it:

```bash
cd client
npm run build
```

This creates a `client/build` folder with production-ready files. You can:
- Serve it with any static file server
- Use `serve` package: `npx serve -s build`
- Copy to any web server

## Alternative: Use a Simple Static Server

After building, you can serve it locally:

```bash
# Install serve globally
npm install -g serve

# Build the app
cd client
npm run build

# Serve the build folder
serve -s build -l 3000
```

## Benefits of Running Locally

- ✅ No deployment needed
- ✅ Faster development
- ✅ Easy debugging
- ✅ Full control
- ✅ Works offline (except Supabase calls)
- ✅ No deployment platform limitations

## Next Steps

1. Make sure your `.env` files are configured
2. Run `npm run dev`
3. Open http://localhost:3000
4. Test all features locally
5. Once everything works locally, you can decide if you want to deploy

