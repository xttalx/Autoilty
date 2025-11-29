# Autoilty Marketplace - Complete Setup Guide

This guide will help you set up the complete Marketplace feature with user authentication and postings management.

## 🎯 Features

- ✅ **User Authentication**: Secure login/register system with password hashing
- ✅ **Protected Routes**: Marketplace requires login to access
- ✅ **Postings Management**: Create, read, update, and delete postings
- ✅ **Category Filtering**: Filter by Cars, Parts, Services, or Other
- ✅ **Search Functionality**: Search postings by title or description
- ✅ **Image Upload**: Upload images for postings (optional)
- ✅ **Responsive Design**: Works on mobile and desktop
- ✅ **User Dashboard**: Manage your own postings in one place

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser

## 🚀 Installation Steps

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages:
- `express` - Web server framework
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `sqlite3` - Database
- `cors` - CORS middleware
- `multer` - File upload handling

### Step 2: Start the Backend Server

```bash
npm start
```

Or for development:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

**Important**: Keep this terminal window open while using the application.

### Step 3: Start the Frontend Server (in a new terminal)

```bash
npm run frontend
```

The frontend will be available at `http://localhost:3000`

### Step 4: Seed the Database (Optional)

To populate the database with sample data:

```bash
npm run seed
```

This creates:
- 3 sample users (demo_user, johndoe, janedoe)
- 8 sample postings

**Default password for all sample users**: `password123`

## 📁 Project Structure

```
autoilty/
├── server.js              # Backend Express server
├── auth.js                # Frontend authentication helpers
├── marketplace-api.js     # Marketplace API integration
├── database.sqlite        # SQLite database (created automatically)
├── uploads/               # Image uploads directory (created automatically)
├── login.html             # Login page
├── register.html          # Registration page
├── marketplace.html       # Marketplace page (requires auth)
├── my-postings.html       # User postings management page
├── seed-database.js       # Database seeding script
└── styles.css             # Shared styles
```

## 🔐 Authentication

### Register a New Account

1. Navigate to `http://localhost:3000/register.html`
2. Fill in:
   - Username (minimum 3 characters)
   - Email
   - Password (minimum 6 characters)
   - Confirm password
3. Click "Create Account"
4. You'll be automatically logged in and redirected to the marketplace

### Login

1. Navigate to `http://localhost:3000/login.html`
2. Enter your username/email and password
3. Click "Login"
4. You'll be redirected to the marketplace

### Sample Accounts

After running `npm run seed`, you can use:

- **Username**: `demo_user` | **Password**: `password123`
- **Username**: `johndoe` | **Password**: `password123`
- **Username**: `janedoe` | **Password**: `password123`

## 📝 Using the Marketplace

### Viewing Postings

1. **Login** first (marketplace requires authentication)
2. Browse all postings on the marketplace page
3. Use **filter tabs** to filter by category:
   - All
   - Cars
   - Parts
   - Services
   - Other
4. Use the **search bar** to search by title or description

### Creating a Posting

1. Click **"My Postings"** in the navigation
2. Click **"Create New Posting"**
3. Fill in the form:
   - **Title** (required): e.g., "2020 Honda Civic"
   - **Description** (required): Detailed description
   - **Price** (required): Price in CAD
   - **Category** (required): Select from dropdown
   - **Location** (optional): e.g., "Toronto, ON"
   - **Image** (optional): Upload an image (max 5MB)
4. Click **"Save Posting"**
5. Your posting will appear in the marketplace immediately

### Editing a Posting

1. Go to **"My Postings"**
2. Find the posting you want to edit
3. Click **"Edit"**
4. Update any fields
5. Click **"Save Posting"**

### Deleting a Posting

1. Go to **"My Postings"**
2. Find the posting you want to delete
3. Click **"Delete"**
4. Confirm the deletion
5. The posting will be permanently removed

## 🔧 Configuration

### Backend Server Port

Default: `5000`

To change, set the `PORT` environment variable:

```bash
PORT=3001 npm start
```

### Frontend Server Port

Default: `3000`

To change, modify the `frontend` script in `package.json`:

```json
"frontend": "npx serve . -l 3001"
```

### JWT Secret Key

Default: `your-secret-key-change-in-production`

**Important**: Change this in production! Set the `JWT_SECRET` environment variable:

```bash
JWT_SECRET=your-super-secret-key npm start
```

### API Base URL

If your backend is on a different URL, update `auth.js` and `marketplace-api.js`:

```javascript
const API_BASE_URL = 'http://your-backend-url:5000/api';
```

## 📊 Database Schema

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| username | TEXT | Unique username |
| email | TEXT | Unique email |
| password_hash | TEXT | Hashed password |
| created_at | DATETIME | Account creation timestamp |

### Postings Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| user_id | INTEGER | Foreign key to users |
| title | TEXT | Posting title |
| description | TEXT | Detailed description |
| price | DECIMAL(10,2) | Price in CAD |
| category | TEXT | Cars, Parts, Services, or Other |
| image_url | TEXT | Path to uploaded image |
| location | TEXT | Location string |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

## 🔒 Security Features

- **Password Hashing**: Passwords are hashed using bcrypt (10 rounds)
- **JWT Tokens**: Secure authentication tokens (7-day expiry)
- **Protected Routes**: API endpoints require authentication
- **Owner Verification**: Users can only edit/delete their own postings
- **File Validation**: Image uploads are validated (type and size)
- **CORS Protection**: Configured for specific origins

## 🐛 Troubleshooting

### Server won't start

- Check if port 5000 is already in use
- Verify Node.js version (should be 18+)
- Run `npm install` again

### Database errors

- Delete `database.sqlite` and restart the server (it will be recreated)
- Check file permissions in the project directory

### Images not uploading

- Check that the `uploads/` directory exists
- Verify file size is under 5MB
- Ensure file is an image (JPEG, PNG, GIF, WebP)

### Authentication not working

- Clear browser localStorage
- Check that backend server is running on port 5000
- Verify JWT_SECRET is set correctly

### Frontend can't connect to backend

- Ensure backend is running on `http://localhost:5000`
- Check CORS settings in `server.js`
- Verify API_BASE_URL in frontend files

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Postings

- `GET /api/postings` - Get all postings (public, paginated)
- `GET /api/postings/:id` - Get single posting (public)
- `GET /api/postings/user/my-postings` - Get user's postings (requires auth)
- `POST /api/postings` - Create posting (requires auth)
- `PUT /api/postings/:id` - Update posting (requires auth, owner only)
- `DELETE /api/postings/:id` - Delete posting (requires auth, owner only)

## 🎨 Customization

### Categories

To add/edit categories, update:
1. Database schema in `server.js` (CREATE TABLE statement)
2. Category dropdown in `my-postings.html`
3. Filter tabs in `marketplace.html`

### Styling

All styles are in `styles.css`. The design uses:
- Color scheme: Black (#000000) and white (#FFFFFF)
- Font: Inter (Google Fonts)
- Responsive breakpoint: 768px

## 📦 Production Deployment

### Environment Variables

Set these in your production environment:

```bash
PORT=5000
JWT_SECRET=your-super-secret-production-key
FRONTEND_URL=https://your-frontend-domain.com
```

### Database Backup

SQLite database can be backed up by copying `database.sqlite`:

```bash
cp database.sqlite database.sqlite.backup
```

### File Uploads

Ensure the `uploads/` directory has proper permissions and is included in your deployment.

## 🆘 Support

If you encounter issues:
1. Check the browser console for errors
2. Check the server terminal for error messages
3. Verify all dependencies are installed
4. Ensure both servers are running

## 📄 License

ISC

