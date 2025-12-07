# Database Setup Guide

## 📊 Database Overview

The Autoilty Marketplace uses **SQLite** database, which is perfect for development and small-to-medium applications. SQLite is file-based and requires **no separate database server installation**.

## ✅ What You Need to Know

### Automatic Database Creation

**Good news!** The database is **automatically created** when you start the server. You don't need to set up anything manually.

### What Happens Automatically

1. When you run `npm start`, the server:
   - Creates `database.sqlite` file (if it doesn't exist)
   - Creates all required tables automatically
   - Sets up indexes for better performance

2. The database file location:
   ```
   autoilty/database.sqlite
   ```

## 📋 Database Tables

The system automatically creates two tables:

### 1. `users` Table
Stores user account information:
- `id` - Primary key (auto-increment)
- `username` - Unique username
- `email` - Unique email address
- `password_hash` - Hashed password (bcrypt)
- `created_at` - Account creation timestamp

### 2. `postings` Table
Stores marketplace postings:
- `id` - Primary key (auto-increment)
- `user_id` - Foreign key to users table
- `title` - Posting title
- `description` - Detailed description
- `price` - Price in CAD
- `category` - Cars, Parts, Services, or Other
- `image_url` - Path to uploaded image
- `location` - Location string
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Indexes (Auto-created)
- Index on `user_id` for faster queries
- Index on `category` for filtering

## 🚀 Setup Steps

### Step 1: Install Dependencies (if not done)

```bash
npm install
```

This installs `sqlite3` package which handles the database.

### Step 2: Start the Server

```bash
npm start
```

**That's it!** The database will be created automatically.

You'll see:
```
🚀 Server running on http://localhost:5000
📁 Database: C:/path/to/database.sqlite
📸 Uploads: C:/path/to/uploads
```

### Step 3: (Optional) Seed Sample Data

To populate the database with sample users and postings:

```bash
npm run seed
```

This creates:
- 3 sample users:
  - `demo_user` / `password123`
  - `johndoe` / `password123`
  - `janedoe` / `password123`
- 8 sample postings

## 🔧 Database Management

### View Database Contents

You can use any SQLite browser tool:

**Option 1: Command Line**
```bash
sqlite3 database.sqlite
```

Then run SQL queries:
```sql
.tables              -- List all tables
SELECT * FROM users; -- View all users
SELECT * FROM postings; -- View all postings
.exit                -- Exit
```

**Option 2: GUI Tools**
- [DB Browser for SQLite](https://sqlitebrowser.org/) (Free, recommended)
- [SQLiteStudio](https://sqlitestudio.pl/)
- VS Code Extension: SQLite Viewer

**Option 3: Online Tools**
- Upload `database.sqlite` to [SQLite Viewer](https://sqliteviewer.app/)

### Reset Database

If you want to start fresh:

1. Stop the server (Ctrl+C)
2. Delete the database file:
   ```bash
   # Windows PowerShell
   Remove-Item database.sqlite
   
   # Or just delete it manually in File Explorer
   ```
3. Restart the server - it will create a new empty database

### Backup Database

Simply copy the `database.sqlite` file:

```bash
# Windows PowerShell
Copy-Item database.sqlite database.sqlite.backup

# Or copy manually in File Explorer
```

To restore, just rename the backup file back to `database.sqlite`.

## 📁 Database File Location

The database file is stored in your project root:
```
autoilty/
├── database.sqlite    ← Database file (auto-created)
├── server.js
├── package.json
└── ...
```

## 🔒 Database Security

### What's Protected

- Passwords are hashed using bcrypt (10 rounds)
- User data is stored securely
- Foreign key constraints ensure data integrity

### Backup Recommendations

1. **Regular Backups**: Copy `database.sqlite` regularly
2. **Before Updates**: Always backup before major changes
3. **Version Control**: The database file is in `.gitignore` (not committed to Git)

## ⚠️ Important Notes

### Do NOT Commit Database to Git

The `database.sqlite` file is in `.gitignore` and should **never** be committed because:
- It contains user passwords (hashed)
- It can get large
- It's environment-specific

### Database File Size

- Starts small (~10KB empty)
- Grows with data (users, postings, images)
- Each posting: ~1-2KB
- Images are stored in `uploads/` folder, not in database

### Multiple Environments

If you have multiple environments (dev, staging, prod):
- Each will have its own `database.sqlite` file
- Don't share database files between environments
- Use different database file names if needed (modify `server.js`)

## 🚨 Troubleshooting

### Database Locked Error

**Problem**: "SQLITE_BUSY: database is locked"

**Solution**:
- Make sure only one server instance is running
- Stop all server instances
- Restart the server

### Permission Errors

**Problem**: "EACCES: permission denied"

**Solution**:
- Check file permissions in project directory
- Run terminal as administrator if needed
- Ensure write permissions in project folder

### Database Not Creating

**Problem**: Database file doesn't appear

**Solution**:
1. Check server logs for errors
2. Verify `sqlite3` package is installed: `npm list sqlite3`
3. Check disk space
4. Verify write permissions

### Reset All Data

**Problem**: Want to start completely fresh

**Solution**:
```bash
# 1. Stop server
# 2. Delete database and uploads
Remove-Item database.sqlite
Remove-Item -Recurse -Force uploads

# 3. Restart server (creates new empty database)
npm start

# 4. (Optional) Seed sample data
npm run seed
```

## 🔄 Migrating to Production Database

For production, you might want to use PostgreSQL or MySQL instead of SQLite.

### Current Setup (SQLite)
- ✅ Perfect for development
- ✅ No server needed
- ✅ Easy to backup (just copy file)
- ❌ Not ideal for high-traffic production

### Production Options

**Option 1: Keep SQLite** (for small apps)
- Simple and works fine for low-medium traffic
- Just ensure regular backups

**Option 2: PostgreSQL** (recommended for production)
- Better for concurrent users
- More robust
- Requires database server setup

**Option 3: MySQL/MariaDB**
- Similar to PostgreSQL
- Good for production

To migrate, you'll need to:
1. Modify `server.js` to use a different database driver
2. Update connection string
3. Run table creation scripts on new database

## 📊 Database Schema Details

### Users Table Schema

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Postings Table Schema

```sql
CREATE TABLE postings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Cars', 'Parts', 'Services', 'Other')),
  image_url TEXT,
  location TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## ✅ Quick Start Checklist

- [ ] Run `npm install` to install dependencies
- [ ] Run `npm start` to start server (database auto-creates)
- [ ] (Optional) Run `npm run seed` for sample data
- [ ] Database file `database.sqlite` appears in project root
- [ ] You're ready to use the marketplace!

## 📚 Additional Resources

- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [SQLite Tutorial](https://www.sqlitetutorial.net/)
- [DB Browser for SQLite](https://sqlitebrowser.org/)

---

**Summary**: The database is **automatically created** when you start the server. No manual setup required! Just run `npm start` and you're good to go. 🚀


