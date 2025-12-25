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
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

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

    // Messages table (supports anonymous messages - from_user_id can be null)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        from_user_id INTEGER,
        to_user_id INTEGER NOT NULL,
        posting_id INTEGER NOT NULL,
        from_name TEXT NOT NULL,
        from_email TEXT NOT NULL,
        from_phone TEXT,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (posting_id) REFERENCES postings(id) ON DELETE CASCADE
      )
    `);
    
    // Fix existing table: Make from_user_id nullable if it's not already
    try {
      await pool.query(`
        ALTER TABLE messages 
        ALTER COLUMN from_user_id DROP NOT NULL
      `);
    } catch (alterError) {
      // Column might already be nullable or table might not exist yet - ignore
      if (!alterError.message.includes('does not exist') && !alterError.message.includes('already')) {
        console.warn('Could not alter from_user_id column (may already be nullable):', alterError.message);
      }
    }

    // Create indexes for better query performance
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_postings_user_id ON postings(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_postings_category ON postings(category)`);
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

// Create message (public - allows anonymous messages)
app.post('/api/messages', async (req, res) => {
  try {
    const { postingId, toUserId, name, email, phone, message } = req.body;

    // Validation
    if (!postingId || !toUserId || !name || !email || !message) {
      return res.status(400).json({ error: 'Posting ID, recipient user ID, name, email, and message are required' });
    }

    // Ensure messages table exists (safety check)
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          from_user_id INTEGER,
          to_user_id INTEGER NOT NULL,
          posting_id INTEGER NOT NULL,
          from_name TEXT NOT NULL,
          from_email TEXT NOT NULL,
          from_phone TEXT,
          message TEXT NOT NULL,
          read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE SET NULL,
          FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (posting_id) REFERENCES postings(id) ON DELETE CASCADE
        )
      `);
      
      // Fix existing table: Make from_user_id nullable if it's not already
      try {
        await pool.query(`
          ALTER TABLE messages 
          ALTER COLUMN from_user_id DROP NOT NULL
        `);
      } catch (alterError) {
        // Column might already be nullable or error might be different - ignore
        if (!alterError.message.includes('does not exist') && !alterError.message.includes('already')) {
          console.warn('Could not alter from_user_id column (may already be nullable):', alterError.message);
        }
      }
      
      // Create indexes if they don't exist
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_messages_to_user_id ON messages(to_user_id)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_messages_posting_id ON messages(posting_id)`);
      await pool.query(`CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC)`);
    } catch (tableError) {
      console.warn('Messages table creation check failed (may already exist):', tableError.message);
    }

    // Get posting details
    const posting = await dbGet(
      `SELECT p.*, u.username, u.email as seller_email 
       FROM postings p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.id = $1`,
      [postingId]
    );

    if (!posting) {
      return res.status(404).json({ error: 'Posting not found' });
    }

    // Verify toUserId matches posting owner
    if (posting.user_id !== parseInt(toUserId)) {
      return res.status(400).json({ error: 'Recipient user ID does not match posting owner' });
    }

    // Get sender user ID if authenticated (optional)
    let fromUserId = null;
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET);
        fromUserId = decoded.id;
        
        // Prevent sending message to yourself
        if (fromUserId === parseInt(toUserId)) {
          return res.status(400).json({ error: 'Cannot send message to yourself' });
        }
      }
    } catch (authError) {
      // Not authenticated - allow anonymous message
      fromUserId = null;
    }

    // Create message in database (from_user_id can be null for anonymous)
    const result = await pool.query(
      `INSERT INTO messages (from_user_id, to_user_id, posting_id, from_name, from_email, from_phone, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [fromUserId, toUserId, postingId, name, email, phone || null, message]
    );

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
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get inbox messages (protected - messages received by logged-in user)
app.get('/api/messages/inbox', authenticateToken, async (req, res) => {
  try {
    const messages = await dbAll(
      `SELECT m.*, 
              p.title as posting_title, 
              p.price as posting_price,
              p.image_url as posting_image,
              u_from.username as from_username
       FROM messages m
       JOIN postings p ON m.posting_id = p.id
       LEFT JOIN users u_from ON m.from_user_id = u_from.id
       WHERE m.to_user_id = $1
       ORDER BY m.created_at DESC`,
      [req.user.id]
    );

    res.json({
      messages: messages.map(m => ({
        id: m.id,
        postingId: m.posting_id,
        postingTitle: m.posting_title,
        postingPrice: parseFloat(m.posting_price),
        postingImage: m.posting_image,
        fromUserId: m.from_user_id,
        fromUsername: m.from_username || null,
        fromEmail: m.from_email,
        fromName: m.from_name,
        fromPhone: m.from_phone,
        message: m.message,
        read: m.read || false,
        createdAt: m.created_at
      }))
    });
  } catch (error) {
    console.error('Get inbox error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get conversation for a specific posting (protected)
app.get('/api/messages/conversation/:postingId', authenticateToken, async (req, res) => {
  try {
    const { postingId } = req.params;

    // Verify user owns the posting or is part of the conversation
    const posting = await dbGet('SELECT * FROM postings WHERE id = $1', [postingId]);
    if (!posting) {
      return res.status(404).json({ error: 'Posting not found' });
    }

    // Get all messages for this posting where user is either sender or receiver
    const messages = await dbAll(
      `SELECT m.*, 
              u_from.username as from_username,
              u_to.username as to_username
       FROM messages m
       LEFT JOIN users u_from ON m.from_user_id = u_from.id
       JOIN users u_to ON m.to_user_id = u_to.id
       WHERE m.posting_id = $1 
         AND (m.from_user_id = $2 OR m.to_user_id = $2)
       ORDER BY m.created_at ASC`,
      [postingId, req.user.id]
    );

      // Mark messages as read if they were sent to the current user
      await pool.query(
        `UPDATE messages SET read = TRUE 
         WHERE posting_id = $1 AND to_user_id = $2 AND read = FALSE`,
        [postingId, req.user.id]
      );

      res.json({
        posting: {
          id: posting.id,
          title: posting.title,
          price: parseFloat(posting.price),
          imageUrl: posting.image_url
        },
        messages: messages.map(m => ({
          id: m.id,
          fromUserId: m.from_user_id,
          fromUsername: m.from_username || null,
          fromName: m.from_name,
          fromEmail: m.from_email,
          fromPhone: m.from_phone,
          toUserId: m.to_user_id,
          toUsername: m.to_username,
          message: m.message,
          createdAt: m.created_at,
          isFromMe: m.from_user_id === req.user.id,
          read: true // Mark as read when viewing conversation
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

    // Mark as read
    await pool.query('UPDATE messages SET read = TRUE WHERE id = $1', [id]);

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Mark message as read error:', error);
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
