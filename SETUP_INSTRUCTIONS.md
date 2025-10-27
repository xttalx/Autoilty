# Autoilty - Complete Setup Instructions

## 📋 Quick Start Checklist

- [ ] Install Node.js (v18+)
- [ ] Install MongoDB (or use Atlas)
- [ ] Install Redis (optional)
- [ ] Configure environment variables
- [ ] Install dependencies
- [ ] Start the backend
- [ ] Test the API

---

## 🚀 Step-by-Step Setup

### 1. Install Node.js

**Download & Install:**
- Go to https://nodejs.org/
- Download the LTS version
- Run the installer
- Restart your terminal

**Verify Installation:**
```bash
node --version
npm --version
```

**Expected output:**
```
v18.17.0  (or higher)
9.8.0     (or higher)
```

---

### 2. Install MongoDB

**Option A: Local MongoDB (Recommended for Development)**

1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Complete the installation wizard
4. Start MongoDB:
   ```bash
   # Windows
   net start MongoDB
   
   # Or use the MongoDB Compass GUI
   ```

**Option B: MongoDB Atlas (Cloud - Free Tier)**

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a new cluster
4. Get your connection string
5. It will look like: `mongodb+srv://user:pass@cluster.mongodb.net/autoilty`

---

### 3. Backend Setup

**Step 1: Navigate to backend folder**
```bash
cd backend
```

**Step 2: Copy environment file**
```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

**Step 3: Configure environment**
Open `.env` and update these values:

```env
# Change this to your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/autoilty

# Generate a random secret (minimum 32 characters)
JWT_SECRET=your-super-secret-key-change-this-123456789

# Optional: Add your OpenAI API key
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-key-here

# Default port (change if needed)
PORT=5000
```

**Step 4: Install dependencies**
```bash
npm install
```

This may take a few minutes. It will install:
- Express.js
- Mongoose
- OpenAI SDK
- Socket.io
- JWT authentication
- And 20+ other packages

**Step 5: Start the server**
```bash
# Development mode (auto-reload on changes)
npm run dev

# Production mode
npm start
```

**You should see:**
```
✅ Autoilty Backend Server Running
🌐 Port: 5000
🗄️  Database: Connected
🤖 AI: Enabled
```

---

### 4. Test the Backend

Open a browser and visit:
- **Health Check:** http://localhost:5000/api/health

You should see:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "version": "2.0.0"
}
```

---

### 5. Frontend Setup (Optional)

If you want to run the React frontend:

```bash
# From project root
cd frontend
npm install
npm start
```

Frontend will run at: http://localhost:3000

---

## 🐳 Docker Setup (Alternative)

If you have Docker installed:

```bash
# From project root
docker-compose up --build
```

This will start:
- Backend on port 5000
- Frontend on port 3000
- MongoDB on port 27017
- Redis on port 6379

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment | No | development |
| `MONGODB_URI` | Database URL | **Yes** | - |
| `JWT_SECRET` | Auth secret | **Yes** | - |
| `OPENAI_API_KEY` | AI API key | No | - |
| `REDIS_URL` | Redis URL | No | - |
| `FRONTEND_URL` | CORS origin | No | http://localhost:3000 |

### MongoDB Connection Strings

**Local:**
```
mongodb://localhost:27017/autoilty
```

**Atlas:**
```
mongodb+srv://username:password@cluster.mongodb.net/autoilty
```

**With Auth:**
```
mongodb://username:password@localhost:27017/autoilty?authSource=admin
```

---

## 🧪 Testing

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\",\"username\":\"testuser\"}"
```

### 3. Test AI Chat
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Tell me about winter tires\",\"category\":\"general\",\"province\":\"QC\",\"sessionId\":\"test-123\"}"
```

---

## 🐛 Troubleshooting

### Node.js not found
```
The term 'node' is not recognized
```
**Solution:** Install Node.js from https://nodejs.org/ and restart terminal

### MongoDB connection error
```
MongooseError: connect ECONNREFUSED
```
**Solution:** 
- Start MongoDB: `net start MongoDB`
- Or use Atlas cloud database
- Check connection string in `.env`

### Port already in use
```
Error: listen EADDRINUSE :::5000
```
**Solution:** 
- Change PORT in `.env` file to 5001
- Or kill the process: `taskkill /F /IM node.exe`

### npm install fails
```
npm ERR! code ETIMEDOUT
```
**Solution:**
```bash
npm cache clean --force
npm install --verbose
```

### OpenAI errors
```
API key not valid
```
**Solution:**
- Check API key in `.env`
- Make sure you have credits in OpenAI account
- Backend works without OpenAI (uses local knowledge base)

---

## 📁 Project Structure

```
autoilty/
├── backend/               # Backend API
│   ├── server.js         # Main server file
│   ├── .env              # Environment config
│   ├── package.json      # Dependencies
│   └── README_SETUP.md   # Setup guide
│
├── frontend/              # React frontend
│   ├── src/              # Source files
│   ├── public/           # Static files
│   └── package.json      # Dependencies
│
├── index.html            # Static homepage
├── forum.html           # Forum page
├── css/                 # Styles
├── js/                  # JavaScript
└── docker-compose.yml   # Docker config
```

---

## 🎯 Next Steps

1. **Test the API** - Visit http://localhost:5000/api/health
2. **Browse the site** - Open `index.html` in browser
3. **Add sample data** - Database will auto-populate
4. **Connect frontend** - Run `cd frontend && npm start`
5. **Deploy** - See `DEPLOYMENT.md` for production setup

---

## 📚 Additional Resources

- **Backend API Docs:** See `backend/server.js` for all endpoints
- **Frontend Guide:** See `frontend/README.md`
- **Database Schema:** See `backend/server.js` lines 58-130
- **AI Chat System:** See `backend/server.js` lines 134-226
- **Docker Setup:** See `docker-compose.yml`

---

## 🆘 Need Help?

- Check error messages in terminal
- Verify all prerequisites are installed
- Make sure `.env` file is configured
- Check MongoDB is running
- Review log files in `backend/logs/`

---

**You're all set!** 🎉

The backend is now running at http://localhost:5000

