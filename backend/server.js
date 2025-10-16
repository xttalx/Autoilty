/**
 * Autoilty Backend Server
 * Handles AI chat, authentication, and forum APIs
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OpenAI } = require('openai');
const socketIO = require('socket.io');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/autoilty', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// OpenAI Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// ==================== MODELS ====================

// User Model
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    firstName: String,
    lastName: String,
    province: String,
    vehicle: {
        make: String,
        model: String,
        year: Number
    },
    preferences: {
        language: { type: String, default: 'en' },
        notifications: { type: Boolean, default: true }
    },
    createdAt: { type: Date, default: Date.now },
    lastLogin: Date,
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' }
});

const User = mongoose.model('User', UserSchema);

// Chat Session Model
const ChatSessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messages: [{
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        metadata: {
            category: String,
            province: String,
            confidence: Number,
            sources: [String]
        }
    }],
    context: {
        category: String,
        province: String,
        vehicle: Object
    },
    createdAt: { type: Date, default: Date.now },
    lastActivity: { type: Date, default: Date.now }
});

const ChatSession = mongoose.model('ChatSession', ChatSessionSchema);

// Forum Thread Model (simplified)
const ThreadSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    subcategory: String,
    tags: [String],
    replies: [{
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: String,
        timestamp: { type: Date, default: Date.now },
        upvotes: { type: Number, default: 0 }
    }],
    views: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    lastActivity: { type: Date, default: Date.now }
});

const Thread = mongoose.model('Thread', ThreadSchema);

// ==================== CANADIAN AUTO KNOWLEDGE BASE ====================

const CANADIAN_AUTO_KB = {
    provinces: {
        ON: {
            name: 'Ontario',
            emissions: 'Drive Clean suspended since April 2019',
            winterTires: 'Recommended but not mandatory',
            rightOnRed: 'Permitted unless signed otherwise',
            insuranceNote: 'Highest insurance rates in Canada',
            recalls: 'Contact Transport Canada or OMVIC'
        },
        QC: {
            name: 'Quebec',
            emissions: 'Not required',
            winterTires: 'MANDATORY December 1 to March 15',
            rightOnRed: 'Prohibited on island of Montreal, permitted elsewhere',
            insuranceNote: 'Public insurance (SAAQ) for injury, private for damage',
            recalls: 'Contact Transport Canada or CAA-Quebec'
        },
        BC: {
            name: 'British Columbia',
            emissions: 'AirCare program in some regions',
            winterTires: 'MANDATORY on designated highways October 1 to March 31',
            rightOnRed: 'Permitted unless signed otherwise',
            insuranceNote: 'ICBC (public insurance) required',
            recalls: 'Contact Transport Canada or ICBC'
        },
        AB: {
            name: 'Alberta',
            emissions: 'Not required',
            winterTires: 'Not mandatory',
            rightOnRed: 'Permitted unless signed otherwise',
            insuranceNote: 'Private insurance market',
            recalls: 'Contact Transport Canada'
        },
        MB: {
            name: 'Manitoba',
            emissions: 'Not required',
            winterTires: 'Not mandatory',
            rightOnRed: 'Permitted unless signed otherwise',
            insuranceNote: 'MPI (public insurance) required',
            recalls: 'Contact Transport Canada'
        },
        SK: {
            name: 'Saskatchewan',
            emissions: 'Not required',
            winterTires: 'Not mandatory',
            rightOnRed: 'Permitted unless signed otherwise',
            insuranceNote: 'SGI (public insurance) required',
            recalls: 'Contact Transport Canada'
        }
    },
    
    commonIssues: {
        'check engine light': {
            keywords: ['check engine', 'engine light', 'cel', 'mil'],
            response_en: 'A check engine light can indicate many issues. Common causes in Canadian vehicles include:\n• O2 sensor failure (especially in cold weather)\n• Loose gas cap\n• Catalytic converter issues\n• Mass airflow sensor\n• Spark plugs/ignition coils\n\nGet the code read at any auto parts store (free) or use an OBD2 scanner. In Canada, common codes include P0420 (catalyst), P0171/P0174 (lean condition).',
            response_fr: 'Un voyant de contrôle moteur peut indiquer de nombreux problèmes. Causes communes au Canada:\n• Capteur O2 défaillant (surtout par temps froid)\n• Bouchon de réservoir desserré\n• Convertisseur catalytique\n• Capteur de débit d\'air massique\n• Bougies d\'allumage/bobines\n\nFaites lire le code dans un magasin de pièces (gratuit) ou utilisez un lecteur OBD2.'
        },
        'winter tires': {
            keywords: ['winter tire', 'snow tire', 'hiver', 'neige'],
            response_en: 'Winter tires are ESSENTIAL in Canada! Key facts:\n• Install when temps consistently below 7°C\n• Look for the 3-peak mountain snowflake symbol\n• Recommended brands: Bridgestone Blizzak, Michelin X-Ice, Nokia Hakkapeliitta\n• Cost: $600-1200 for a set (including installation)\n• MANDATORY in Quebec (Dec 1-Mar 15)\n• Improve braking by 30-40% on ice vs all-season',
            response_fr: 'Les pneus d\'hiver sont ESSENTIELS au Canada! Faits importants:\n• Installer quand températures sous 7°C\n• Chercher le symbole 3 pics montagne flocon\n• Marques recommandées: Bridgestone Blizzak, Michelin X-Ice, Nokia Hakkapeliitta\n• Coût: 600-1200$ l\'ensemble (installation incluse)\n• OBLIGATOIRE au Québec (1er déc - 15 mars)'
        },
        'oil change': {
            keywords: ['oil change', 'oil', 'vidange'],
            response_en: 'Oil change intervals for Canadian climates:\n• Conventional oil: 5,000 km\n• Synthetic blend: 7,500 km\n• Full synthetic: 10,000-12,000 km\n\nCOLD WEATHER NOTE: Consider 0W-20 or 0W-30 in winter for better cold starts. Most dealers charge $80-120. DIY cost: $40-60.\n\nPopular oils in Canada: Mobil 1, Castrol Edge, Pennzoil Platinum.',
            response_fr: 'Intervalles de vidange d\'huile pour le climat canadien:\n• Huile conventionnelle: 5,000 km\n• Mélange synthétique: 7,500 km\n• Entièrement synthétique: 10,000-12,000 km\n\nNOTE TEMPS FROID: Considérez 0W-20 ou 0W-30 en hiver pour meilleurs démarrages.'
        }
    },
    
    vehicleBrands: {
        'toyota': {
            commonIssues: ['Frame rust (Tacoma, Tundra)', 'Oil consumption (2AZ-FE)', 'Airbag recalls'],
            reliability: 'Excellent - Top choice for Canadian winters',
            winterNotes: 'AWD models (RAV4, Highlander) excellent in snow'
        },
        'honda': {
            commonIssues: ['CVT transmission (Civic)', 'AC compressor', 'Rust (older models)'],
            reliability: 'Excellent',
            winterNotes: 'FWD models good with winter tires'
        },
        'ford': {
            commonIssues: ['EcoBoost turbo issues', 'PowerShift transmission', 'Rust (older F-150)'],
            reliability: 'Good - F-150 very popular in Canada',
            winterNotes: '4WD trucks excellent, ensure winter maintenance'
        },
        'tesla': {
            commonIssues: ['Cold weather range loss (30-40%)', 'Door handle freezing', 'Charging in cold'],
            reliability: 'Good - limited service network in rural Canada',
            winterNotes: 'Pre-conditioning essential. Use heated garage if possible. Range drops significantly below -20°C.'
        }
    }
};

// ==================== MIDDLEWARE ====================

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// ==================== ROUTES ====================

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date(),
        version: '2.0.0'
    });
});

// ==================== AUTHENTICATION ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, username, firstName, lastName, province } = req.body;

        // Validate input
        if (!email || !password || !username) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            email,
            password: hashedPassword,
            username,
            firstName,
            lastName,
            province
        });

        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                province: user.province
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// ==================== CHAT ROUTES ====================

// Send Message to AI
app.post('/api/chat/message', async (req, res) => {
    try {
        const { message, category, province, sessionId, history } = req.body;
        const language = req.headers['accept-language'] || 'en';

        // Find or create chat session
        let session = await ChatSession.findOne({ sessionId });
        if (!session) {
            session = new ChatSession({
                sessionId,
                context: { category, province }
            });
        }

        // Build system prompt with Canadian context
        const systemPrompt = buildSystemPrompt(category, province, language);

        // Prepare messages for OpenAI
        const messages = [
            { role: 'system', content: systemPrompt }
        ];

        // Add conversation history
        if (history && history.length > 0) {
            history.forEach(msg => {
                messages.push({
                    role: msg.type === 'user' ? 'user' : 'assistant',
                    content: msg.text
                });
            });
        }

        // Add current message
        messages.push({ role: 'user', content: message });

        // Check for common issues first (faster response)
        const localResponse = checkLocalKnowledgeBase(message, province, language);
        
        let response, confidence, sources = [];

        if (localResponse) {
            response = localResponse.response;
            confidence = localResponse.confidence;
            sources = localResponse.sources;
        } else if (process.env.OPENAI_API_KEY) {
            // Call OpenAI API
            const completion = await openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            });

            response = completion.choices[0].message.content;
            confidence = 0.9;
            sources = ['OpenAI GPT-4'];
        } else {
            // Fallback response
            response = language === 'fr' 
                ? 'Je suis désolé, je ne peux pas répondre à cette question pour le moment. Veuillez essayer de reformuler ou consulter notre forum.'
                : 'I\'m sorry, I can\'t answer that question right now. Please try rephrasing or check our forum.';
            confidence = 0.5;
        }

        // Save to session
        session.messages.push(
            { role: 'user', content: message, metadata: { category, province } },
            { role: 'assistant', content: response, metadata: { confidence, sources } }
        );
        session.lastActivity = new Date();
        await session.save();

        // Find related threads
        const suggestedThreads = await findRelatedThreads(message, category);

        // Determine if auth is required
        const requiresAuth = message.toLowerCase().includes('post') || 
                           message.toLowerCase().includes('discuss') ||
                           message.toLowerCase().includes('share');

        res.json({
            response,
            confidence,
            sources,
            suggestedThreads,
            requiresAuth,
            sessionId
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ 
            response: 'An error occurred. Please try again.',
            error: error.message 
        });
    }
});

// ==================== HELPER FUNCTIONS ====================

function buildSystemPrompt(category, province, language) {
    const provinceInfo = CANADIAN_AUTO_KB.provinces[province] || {};
    
    if (language === 'fr') {
        return `Tu es un assistant expert en automobile pour Autoilty.com, le plus grand forum automobile canadien. 

Contexte: ${provinceInfo.name || 'Canada'}
Catégorie: ${category || 'Discussion générale'}

Tu connais:
- Les réglementations automobiles canadiennes par province
- Les problèmes courants des véhicules au Canada
- L'entretien hivernal et les pneus d'hiver
- Les rappels de Transport Canada
- L'assurance et le financement automobile

Réponds en français, sois concis (max 150 mots), et suggère de consulter le forum pour des discussions détaillées.`;
    }

    return `You are an automotive expert assistant for Autoilty.com, Canada's largest automotive forum.

Context: ${provinceInfo.name || 'Canada'}
Category: ${category || 'General Discussion'}

You know about:
- Canadian automotive regulations by province
- Common vehicle issues in Canadian climate
- Winter maintenance and winter tire requirements
- Transport Canada recalls
- Insurance and financing

Respond in English, be concise (max 150 words), and suggest checking the forum for detailed discussions.`;
}

function checkLocalKnowledgeBase(message, province, language) {
    const lowerMessage = message.toLowerCase();
    
    // Check common issues
    for (const [key, issue] of Object.entries(CANADIAN_AUTO_KB.commonIssues)) {
        if (issue.keywords.some(keyword => lowerMessage.includes(keyword))) {
            return {
                response: language === 'fr' ? issue.response_fr : issue.response_en,
                confidence: 0.95,
                sources: ['Autoilty Knowledge Base', 'Canadian Auto Regulations']
            };
        }
    }

    // Check province-specific info
    if (province && CANADIAN_AUTO_KB.provinces[province]) {
        const provInfo = CANADIAN_AUTO_KB.provinces[province];
        
        if (lowerMessage.includes('emission') || lowerMessage.includes('test')) {
            return {
                response: `${provInfo.name}: ${provInfo.emissions}`,
                confidence: 1.0,
                sources: ['Provincial Regulations']
            };
        }
        
        if (lowerMessage.includes('winter tire') || lowerMessage.includes('snow tire')) {
            return {
                response: `${provInfo.name}: ${provInfo.winterTires}\n\n${CANADIAN_AUTO_KB.commonIssues['winter tires'][language === 'fr' ? 'response_fr' : 'response_en']}`,
                confidence: 1.0,
                sources: ['Provincial Law', 'Autoilty KB']
            };
        }
    }

    return null;
}

async function findRelatedThreads(message, category) {
    try {
        // Simple keyword matching (can be enhanced with vector search)
        const keywords = message.toLowerCase().split(' ').filter(w => w.length > 3);
        
        const threads = await Thread.find({
            category: category,
            $or: [
                { title: { $regex: keywords.join('|'), $options: 'i' } },
                { tags: { $in: keywords } }
            ]
        })
        .limit(3)
        .sort({ lastActivity: -1 })
        .select('_id title replies');

        return threads.map(t => ({
            id: t._id,
            title: t.title,
            replies: t.replies.length
        }));
    } catch (error) {
        console.error('Error finding threads:', error);
        return [];
    }
}

// ==================== SERVER START ====================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`
    ✅ Autoilty Backend Server Running
    🌐 Port: ${PORT}
    🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}
    🤖 AI: ${process.env.OPENAI_API_KEY ? 'Enabled' : 'Local KB Only'}
    `);
});

// Error handling
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

module.exports = { app, server };

