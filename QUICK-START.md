# 🚀 Quick Start Guide

Get the Autoilty Marketplace up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Start Backend Server

Open a terminal and run:

```bash
npm start
```

You should see:
```
🚀 Server running on http://localhost:5000
📁 Database: /path/to/database.sqlite
📸 Uploads: /path/to/uploads
```

**Keep this terminal open!**

## Step 3: Start Frontend Server

Open a **new terminal** and run:

```bash
npm run frontend
```

You should see the frontend running at `http://localhost:3000`

## Step 4: Seed Database (Optional)

In another terminal, optionally run:

```bash
npm run seed
```

This creates sample users and postings for testing.

## Step 5: Access the Marketplace

1. Open your browser to `http://localhost:3000`
2. Click **"Marketplace"** (you'll be redirected to login)
3. Register a new account OR use sample credentials:
   - **Username**: `demo_user`
   - **Password**: `password123`

## That's it! 🎉

You can now:
- ✅ Browse postings in the marketplace
- ✅ Create your own postings
- ✅ Edit and delete your postings
- ✅ Search and filter postings

## Next Steps

- Read the full documentation in `README-MARKETPLACE.md`
- Customize categories and styling
- Deploy to production

## Troubleshooting

**Port already in use?**
- Backend: Change `PORT` in `server.js` or environment
- Frontend: Change port in `package.json` scripts

**Can't connect to backend?**
- Make sure backend is running on port 5000
- Check browser console for errors
- Verify API_BASE_URL in `auth.js` and `marketplace-api.js`

**Database errors?**
- Delete `database.sqlite` and restart server
- It will be recreated automatically

## Need Help?

Check `README-MARKETPLACE.md` for detailed documentation.


