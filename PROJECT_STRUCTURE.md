# Project Structure

## Directory Tree

```
autoilty/
├── client/                          # React Frontend Application
│   ├── public/
│   │   └── index.html              # HTML template
│   ├── src/
│   │   ├── components/             # Reusable React components
│   │   │   ├── Navbar.js           # Navigation bar with cart icon
│   │   │   ├── Footer.js           # Footer component
│   │   │   └── ProtectedRoute.js   # Route protection wrapper
│   │   ├── context/                # React Context providers
│   │   │   ├── AuthContext.js      # Authentication state management
│   │   │   └── CartContext.js      # Shopping cart state (localStorage)
│   │   ├── pages/                  # Page components
│   │   │   ├── Home.js             # Homepage (integrated with existing design)
│   │   │   ├── Marketplace.js      # Product listing with filters
│   │   │   ├── ProductDetail.js    # Individual product page
│   │   │   ├── Login.js            # Login page
│   │   │   ├── Register.js        # Registration page
│   │   │   ├── Cart.js             # Shopping cart
│   │   │   ├── Checkout.js         # Stripe checkout page
│   │   │   ├── VendorDashboard.js  # Vendor product management
│   │   │   └── AdminPanel.js       # Admin moderation panel
│   │   ├── App.js                  # Main app component with routes
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Global styles + Tailwind imports
│   ├── package.json                # Frontend dependencies
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   └── postcss.config.js           # PostCSS configuration
│
├── server/                          # Express Backend API
│   └── index.js                    # API routes and Stripe integration
│
├── supabase/                        # Database schema
│   └── schema.sql                  # PostgreSQL schema with RLS policies
│
├── package.json                    # Root package.json (dev scripts)
├── .gitignore                      # Git ignore rules
├── README.md                       # Main documentation
├── SETUP.md                        # Quick setup guide
├── DEPLOYMENT.md                   # Deployment instructions
└── PROJECT_STRUCTURE.md            # This file
```

## Key Files Explained

### Frontend (React)

**App.js**: Main application component that sets up routing and context providers.

**AuthContext.js**: Manages user authentication state using Supabase Auth. Handles login, register, logout, and user profile.

**CartContext.js**: Manages shopping cart state with localStorage persistence. Provides add, remove, update quantity functions.

**Pages**:
- `Home.js`: Preserves existing homepage design, adds link to marketplace
- `Marketplace.js`: Product grid with search, category filter, price filter
- `ProductDetail.js`: Full product details with image gallery
- `VendorDashboard.js`: Product CRUD for vendors
- `AdminPanel.js`: Product moderation interface
- `Checkout.js`: Stripe payment integration

### Backend (Express)

**server/index.js**: 
- Express server setup
- CORS configuration
- Stripe payment intent creation endpoint
- Health check endpoint

### Database (Supabase)

**schema.sql**:
- Users table (extends Supabase auth)
- Products table with vendor relationship
- Orders and order_items tables
- Row Level Security (RLS) policies
- Indexes for performance
- Triggers for updated_at timestamps

## Data Flow

1. **Authentication**: Supabase Auth handles user signup/login, backend validates tokens
2. **Products**: Vendors create products → Admin approves → Buyers see approved products
3. **Cart**: Stored in localStorage, synced on page load
4. **Checkout**: Frontend creates payment intent → Stripe processes → Order saved to database

## Security Features

- Row Level Security (RLS) on all tables
- Role-based access control (buyer/vendor/admin)
- Protected routes in React
- Environment variables for secrets
- CORS configuration
- Password hashing via Supabase Auth

## Future Enhancements

- Image upload to Supabase Storage or AWS S3
- Order history page
- Email notifications
- Product reviews/ratings
- Vendor analytics dashboard
- Search with full-text search
- Product recommendations
- Wishlist functionality

