# Autoilty Backend Setup Guide

This guide will help you set up the backend for Autoilty.

## Prerequisites

You need to install the following:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Or use a version manager like `nvm`

2. **MongoDB** (v7 or higher)
   - Option A: Install locally from https://www.mongodb.com/try/download/community
   - Option B: Use MongoDB Atlas (Cloud - Free): https://www.mongodb.com/cloud/atlas

3. **Redis** (Optional but recommended)
   - Download from: https://redis.io/download
   - Or use Docker: `docker run -d -p 6379:6379 redis:alpine`

## Quick Setup

### Step 1: Install Node.js

**Windows:**
1. Download Node.js from https://nodejs.org/
2. Run the installer (LTS version recommended)
3. Restart your terminal/PowerShell

**Verify installation:**
```bash
node --version
npm --version
```

### Step 2: Install MongoDB

**Option A: Local Installation**
1. Download MongoDB Community Edition: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service:
   ```bash
   # On Windows
   net start MongoDB
   ```

**Option B: MongoDB Atlas (Cloud - Easier)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a cluster
4. Get connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/autoilty`)

### Step 3: Configure Environment

1. Copy the example environment file:
   ```bash
   cd backend
   copy .env.example .env
   ```

2. Edit `.env` and add your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/autoilty
   # Or for Atlas: mongodb+srv://user:pass@cluster.mongodb.net/autoilty
   JWT_SECRET=your-random-secret-key-here-min-32-characters
   OPENAI_API_KEY=sk-your-openai-api-key
   ```

### Step 4: Install Dependencies

```bash
cd backend
npm install
```

This will install all required packages:
- express (web framework)
- mongoose (MongoDB ODM)
- openai (AI integration)
- socket.io (real-time chat)
- jsonwebtoken (authentication)
- bcryptjs (password hashing)
- And more...

### Step 5: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## Configuration Details

### MongoDB Setup

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/autoilty
```

**MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autoilty
```

**Testing Connection:**
```bash
# This will create test data if database is empty
# The server automatically connects on startup
```

### OpenAI Configuration

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Go to API Keys: https://platform.openai.com/api-keys
4. Create a new secret key
5. Add to `.env`:
   ```env
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxx
   ```

**Note:** OpenAI API requires a paid account (usage-based pricing). 
You can still run the backend without it - it will use the local knowledge base.

### JWT Secret

Generate a secure random string:
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

Or use an online generator: https://randomkeygen.com/

### Redis Setup (Optional)

**Using Docker:**
```bash
docker run -d -p 6379:6379 --name redis redis:alpine
```

**Local installation:**
- Download from https://redis.io/download
- Start Redis server

## Testing the Setup

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

Or visit: http://localhost:5000/api/health

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "2.0.0"
}
```

### 2. Test Database Connection
Check the terminal output when starting the server:
```
✅ MongoDB Connected
```

### 3. Test AI Chat (if OpenAI is configured)
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about winter tires in Quebec",
    "category": "general",
    "province": "QC",
    "sessionId": "test-123"
  }'
```

## Common Issues

### Issue 1: Node.js not found
**Solution:** Install Node.js from https://nodejs.org/

### Issue 2: MongoDB connection error
**Solution:** 
- Make sure MongoDB is running: `net start MongoDB`
- Or update `MONGODB_URI` to use Atlas

### Issue 3: Port 5000 already in use
**Solution:** Change `PORT` in `.env` to another port (e.g., 5001)

### Issue 4: npm install fails
**Solution:**
```bash
# Update npm
npm install -g npm@latest

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 5: OpenAI API errors
**Solution:**
- Check if API key is valid
- Check if you have credits in OpenAI account
- The system works without OpenAI (uses local KB)

## Directory Structure

```
backend/
├── server.js          # Main server file
├── .env               # Environment variables (create this)
├── .env.example       # Example environment file
├── package.json       # Dependencies
├── README_SETUP.md    # This file
└── logs/             # Logs directory (auto-created)
```

## API Endpoints

Once running, the following endpoints are available:

- `GET /api/health` - Health check
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/chat/message` - Send message to AI

## Next Steps

1. Start the frontend (see frontend README)
2. Or deploy to cloud (see DEPLOYMENT.md)
3. Configure production settings

## Development Tools

**Recommended VS Code extensions:**
- ESLint
- Prettier
- REST Client (for API testing)

## Docker Setup (Alternative)

If you prefer using Docker:
```bash
docker-compose up
```

See `../docker-compose.yml` for full setup.

---

Need help? Check the main README.md or open an issue.

