# Autoilty Marketplace - Full-Stack Application

A complete marketplace application for automotive detailing supplies built with React, Node.js/Express, and Supabase.

## Features

- **User Authentication**: Sign up/login with email/password (bcrypt hashing)
- **Vendor Dashboard**: Upload products with images, descriptions, prices, and categories
- **Buyer Marketplace**: Searchable product grid with filters (category, price)
- **Shopping Cart**: Persistent cart using localStorage
- **Stripe Integration**: Secure payment processing
- **Admin Panel**: Moderate product listings (approve/reject)
- **Responsive Design**: Mobile-friendly with Tailwind CSS

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Stripe React SDK
- Supabase JS Client
- Axios

### Backend
- Node.js
- Express.js
- Stripe API
- Supabase (PostgreSQL)

### Database
- Supabase (PostgreSQL with Row Level Security)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Stripe account

### 1. Clone and Install Dependencies

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

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Go to Settings > API and copy your:
   - Project URL
   - Anon/public key

### 3. Set Up Stripe

1. Create an account at [stripe.com](https://stripe.com)
2. Get your API keys from the Dashboard:
   - Publishable key (for frontend)
   - Secret key (for backend)

### 4. Configure Environment Variables

Create `.env` file in the root directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
PORT=5000
NODE_ENV=development
```

Create `.env` file in `client` directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 5. Run the Application

**Development mode (runs both frontend and backend):**
```bash
npm run dev
```

**Or run separately:**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 6. Create Admin User

After registering your first account, update the user role in Supabase:

1. Go to Supabase Dashboard > Table Editor > users
2. Find your user record
3. Change `role` from `buyer` to `admin`

## Project Structure

```
autoilty/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React contexts (Auth, Cart)
│   │   ├── pages/          # Page components
│   │   └── App.js          # Main app component
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Express backend
│   └── index.js           # API routes
├── supabase/
│   └── schema.sql         # Database schema
├── package.json           # Root package.json
└── README.md
```

## API Endpoints

### Backend API (Express)

- `GET /api/health` - Health check
- `POST /api/create-payment-intent` - Create Stripe payment intent

### Supabase Tables

- `users` - User profiles with roles
- `products` - Product listings
- `orders` - Order records
- `order_items` - Order line items

## User Roles

- **Buyer**: Browse and purchase products
- **Vendor**: Upload and manage products (requires approval)
- **Admin**: Moderate all products and manage users

## Features in Detail

### Authentication
- Email/password registration and login
- Role-based access control
- Protected routes
- Session management with Supabase Auth

### Vendor Dashboard
- Upload products with multiple images
- Set title, description, price, category
- View product status (pending/approved/rejected)
- Delete products

### Marketplace
- Search products by keyword
- Filter by category
- Filter by price range
- Product detail pages
- Add to cart functionality

### Shopping Cart
- Persistent cart (localStorage)
- Update quantities
- Remove items
- Calculate totals

### Checkout
- Shipping information form
- Stripe payment integration
- Secure card processing
- Order confirmation

### Admin Panel
- View all products
- Filter by status (pending/approved/rejected)
- Approve or reject products
- Delete products

## Deployment

### Frontend (Netlify/Vercel)

1. Build the React app:
```bash
cd client
npm run build
```

2. Deploy the `client/build` folder to Netlify or Vercel

3. Add environment variables in your hosting platform

### Backend (Heroku/Railway/Render)

1. Set environment variables
2. Deploy the `server` folder
3. Ensure PORT is set correctly

### Database

Supabase handles database hosting automatically.

## Security Notes

- Passwords are hashed using bcrypt (handled by Supabase Auth)
- Row Level Security (RLS) policies protect data
- API keys should never be exposed in client-side code
- Use environment variables for all secrets

## Customization

### Adding Product Categories

1. Update the `category` CHECK constraint in `supabase/schema.sql`
2. Update category options in:
   - `client/src/pages/Marketplace.js`
   - `client/src/pages/VendorDashboard.js`

### Styling

- Modify `client/tailwind.config.js` for theme colors
- Update `client/src/index.css` for global styles

## Troubleshooting

### Common Issues

1. **Supabase connection errors**: Check your environment variables
2. **Stripe errors**: Verify your API keys are correct
3. **CORS errors**: Ensure backend CORS is configured correctly
4. **RLS policy errors**: Check user roles and policies in Supabase

## License

ISC

## Support

For issues or questions, please check the documentation or create an issue in the repository.

