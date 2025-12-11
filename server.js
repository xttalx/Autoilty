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
const fs = require('fs').promises;
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;
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
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// ───────────────────────────────
// FIXED CORS — WORKS 100% ON RAILWAY + VERCEL
// ───────────────────────────────
app.use(cors({
  origin: [
    'https://autoilty.com',
    'https://www.autoilty.com',     // if you ever use www
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://autoilty.vercel.app'   // fallback
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests explicitly (some hosts need this)
app.options('*', cors());
// Security headers (production)
if (isProduction) {
  app.use((req, res, next) => {
    // Prevent XSS attacks
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // Prevent MIME type sniffing
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(UPLOAD_DIR));

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}
ensureUploadDir();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

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

    // Create indexes for better query performance
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_postings_user_id ON postings(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_postings_category ON postings(category)`);
    
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
    
    let query = `
      SELECT p.*, u.username 
      FROM postings p
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    let paramCount = 0;
    if (category) {
      paramCount++;
      query += ` AND p.category = $${paramCount}`;
      params.push(category);
    }

    if (search) {
      const searchTerm = `%${search}%`;
      paramCount++;
      query += ` AND (p.title LIKE $${paramCount} OR p.description LIKE $${paramCount + 1})`;
      params.push(searchTerm, searchTerm);
      paramCount++;
    }

    paramCount++;
    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const postings = await dbAll(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM postings WHERE 1=1';
    const countParams = [];
    let countParamNum = 0;
    
    if (category) {
      countParamNum++;
      countQuery += ` AND category = $${countParamNum}`;
      countParams.push(category);
    }
    
    if (search) {
      const searchTerm = `%${search}%`;
      countParamNum++;
      countQuery += ` AND (title LIKE $${countParamNum} OR description LIKE $${countParamNum + 1})`;
      countParams.push(searchTerm, searchTerm);
    }

    const countResult = await dbGet(countQuery, countParams);
    const total = parseInt(countResult.total);

    res.json({
      postings: postings.map(p => ({
        ...p,
        price: parseFloat(p.price),
        image_url: p.image_url ? `/uploads/${path.basename(p.image_url)}` : null
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get postings error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
      image_url: posting.image_url ? `/uploads/${path.basename(posting.image_url)}` : null
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
        image_url: p.image_url ? `/uploads/${path.basename(p.image_url)}` : null
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

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

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
        image_url: posting.image_url ? `/uploads/${path.basename(posting.image_url)}` : null
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
      // Delete old image if exists
      if (existing.image_url) {
        try {
          const oldImagePath = existing.image_url.startsWith('/uploads/') 
            ? path.join(UPLOAD_DIR, path.basename(existing.image_url))
            : existing.image_url;
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.warn('Could not delete old image:', err);
        }
      }
      paramNum++;
      updates.push(`image_url = $${paramNum}`);
      params.push(`/uploads/${req.file.filename}`);
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
        image_url: posting.image_url ? `/uploads/${path.basename(posting.image_url)}` : null
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

    // Delete image file if exists
    if (posting.image_url) {
      try {
        const imagePath = posting.image_url.startsWith('/uploads/') 
          ? path.join(UPLOAD_DIR, path.basename(posting.image_url))
          : posting.image_url;
        await fs.unlink(imagePath);
      } catch (err) {
        console.warn('Could not delete image file:', err);
      }
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
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server successfully running on port ${PORT}`);
  console.log(`Database: PostgreSQL (Supabase)`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Visit: https://autoilty-production.up.railway.app`);
});


// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('✅ Database closed');
    }
    process.exit(0);
  });
});

