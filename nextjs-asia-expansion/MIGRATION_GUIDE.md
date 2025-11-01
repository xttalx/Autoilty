# Migration Guide: From Current CA Site to Next.js Framework

This guide will help you migrate from the current Autoilty.com Canadian site (HTML/CSS/JS) to the new Next.js 15 framework with multi-country support.

## Overview

The new framework provides:
- ✅ Multi-country support (CA, SG, MY, ID, TH)
- ✅ Server-side rendering (SSR) and static generation (SSG)
- ✅ Internationalization (i18n) for multiple languages
- ✅ Modern React components with TypeScript
- ✅ Optimized SEO and performance
- ✅ Scalable API routes
- ✅ Integrated authentication

## Pre-Migration Checklist

- [ ] Backup current site files
- [ ] Review current functionality and features
- [ ] Document custom JavaScript functionality
- [ ] Export any existing data (listings, users, etc.)
- [ ] Set up Supabase database schema
- [ ] Configure environment variables

## Step 1: Environment Setup

### 1.1 Install Dependencies

```bash
cd nextjs-asia-expansion
npm install
```

### 1.2 Configure Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://riimwxyjsqatyvttdajp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:[password]@db.riimwxyjsqatyvttdajp.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# App
NEXT_PUBLIC_BASE_URL=https://autoilty.com
```

### 1.3 Set Up Supabase Database

Run the SQL schema from `lib/supabase/client.ts` in Supabase SQL Editor:

```sql
-- Create listings table
-- Create forum_threads table
-- Create forum_posts table
-- Create forum_users table
-- (See lib/supabase/client.ts for full schema)
```

## Step 2: Data Migration

### 2.1 Export Current Listings

If you have listings in the current site, export them to CSV/JSON:

```javascript
// Example: Export from current site
const listings = [
  {
    title: "2020 Honda Civic",
    make: "Honda",
    model: "Civic",
    year: 2020,
    price: 25000,
    // ... other fields
  }
];

// Save to listings-export.json
```

### 2.2 Import to Supabase

Use Supabase Dashboard or API to import listings:

```typescript
// scripts/import-listings.ts
import { supabaseAdmin } from '@/lib/supabase/client';
import listings from './listings-export.json';

async function importListings() {
  for (const listing of listings) {
    await supabaseAdmin.from('listings').insert({
      title: listing.title,
      make: listing.make,
      model: listing.model,
      year: listing.year,
      price: listing.price,
      country: 'CA', // Default to Canada
      currency: 'CAD',
      // ... map other fields
    });
  }
}
```

### 2.3 Migrate User Accounts

If you have user accounts:
1. Export user data
2. Import into Supabase Auth
3. Link to forum_users table

## Step 3: Content Migration

### 3.1 Static Pages

Current pages to migrate:
- `about.html` → `app/about/page.tsx`
- `contact.html` → `app/contact/page.tsx`
- `privacy.html` → `app/privacy/page.tsx`
- `terms.html` → `app/terms/page.tsx`

Example migration:

```tsx
// app/about/page.tsx
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata = generatePageMetadata({
  title: 'About Us | Autoilty',
  description: 'Learn about Autoilty...',
  country: 'CA',
});

export default function AboutPage() {
  return (
    <div>
      {/* Copy content from about.html */}
    </div>
  );
}
```

### 3.2 Guides

- `guides/buying-guide.html` → `app/[country]/guides/buying/page.tsx`
- `guides/winter-driving.html` → `app/[country]/guides/winter-driving/page.tsx`

### 3.3 Regional Pages

- `regions/ontario.html` → `app/ca/regions/ontario/page.tsx`
- `regions/quebec.html` → `app/ca/regions/quebec/page.tsx`

## Step 4: Feature Migration

### 4.1 Search Functionality

**Current:** JavaScript-based search in `js/main.js`

**New:** API route at `/api/listings/[country]/route.ts`

The new implementation uses:
- Server-side filtering
- Database queries (Supabase)
- Caching for performance

### 4.2 Forum Functionality

**Current:** `js/forum.js` with localStorage

**New:** 
- Supabase backend
- API routes: `/api/forums/[country]/route.ts`
- React components: `components/ForumThread.tsx`

### 4.3 Listing Display

**Current:** Static HTML in `listing.html`

**New:** Dynamic page at `app/listings/[id]/page.tsx`

Features:
- Server-side rendering
- SEO optimization
- Schema markup
- Lazy loading

## Step 5: URL Structure Changes

### Current URLs → New URLs

| Current | New |
|---------|-----|
| `/index.html` | `/ca` or `/` |
| `/listing.html?id=123` | `/ca/listings/123` |
| `/guides/buying-guide.html` | `/ca/guides/buying` |
| `/regions/ontario.html` | `/ca/regions/ontario` |
| `/thread.html?id=456` | `/ca/forums/456` |

### Redirects Setup

Add redirects in `next.config.js`:

```javascript
async redirects() {
  return [
    {
      source: '/listing.html',
      has: [
        {
          type: 'query',
          key: 'id',
        },
      ],
      destination: '/ca/listings/:id',
      permanent: true,
    },
    {
      source: '/thread.html',
      has: [
        {
          type: 'query',
          key: 'id',
        },
      ],
      destination: '/ca/forums/:id',
      permanent: true,
    },
  ];
}
```

## Step 6: Testing

### 6.1 Run Tests

```bash
npm run test
npm run test:coverage
```

### 6.2 Test Locally

```bash
npm run dev
```

Visit:
- http://localhost:3000/ca (Canada)
- http://localhost:3000/sg (Singapore)
- http://localhost:3000/my (Malaysia)

### 6.3 Lighthouse Audit

```bash
npm run lighthouse
```

Target: Mobile score >90

## Step 7: Deployment

### 7.1 Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### 7.2 Environment Variables in Vercel

Add all variables from `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- etc.

### 7.3 Custom Domain

1. Add domain in Vercel dashboard
2. Update DNS records
3. SSL certificate will be auto-generated

## Step 8: Post-Migration

### 8.1 Verify Functionality

- [ ] Homepage loads correctly
- [ ] Search works
- [ ] Listings display properly
- [ ] Forum posts work
- [ ] Authentication works
- [ ] Forms submit correctly
- [ ] Images load
- [ ] Mobile responsive

### 8.2 SEO Verification

- [ ] Submit sitemap to Google Search Console
- [ ] Verify meta tags
- [ ] Check structured data
- [ ] Test hreflang tags

### 8.3 Monitor Performance

- [ ] Check Lighthouse scores
- [ ] Monitor Core Web Vitals
- [ ] Set up error tracking (Sentry)
- [ ] Set up analytics (Google Analytics)

## Step 9: Rollback Plan

If issues occur:

1. **Quick Rollback:**
   - Revert DNS to old hosting
   - Keep new site running on staging domain

2. **Data Backup:**
   - Export new Supabase data
   - Keep old site data as backup

3. **Testing:**
   - Use Vercel preview deployments
   - Test on staging before production

## Common Issues & Solutions

### Issue: Images not loading

**Solution:** 
- Check image paths
- Ensure images are in `public/` folder
- Use Next.js Image component

### Issue: API routes not working

**Solution:**
- Check environment variables
- Verify Supabase connection
- Check API route logs in Vercel

### Issue: Styling looks different

**Solution:**
- Review Tailwind classes
- Check responsive breakpoints
- Verify CSS imports

### Issue: i18n not working

**Solution:**
- Check i18n configuration
- Verify translation files
- Clear browser cache

## Support

For issues or questions:
- Check `README.md` in project root
- Review component documentation
- Check Supabase logs
- Review Vercel deployment logs

## Timeline Estimate

- **Environment Setup:** 1-2 hours
- **Data Migration:** 2-4 hours
- **Content Migration:** 4-8 hours
- **Testing:** 2-4 hours
- **Deployment:** 1-2 hours
- **Total:** 10-20 hours

## Next Steps After Migration

1. Set up monitoring and alerts
2. Configure CDN for images
3. Set up CI/CD pipeline
4. Plan A/B tests for optimization
5. Expand to additional countries
6. Add new features incrementally

