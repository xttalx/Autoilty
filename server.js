/**
 * AUTOILTY MARKETPLACE - BACKEND SERVER
 * 
 * Express server with:
 * - User authentication (login/register)
 * - JWT token management
 * - Postings CRUD API
 * - Protected routes
 * - File upload handling
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// JWT_SECRET is required in production for security
const JWT_SECRET = process.env.JWT_SECRET || (isProduction ? null : 'development-secret-key');
if (isProduction && !JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET environment variable is required in production!');
  console.error('Please set JWT_SECRET in your Railway environment variables.');
  process.exit(1);
}

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// ───────────────────────────────
// EMAIL CONFIGURATION
// ───────────────────────────────
// Configure nodemailer transporter
// Supports SMTP (Gmail, SendGrid, etc.) or SendGrid API
function createEmailTransporter() {
  // Try SendGrid API first (if SENDGRID_API_KEY is set)
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  }
  
  // Fallback to SMTP (Gmail, custom SMTP, etc.)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  // Development: Use Ethereal (fake SMTP for testing)
  if (!isProduction) {
    console.warn('⚠️  No email config found - using Ethereal for development');
    return null; // Will create on-demand
  }
  
  console.warn('⚠️  No email configuration found - emails will not be sent');
  return null;
}

let emailTransporter = createEmailTransporter();

// Helper function to send email
async function sendEmail(to, subject, html, text) {
  try {
    // If no transporter in dev, log instead
    if (!emailTransporter && !isProduction) {
      console.log('📧 [DEV] Email would be sent to:', to);
      console.log('📧 [DEV] Subject:', subject);
      console.log('📧 [DEV] Body:', text || html);
      return { success: true, message: 'Email logged (dev mode)' };
    }
    
    if (!emailTransporter) {
      throw new Error('Email transporter not configured');
    }
    
    const fromEmail = process.env.FROM_EMAIL || 'noreply@autoilty.com';
    const fromName = process.env.FROM_NAME || 'Autolity Marketplace';
    
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: to,
      subject: subject,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      html: html
    };
    
    const info = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}

// ───────────────────────────────
// CORS CONFIGURATION - SIMPLIFIED
// ───────────────────────────────
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://autoilty.com',
      'https://www.autoilty.com',
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5000'
    ];
    
    // Allow requests with no origin (server-to-server, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware - handles all requests including OPTIONS preflight
app.use(cors(corsOptions));

// Security headers (production)
if (isProduction) {
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Removed /uploads static serving - using Supabase Storage now

// Configure multer for memory storage (to get buffer for Supabase upload)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Database setup - PostgreSQL (Supabase)
// IMPORTANT: Set DATABASE_URL environment variable in Railway!
// Get connection string from: Supabase Dashboard → Settings → Database → Connection string
// Format: postgresql://postgres:PASSWORD@HOST:PORT/postgres
// For Railway, use Connection Pooling URL (port 6543) - more reliable
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is required!');
  console.error('Please set DATABASE_URL in Railway environment variables.');
  console.error('Get it from: Supabase Dashboard → Settings → Database → Connection string');
  process.exit(1);
}

// Parse connection string and configure for IPv4
function getDbConfig(connectionString) {
  try {
    const url = new URL(connectionString);
    // Use connection object format to ensure IPv4 connectivity
    return {
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      database: url.pathname.slice(1) || 'postgres',
      user: url.username || 'postgres',
      password: decodeURIComponent(url.password || ''),
      ssl: {
        rejectUnauthorized: false // Required for Supabase
      },
      // Additional options to ensure reliable connection
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      max: 20 // Maximum pool size
    };
  } catch (error) {
    console.error('Error parsing DATABASE_URL:', error);
    // Fallback: try connection string format
    return {
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    };
  }
}

// Create PostgreSQL connection pool
const pool = new Pool(getDbConfig(DATABASE_URL));

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err);
});

// ───────────────────────────────
// SUPABASE STORAGE CONFIGURATION
// ───────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'postings';

let supabaseStorage = null;

if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
  try {
    supabaseStorage = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('✅ Supabase Storage client initialized');
  } catch (error) {
    console.error('❌ Error initializing Supabase Storage:', error);
  }
} else {
  console.warn('⚠️  Supabase Storage not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.');
}

/**
 * Upload file to Supabase Storage
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} fileName - File name
 * @param {string} contentType - MIME type
 * @returns {Promise<string|null>} Public URL of uploaded file
 */
async function uploadToSupabaseStorage(fileBuffer, fileName, contentType) {
  if (!supabaseStorage) {
    throw new Error('Supabase Storage not configured');
  }

  try {
    // Upload file to Supabase Storage bucket
    const { data, error } = await supabaseStorage.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(fileName, fileBuffer, {
        contentType: contentType,
        upsert: false
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabaseStorage.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(fileName);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    console.log('✅ Image uploaded to Supabase Storage:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading to Supabase Storage:', error);
    throw error;
  }
}

/**
 * Delete file from Supabase Storage
 * @param {string} imageUrl - Full URL or path of the image
 */
async function deleteFromSupabaseStorage(imageUrl) {
  if (!supabaseStorage || !imageUrl) {
    return;
  }

  try {
    // Extract file name from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1].split('?')[0]; // Remove query params

    const { error } = await supabaseStorage.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .remove([fileName]);

    if (error) {
      console.warn('Could not delete image from Supabase Storage:', error);
    } else {
      console.log('✅ Image deleted from Supabase Storage:', fileName);
    }
  } catch (error) {
    console.warn('Error deleting from Supabase Storage:', error);
  }
}

// Initialize database tables (idempotent - safe to run multiple times)
async function initializeDatabase() {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        bio TEXT,
        profile_picture_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add bio and profile_picture_url columns if they don't exist (migration)
    try {
      await pool.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'bio'
          ) THEN
            ALTER TABLE users ADD COLUMN bio TEXT;
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'profile_picture_url'
          ) THEN
            ALTER TABLE users ADD COLUMN profile_picture_url TEXT;
          END IF;
        END $$;
      `);
    } catch (migrationError) {
      console.warn('Profile columns migration:', migrationError.message);
    }

    // Postings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS postings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category TEXT NOT NULL CHECK (category IN ('Cars', 'Parts', 'Services', 'Other')),
        image_url TEXT,
        location TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Messages table (requires authentication - no anonymous messages)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        posting_id INTEGER,
        from_user_id INTEGER NOT NULL,
        to_user_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        read BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (posting_id) REFERENCES postings(id) ON DELETE SET NULL
      )
    `);
    
    // Ensure from_user_id is NOT NULL (migration for existing tables)
    try {
      await pool.query(`
        DO $$
        BEGIN
          IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'messages' 
            AND column_name = 'from_user_id' 
            AND is_nullable = 'YES'
          ) THEN
            -- First, delete any messages with null from_user_id (orphaned anonymous messages)
            DELETE FROM messages WHERE from_user_id IS NULL;
            -- Then make column NOT NULL
            ALTER TABLE messages ALTER COLUMN from_user_id SET NOT NULL;
            RAISE NOTICE 'Column from_user_id set to NOT NULL';
          END IF;
        END $$;
      `);
    } catch (alterError) {
      // Column might already be NOT NULL or table might not exist yet - ignore
      if (!alterError.message.includes('does not exist') && !alterError.message.includes('already')) {
        console.warn('Could not alter from_user_id column:', alterError.message);
      }
    }

    // Migration: Add "read" column if it doesn't exist (for existing tables)
    try {
      const columnCheck = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'messages' AND column_name = 'read'
      `);
      
      if (columnCheck.rows.length === 0) {
        // Column doesn't exist, add it
        await pool.query(`
          ALTER TABLE messages 
          ADD COLUMN read BOOLEAN DEFAULT FALSE NOT NULL
        `);
        console.log('✅ Added "read" column to messages table');
      }
    } catch (readColumnError) {
      // Column might already exist or table might not exist yet - ignore
      if (!readColumnError.message.includes('already exists') && !readColumnError.message.includes('does not exist')) {
        console.warn('Could not add "read" column (may already exist):', readColumnError.message);
      }
    }

    // Create indexes for better query performance
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_postings_user_id ON postings(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_postings_category ON postings(category)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_messages_from_user_id ON messages(from_user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_messages_to_user_id ON messages(to_user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_messages_posting_id ON messages(posting_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC)`);
    
    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// Initialize database on startup
initializeDatabase();

// Helper functions for database queries
const dbGet = async (query, params = []) => {
  try {
    const result = await pool.query(query, params);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

const dbAll = async (query, params = []) => {
  try {
    const result = await pool.query(query, params);
    return result.rows || [];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

const dbRun = async (query, params = []) => {
  try {
    const result = await pool.query(query, params);
    // PostgreSQL returns rows for INSERT, UPDATE, DELETE
    // For INSERT, get the last inserted ID from RETURNING clause if available
    const lastID = result.rows[0]?.id || null;
    const changes = result.rowCount || 0;
    return { id: lastID, changes };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await dbGet(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user - PostgreSQL returns the id with RETURNING
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [username, email, passwordHash]
    );

    const userId = result.rows[0].id;

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, username, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: result.id,
        username,
        email
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const user = await dbGet(
      'SELECT * FROM users WHERE username = $1 OR email = $1',
      [username]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await dbGet(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// USER PROFILE ROUTES
// ============================================

// Get user profile (protected)
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await dbGet(
      'SELECT id, username, email, bio, profile_picture_url, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio || null,
      profile_picture_url: user.profile_picture_url || null,
      created_at: user.created_at
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile (protected)
app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const { bio } = req.body;
    
    // Validate bio length
    if (bio && bio.length > 500) {
      return res.status(400).json({ error: 'Bio must be 500 characters or less' });
    }

    // Update user profile
    await pool.query(
      'UPDATE users SET bio = $1 WHERE id = $2',
      [bio || null, req.user.id]
    );

    // Fetch updated profile
    const user = await dbGet(
      'SELECT id, username, email, bio, profile_picture_url, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio || null,
      profile_picture_url: user.profile_picture_url || null,
      created_at: user.created_at
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload profile picture (protected)
app.post('/api/users/profile/picture', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get current user to check for existing profile picture
    const currentUser = await dbGet('SELECT profile_picture_url FROM users WHERE id = $1', [req.user.id]);
    
    // Delete old profile picture if exists
    if (currentUser && currentUser.profile_picture_url) {
      await deleteFromSupabaseStorage(currentUser.profile_picture_url);
    }

    // Upload new profile picture to Supabase Storage
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileName = `profile-${req.user.id}-${uniqueSuffix}${path.extname(req.file.originalname)}`;
      const profilePictureUrl = await uploadToSupabaseStorage(req.file.buffer, fileName, req.file.mimetype);

      // Update user profile picture URL
      await pool.query(
        'UPDATE users SET profile_picture_url = $1 WHERE id = $2',
        [profilePictureUrl, req.user.id]
      );

      res.json({
        message: 'Profile picture uploaded successfully',
        profile_picture_url: profilePictureUrl
      });
    } catch (uploadError) {
      console.error('Profile picture upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload profile picture. Please try again.' });
    }
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// POSTINGS ROUTES
// ============================================

// Get all postings (public - no auth required for viewing)
app.get('/api/postings', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    // Build base query - returns ALL postings from ALL users (public endpoint)
    // No user filtering - this is a public endpoint showing all postings
    let query = `
      SELECT p.*, u.username 
      FROM postings p
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    // Add category filter if provided
    if (category && category !== 'all') {
      paramCount++;
      query += ` AND p.category = $${paramCount}`;
      params.push(category);
    }

    // Add search filter if provided (case-insensitive)
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      paramCount++;
      query += ` AND (p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount + 1})`;
      params.push(searchTerm, searchTerm);
      paramCount++; // Increment for second parameter
    }

    // Add ordering, limit, and offset
    paramCount++;
    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    console.log('🔍 GET /api/postings - Query:', query);
    console.log('🔍 GET /api/postings - Params:', params);
    
    const postings = await dbAll(query, params);
    
    console.log(`📦 GET /api/postings - Found ${postings.length} postings`);

    // Get total count for pagination (matching the same filters)
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM postings p
      WHERE 1=1
    `;
    const countParams = [];
    let countParamNum = 0;
    
    if (category && category !== 'all') {
      countParamNum++;
      countQuery += ` AND p.category = $${countParamNum}`;
      countParams.push(category);
    }
    
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      countParamNum++;
      countQuery += ` AND (p.title ILIKE $${countParamNum} OR p.description ILIKE $${countParamNum + 1})`;
      countParams.push(searchTerm, searchTerm);
      countParamNum++; // Increment for second parameter
    }

    const countResult = await dbGet(countQuery, countParams);
    const total = parseInt(countResult.total) || 0;

    console.log(`📊 GET /api/postings - Total postings: ${total}, Page: ${page}, Limit: ${limit}`);

    res.json({
      postings: postings.map(p => ({
        ...p,
        price: parseFloat(p.price) || 0,
        image_url: p.image_url || null // Already full URL from Supabase Storage
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('❌ Get postings error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Get single posting
app.get('/api/postings/:id', async (req, res) => {
  try {
    const posting = await dbGet(
      `SELECT p.*, u.username 
       FROM postings p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [req.params.id]
    );

    if (!posting) {
      return res.status(404).json({ error: 'Posting not found' });
    }

    res.json({
      ...posting,
      price: parseFloat(posting.price),
      image_url: posting.image_url || null // Already full URL from Supabase Storage
    });
  } catch (error) {
    console.error('Get posting error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's postings (requires auth)
app.get('/api/postings/user/my-postings', authenticateToken, async (req, res) => {
  try {
    const postings = await dbAll(
      'SELECT * FROM postings WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json({
      postings: postings.map(p => ({
        ...p,
        price: parseFloat(p.price),
        image_url: p.image_url || null // Already full URL from Supabase Storage
      }))
    });
  } catch (error) {
    console.error('Get user postings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create posting (requires auth)
app.post('/api/postings', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category, location } = req.body;

    // Validation
    if (!title || !description || !price || !category) {
      return res.status(400).json({ error: 'Title, description, price, and category are required' });
    }

    const validCategories = ['Cars', 'Parts', 'Services', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Upload image to Supabase Storage if provided
    let imageUrl = null;
    if (req.file) {
      try {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = `posting-${uniqueSuffix}${path.extname(req.file.originalname)}`;
        imageUrl = await uploadToSupabaseStorage(req.file.buffer, fileName, req.file.mimetype);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image. Please try again.' });
      }
    }

    // Create posting - PostgreSQL returns the id with RETURNING
    const result = await pool.query(
      `INSERT INTO postings (user_id, title, description, price, category, image_url, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [req.user.id, title, description, parseFloat(price), category, imageUrl, location || null]
    );

    const postingId = result.rows[0].id;

    // Fetch created posting
    const posting = await dbGet('SELECT * FROM postings WHERE id = $1', [postingId]);

    res.status(201).json({
      message: 'Posting created successfully',
      posting: {
        ...posting,
        price: parseFloat(posting.price),
        image_url: posting.image_url || null // Already full URL from Supabase
      }
    });
  } catch (error) {
    console.error('Create posting error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update posting (requires auth - owner only)
app.put('/api/postings/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    // Check if posting exists and belongs to user
    const existing = await dbGet('SELECT * FROM postings WHERE id = $1', [req.params.id]);

    if (!existing) {
      return res.status(404).json({ error: 'Posting not found' });
    }

    if (existing.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to edit this posting' });
    }

    const { title, description, price, category, location } = req.body;
    
    // Update fields
    const updates = [];
    const params = [];
    let paramNum = 0;

    if (title) {
      paramNum++;
      updates.push(`title = $${paramNum}`);
      params.push(title);
    }
    if (description) {
      paramNum++;
      updates.push(`description = $${paramNum}`);
      params.push(description);
    }
    if (price) {
      paramNum++;
      updates.push(`price = $${paramNum}`);
      params.push(parseFloat(price));
    }
    if (category) {
      paramNum++;
      updates.push(`category = $${paramNum}`);
      params.push(category);
    }
    if (location !== undefined) {
      paramNum++;
      updates.push(`location = $${paramNum}`);
      params.push(location || null);
    }
    if (req.file) {
      // Delete old image from Supabase Storage if exists
      if (existing.image_url) {
        await deleteFromSupabaseStorage(existing.image_url);
      }
      
      // Upload new image to Supabase Storage
      try {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = `posting-${uniqueSuffix}${path.extname(req.file.originalname)}`;
        const imageUrl = await uploadToSupabaseStorage(req.file.buffer, fileName, req.file.mimetype);
        
        paramNum++;
        updates.push(`image_url = $${paramNum}`);
        params.push(imageUrl);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image. Please try again.' });
      }
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    paramNum++;
    params.push(req.params.id);

    await pool.query(
      `UPDATE postings SET ${updates.join(', ')} WHERE id = $${paramNum}`,
      params
    );

    // Fetch updated posting
    const posting = await dbGet('SELECT * FROM postings WHERE id = $1', [req.params.id]);

    res.json({
      message: 'Posting updated successfully',
      posting: {
        ...posting,
        price: parseFloat(posting.price),
        image_url: posting.image_url || null // Already full URL from Supabase
      }
    });
  } catch (error) {
    console.error('Update posting error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete posting (requires auth - owner only)
app.delete('/api/postings/:id', authenticateToken, async (req, res) => {
  try {
    // Check if posting exists and belongs to user
    const posting = await dbGet('SELECT * FROM postings WHERE id = $1', [req.params.id]);

    if (!posting) {
      return res.status(404).json({ error: 'Posting not found' });
    }

    if (posting.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this posting' });
    }

    // Delete image from Supabase Storage if exists
    if (posting.image_url) {
      await deleteFromSupabaseStorage(posting.image_url);
    }

    // Delete posting
    await pool.query('DELETE FROM postings WHERE id = $1', [req.params.id]);

    res.json({ message: 'Posting deleted successfully' });
  } catch (error) {
    console.error('Delete posting error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// MESSAGES ROUTES
// ============================================

// Create message (protected - requires authentication)
app.post('/api/messages', authenticateToken, async (req, res) => {
  try {
    const { postingId, toUserId, message } = req.body;
    const fromUserId = req.user.id;

    // Validation
    if (!toUserId || !message) {
      return res.status(400).json({ error: 'Recipient user ID and message are required' });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Prevent sending message to yourself
    if (fromUserId === parseInt(toUserId)) {
      return res.status(400).json({ error: 'Cannot send message to yourself' });
    }

    // Verify recipient user exists
    const recipient = await dbGet('SELECT id FROM users WHERE id = $1', [toUserId]);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient user not found' });
    }

    // Verify posting exists if postingId is provided
    // Note: postingId is optional context for conversations
    // We don't require toUserId to match posting owner because:
    // - Initial messages: toUserId matches posting owner (correct)
    // - Replies: toUserId is the person you're replying to (may differ from posting owner)
    let postingIdValue = null;
    if (postingId) {
      const posting = await dbGet('SELECT id FROM postings WHERE id = $1', [postingId]);
      if (!posting) {
        return res.status(404).json({ error: 'Posting not found' });
      }
      postingIdValue = postingId;
    }

    // Get sender user info for from_name and from_email (if columns exist)
    const sender = await dbGet('SELECT username, email FROM users WHERE id = $1', [fromUserId]);
    const fromName = sender ? sender.username : null;
    const fromEmail = sender ? sender.email : null;

    // Check if from_name, from_email, from_phone columns exist in the table
    // This allows the code to work with both old and new schema
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'messages' 
      AND column_name IN ('from_name', 'from_email', 'from_phone')
    `);
    
    const hasFromName = columnCheck.rows.some(row => row.column_name === 'from_name');
    const hasFromEmail = columnCheck.rows.some(row => row.column_name === 'from_email');
    const hasFromPhone = columnCheck.rows.some(row => row.column_name === 'from_phone');

    // Build dynamic INSERT query based on which columns exist
    let insertQuery;
    let insertParams;
    
    if (hasFromName || hasFromEmail || hasFromPhone) {
      // Old schema with from_name, from_email, from_phone
      const columns = ['from_user_id', 'to_user_id', 'posting_id', 'message'];
      const values = [fromUserId, toUserId, postingIdValue, message.trim()];
      const placeholders = [];
      
      if (hasFromName) {
        columns.push('from_name');
        values.push(fromName);
      }
      if (hasFromEmail) {
        columns.push('from_email');
        values.push(fromEmail);
      }
      if (hasFromPhone) {
        columns.push('from_phone');
        values.push(null); // from_phone is optional
      }
      
      placeholders.push(...values.map((_, i) => `$${i + 1}`));
      
      insertQuery = `
        INSERT INTO messages (${columns.join(', ')})
        VALUES (${placeholders.join(', ')})
        RETURNING id
      `;
      insertParams = values;
    } else {
      // New schema without from_name, from_email, from_phone
      insertQuery = `
        INSERT INTO messages (from_user_id, to_user_id, posting_id, message)
        VALUES ($1, $2, $3, $4) RETURNING id
      `;
      insertParams = [fromUserId, toUserId, postingIdValue, message.trim()];
    }

    // Create message in database
    const result = await pool.query(insertQuery, insertParams);

    const messageId = result.rows[0].id;

    // No email sending - pure in-app messaging

    res.status(201).json({
      message: 'Message sent successfully',
      messageId: messageId
    });
  } catch (error) {
    console.error('Create message error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      constraint: error.constraint,
      stack: error.stack,
      body: req.body
    });
    
    // Handle specific database constraint errors
    if (error.code === '23502') { // NOT NULL violation
      return res.status(400).json({ 
        error: 'Database constraint error: Missing required field',
        details: error.message 
      });
    }
    
    if (error.code === '23503') { // Foreign key violation
      return res.status(400).json({ 
        error: 'Invalid reference: User or posting not found',
        details: error.message 
      });
    }
    
    // Generic error response
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get inbox messages (protected - messages received by logged-in user, grouped by sender/conversation)
app.get('/api/messages/inbox', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all unique conversations (grouped by from_user_id and posting_id)
    const uniqueConversations = await dbAll(`
      SELECT DISTINCT 
        m.from_user_id,
        m.posting_id,
        u.username as from_username,
        p.title as posting_title,
        p.image_url as posting_image
      FROM messages m
      JOIN users u ON m.from_user_id = u.id
      LEFT JOIN postings p ON m.posting_id = p.id
      WHERE m.to_user_id = $1 OR m.from_user_id = $1
      ORDER BY m.from_user_id, m.posting_id
    `, [userId]);

    // Get all messages for each conversation
    const conversationsWithMessages = await Promise.all(
      uniqueConversations.map(async (conv) => {
        // Get all messages in this conversation (bidirectional)
        const messages = await dbAll(`
          SELECT 
            m.id,
            m.from_user_id,
            m.to_user_id,
            m.posting_id,
            m.message,
            m.created_at,
            m.read,
            u_from.username as from_username,
            u_to.username as to_username
          FROM messages m
          JOIN users u_from ON m.from_user_id = u_from.id
          JOIN users u_to ON m.to_user_id = u_to.id
          WHERE (
            (m.from_user_id = $1 AND m.to_user_id = $2) OR
            (m.from_user_id = $2 AND m.to_user_id = $1)
          )
          ${conv.posting_id ? 'AND m.posting_id = $3' : 'AND m.posting_id IS NULL'}
          ORDER BY m.created_at ASC
        `, conv.posting_id ? [userId, conv.from_user_id, conv.posting_id] : [userId, conv.from_user_id]);

        // Get unread count for this conversation
        const unreadResult = await dbGet(`
          SELECT COUNT(*) as unread_count
          FROM messages
          WHERE to_user_id = $1 
            AND from_user_id = $2
            ${conv.posting_id ? 'AND posting_id = $3' : 'AND posting_id IS NULL'}
            AND read = FALSE
        `, conv.posting_id ? [userId, conv.from_user_id, conv.posting_id] : [userId, conv.from_user_id]);

        return {
          fromUserId: conv.from_user_id,
          fromUsername: conv.from_username,
          postingId: conv.posting_id,
          postingTitle: conv.posting_title,
          postingImage: conv.posting_image,
          messages: messages.map(msg => ({
            id: msg.id,
            fromUserId: msg.from_user_id,
            fromUsername: msg.from_username,
            toUserId: msg.to_user_id,
            toUsername: msg.to_username,
            postingId: msg.posting_id,
            message: msg.message,
            createdAt: msg.created_at,
            read: msg.read,
            isFromMe: msg.from_user_id === userId
          })),
          unreadCount: parseInt(unreadResult?.unread_count || 0)
        };
      })
    );

    res.json({
      conversations: conversationsWithMessages
    });
  } catch (error) {
    console.error('Get inbox error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get conversation with a specific user (protected)
app.get('/api/messages/conversation/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    const otherUserId = parseInt(userId);

    // Verify other user exists
    const otherUser = await dbGet('SELECT id, username FROM users WHERE id = $1', [otherUserId]);
    if (!otherUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all messages between current user and other user
    const messages = await dbAll(
      `SELECT m.*, 
              u_from.username as from_username,
              u_to.username as to_username,
              p.title as posting_title,
              p.image_url as posting_image
       FROM messages m
       JOIN users u_from ON m.from_user_id = u_from.id
       JOIN users u_to ON m.to_user_id = u_to.id
       LEFT JOIN postings p ON m.posting_id = p.id
       WHERE (m.from_user_id = $1 AND m.to_user_id = $2)
          OR (m.from_user_id = $2 AND m.to_user_id = $1)
       ORDER BY m.created_at ASC`,
      [currentUserId, otherUserId]
    );

    // Mark messages as read if they were sent to the current user
    try {
      await pool.query(
        `UPDATE messages SET read = TRUE 
         WHERE ((from_user_id = $1 AND to_user_id = $2) OR (from_user_id = $2 AND to_user_id = $1))
           AND to_user_id = $2 AND read = FALSE`,
        [currentUserId, otherUserId]
      );
    } catch (updateError) {
      console.warn('Could not mark messages as read:', updateError.message);
    }

    res.json({
      user: {
        id: otherUser.id,
        username: otherUser.username
      },
      messages: messages.map(m => ({
        id: m.id,
        postingId: m.posting_id,
        postingTitle: m.posting_title,
        postingImage: m.posting_image,
        fromUserId: m.from_user_id,
        fromUsername: m.from_username,
        toUserId: m.to_user_id,
        toUsername: m.to_username,
        message: m.message,
        createdAt: m.created_at,
        isFromMe: m.from_user_id === currentUserId,
        read: m.read || false
      }))
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark message as read (protected)
app.put('/api/messages/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify message belongs to user (they received it)
    const message = await dbGet('SELECT * FROM messages WHERE id = $1', [id]);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.to_user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to mark this message as read' });
    }

    // Check if "read" column exists before updating
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'messages' AND column_name = 'read'
    `);
    
    if (columnCheck.rows.length > 0) {
      // Column exists, mark as read
      await pool.query('UPDATE messages SET read = TRUE WHERE id = $1', [id]);
    } else {
      // Column doesn't exist yet - return success anyway (migration will add it)
      console.warn('"read" column missing, cannot mark message as read');
    }

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark message as read error:', error);
    // If error is about missing column, return success anyway
    if (error.message && error.message.includes('column "read" does not exist')) {
      return res.json({ message: 'Message marked as read' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get unread message count for logged-in user (protected)
app.get('/api/messages/unread-count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if "read" column exists before querying
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'messages' AND column_name = 'read'
    `);
    
    let result;
    if (columnCheck.rows.length > 0) {
      // Column exists, use it
      result = await dbGet(
        `SELECT COUNT(*) as unread_count 
         FROM messages 
         WHERE to_user_id = $1 AND read = FALSE`,
        [userId]
      );
    } else {
      // Column doesn't exist yet, return 0 (all messages are effectively unread)
      // This should not happen after migration, but safe fallback
      result = { unread_count: '0' };
    }
    
    res.json({ unreadCount: parseInt(result.unread_count || 0) });
  } catch (error) {
    console.error('Get unread count error:', error);
    // If error is about missing column, return 0 as fallback
    if (error.message && error.message.includes('column "read" does not exist')) {
      console.warn('"read" column missing, returning 0 unread count');
      return res.json({ unreadCount: 0 });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// BUSINESS DIRECTORY ROUTES
// ============================================

// Simple in-memory cache for search results (5 minute TTL)
const searchCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(params) {
  return JSON.stringify({
    keyword: params.keyword || '',
    location: params.location || '',
    category: params.category || '',
    userLat: params.userLat || null,
    userLng: params.userLng || null
  });
}

function getCachedResult(key) {
  const cached = searchCache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    searchCache.delete(key);
    return null;
  }
  
  return cached.data;
}

function setCachedResult(key, data) {
  searchCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

// Clean up old cache entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of searchCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      searchCache.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Haversine formula to calculate distance between two coordinates
 * Returns distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

/**
 * Convert kilometers to miles
 */
function kmToMiles(km) {
  return km * 0.621371;
}

/**
 * Map category to Google Places types
 */
function getPlaceTypes(category) {
  const categoryMap = {
    'Regular Maintenance': ['car_repair', 'car_dealer'],
    'Detailing': ['car_wash', 'car_repair'],
    'Custom Builds': ['car_repair', 'establishment'],
    'Tuning': ['car_repair'],
    'Wheels and Tires': ['car_repair', 'store'],
    'Auto Parts Yard': ['auto_parts_store', 'store']
  };
  return categoryMap[category] || ['car_repair', 'car_dealer', 'car_wash', 'auto_parts_store'];
}

/**
 * Search for businesses using Google Places API
 */
app.post('/api/directory/search', async (req, res) => {
  try {
    // Check if API key is configured
    if (!GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ 
        error: 'Google Places API key not configured',
        message: 'Please set GOOGLE_PLACES_API_KEY environment variable' 
      });
    }

    const { keyword, location, category, userLat, userLng, unit = 'miles' } = req.body;

    // Validate inputs
    if (!keyword && !category) {
      return res.status(400).json({ error: 'Keyword or category is required' });
    }

    if (!location && (!userLat || !userLng)) {
      return res.status(400).json({ error: 'Location or user coordinates required' });
    }

    // Sanitize inputs
    const sanitizedKeyword = keyword ? keyword.trim().slice(0, 100) : '';
    const sanitizedLocation = location ? location.trim().slice(0, 100) : '';

    // Build search query
    let searchQuery = '';
    if (sanitizedKeyword && category) {
      searchQuery = `${sanitizedKeyword} ${category}`;
    } else if (sanitizedKeyword) {
      searchQuery = sanitizedKeyword;
    } else {
      searchQuery = category;
    }

    // Check cache first
    const cacheKey = getCacheKey({ keyword: sanitizedKeyword, location: sanitizedLocation, category, userLat, userLng });
    const cachedResult = getCachedResult(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    // Determine location for search
    let searchLocation = null;
    let userCoordinates = null;

    if (userLat && userLng) {
      userCoordinates = { lat: parseFloat(userLat), lng: parseFloat(userLng) };
      searchLocation = `${userLat},${userLng}`;
    } else if (sanitizedLocation) {
      searchLocation = sanitizedLocation;
    }

    if (!searchLocation) {
      return res.status(400).json({ error: 'No valid location provided' });
    }

    // Get place types based on category
    const placeTypes = category ? getPlaceTypes(category) : [];

    // Build Google Places API request
    const placesUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    const params = new URLSearchParams({
      query: searchQuery + (placeTypes.length > 0 ? ` ${placeTypes[0]}` : ''),
      key: GOOGLE_PLACES_API_KEY,
      ...(searchLocation && { location: searchLocation }),
      radius: '25000', // 25km radius
    });

    const response = await axios.get(`${placesUrl}?${params.toString()}`);

    if (response.data.status === 'REQUEST_DENIED') {
      return res.status(500).json({ 
        error: 'Google Places API request denied',
        message: response.data.error_message || 'Invalid API key or billing not enabled'
      });
    }

    if (response.data.status === 'ZERO_RESULTS') {
      return res.json({ 
        businesses: [],
        message: 'No businesses found matching your search'
      });
    }

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      return res.status(500).json({ 
        error: 'Google Places API error',
        message: response.data.error_message || response.data.status
      });
    }

    // Process results
    let businesses = response.data.results.map(place => {
      const business = {
        place_id: place.place_id,
        name: place.name,
        rating: place.rating || 0,
        user_ratings_total: place.user_ratings_total || 0,
        formatted_address: place.formatted_address || '',
        geometry: place.geometry,
        photos: place.photos ? place.photos.slice(0, 1) : [], // Get first photo
        website: null, // Will fetch separately if needed
        opening_hours: place.opening_hours,
        types: place.types || []
      };

      // Calculate distance if user coordinates provided
      if (userCoordinates && business.geometry && business.geometry.location) {
        const businessLat = business.geometry.location.lat;
        const businessLng = business.geometry.location.lng;
        const distanceKm = calculateDistance(
          userCoordinates.lat,
          userCoordinates.lng,
          businessLat,
          businessLng
        );
        business.distance_km = distanceKm;
        business.distance_miles = kmToMiles(distanceKm);
      }

      return business;
    });

    // Sort by distance if available, otherwise by rating
    if (userCoordinates) {
      businesses.sort((a, b) => {
        if (a.distance_km && b.distance_km) {
          return a.distance_km - b.distance_km;
        }
        return (b.rating || 0) - (a.rating || 0);
      });
    } else {
      businesses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    // Limit to 20 results
    businesses = businesses.slice(0, 20);

    // Fetch website URLs for businesses (optional, can be done client-side)
    // For now, we'll return place_id and let client fetch if needed

    // Format response
    const formattedBusinesses = businesses.map(business => ({
      id: business.place_id,
      name: business.name,
      rating: business.rating,
      user_ratings_total: business.user_ratings_total,
      address: business.formatted_address,
      location: business.geometry?.location,
      photo_reference: business.photos?.[0]?.photo_reference,
      distance_km: business.distance_km,
      distance_miles: business.distance_miles,
      distance: unit === 'miles' 
        ? business.distance_miles 
        : business.distance_km,
      distance_unit: unit,
      opening_hours: business.opening_hours,
      types: business.types
    }));

    const result = {
      businesses: formattedBusinesses,
      count: formattedBusinesses.length,
      unit: unit
    };

    // Cache the result
    setCachedResult(cacheKey, result);

    res.json(result);

  } catch (error) {
    console.error('Business search error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Get business details including website
 */
app.get('/api/directory/business/:placeId', async (req, res) => {
  try {
    if (!GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ error: 'Google Places API key not configured' });
    }

    const { placeId } = req.params;
    const detailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
    const params = new URLSearchParams({
      place_id: placeId,
      key: GOOGLE_PLACES_API_KEY,
      fields: 'name,rating,user_ratings_total,formatted_address,website,geometry,photos,opening_hours'
    });

    const response = await axios.get(`${detailsUrl}?${params.toString()}`);

    if (response.data.status !== 'OK') {
      return res.status(404).json({ 
        error: 'Business not found',
        message: response.data.error_message 
      });
    }

    const place = response.data.result;
    res.json({
      id: place.place_id,
      name: place.name,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      address: place.formatted_address,
      website: place.website,
      location: place.geometry?.location,
      photo_reference: place.photos?.[0]?.photo_reference,
      opening_hours: place.opening_hours
    });

  } catch (error) {
    console.error('Business details error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      ...(isProduction ? {} : { message: error.message })
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint (for Railway health checks)
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Autoilty Marketplace API',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    ...(isProduction ? {} : { details: err.message })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server successfully running on port ${PORT}`);
  console.log(`📁 Database: PostgreSQL (Supabase)`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔗 Visit: https://autoilty-production.up.railway.app`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  pool.end()
    .then(() => {
      console.log('✅ Database pool closed');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error closing database pool:', err);
      process.exit(1);
    });
});

process.on('SIGTERM', () => {
  console.log('\n👋 SIGTERM received, shutting down gracefully...');
  pool.end()
    .then(() => {
      console.log('✅ Database pool closed');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error closing database pool:', err);
      process.exit(1);
    });
});
