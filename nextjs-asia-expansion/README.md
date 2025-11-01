# Autoilty.com - Next.js Multi-Country Expansion

Autoilty.com is expanding from a Canadian auto forum to a multi-country automotive marketplace and community platform, covering Canada, Singapore, Malaysia, Indonesia, and Thailand.

## 🚀 Features

- ✅ **Multi-Country Support**: CA, SG, MY, ID, TH
- ✅ **Internationalization**: English, Bahasa Melayu, Bahasa Indonesia
- ✅ **Server-Side Rendering**: Next.js 15 with App Router
- ✅ **SEO Optimized**: Dynamic meta tags, OpenGraph, Schema markup, Hreflang
- ✅ **Performance**: Image optimization, lazy loading, caching
- ✅ **Authentication**: NextAuth.js integration
- ✅ **Database**: Supabase PostgreSQL backend
- ✅ **Responsive Design**: Mobile-first, Tailwind CSS
- ✅ **Testing**: Jest + React Testing Library
- ✅ **Deployment**: Vercel-ready configuration

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Vercel account (for deployment)

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Database Setup

Run the SQL schema from `lib/supabase/client.ts` in your Supabase SQL Editor.

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 🧪 Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# CI mode
npm run test:ci
```

### Test Files

- `components/__tests__/SearchFilters.test.tsx` - Search filters functionality
- `components/__tests__/i18n.test.tsx` - Internationalization
- `components/__tests__/responsive.test.tsx` - Responsive breakpoints

## 🚢 Deployment

### Vercel Deployment

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add environment variables
   - Deploy

3. **Preview Deploys:**
   - Each PR gets a preview URL
   - Test on: `https://autoilty-asia-{hash}.vercel.app`

### Environment Variables in Vercel

Add all variables from `.env.local` to Vercel dashboard:
- Settings → Environment Variables
- Add for Production, Preview, and Development

## 📊 Performance & SEO

### Lighthouse Audit

```bash
npm run lighthouse
```

**Target Scores:**
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90

### SEO Features

- Dynamic meta tags per country
- OpenGraph and Twitter Cards
- JSON-LD schema markup
- Hreflang tags for multi-country
- Dynamic sitemap generation
- Optimized images with Next.js Image

## 🔬 A/B Testing

A/B test framework is set up to compare SG vs CA homepage:

```typescript
import { ABTestWrapper } from '@/components/ABTestWrapper';

// Use in homepage
<ABTestWrapper defaultCountry="SG" />
```

Track events:
```typescript
import { trackABTestEvent } from '@/lib/ab-test';

trackABTestEvent('homepage-variant', 'SG', 'conversion', { value: 100 });
```

## 📁 Project Structure

```
nextjs-asia-expansion/
├── app/                    # Next.js App Router
│   ├── [country]/         # Dynamic country routes
│   ├── api/               # API routes
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Robots.txt
├── components/            # React components
│   ├── seo/              # SEO components
│   ├── ui/               # UI components
│   └── __tests__/        # Component tests
├── lib/                  # Utilities
│   ├── seo/             # SEO utilities
│   ├── supabase/        # Supabase client
│   └── i18n/            # i18n configuration
├── types/                # TypeScript types
└── public/              # Static assets
```

## 🌍 Country Routes

- `/ca` - Canada (English)
- `/sg` - Singapore (English)
- `/my` - Malaysia (Bahasa Melayu)
- `/id` - Indonesia (Bahasa Indonesia)
- `/th` - Thailand (Thai)

## 🔑 Key Features

### Search & Listings
- Advanced filtering by make, model, year, price, etc.
- Country-specific popular brands
- Lazy-loaded listings for performance
- Schema markup for SEO

### Forums
- Country-specific forums
- Threaded discussions
- User authentication
- Integration with listings

### SEO Optimization
- Dynamic meta tags
- OpenGraph tags
- Schema.org markup
- Hreflang alternates
- Optimized sitemap

### Performance
- Next.js Image optimization
- Lazy loading
- Server-side caching
- Code splitting

## 📚 Documentation

- [Migration Guide](./MIGRATION_GUIDE.md) - Migrate from current CA site
- [SEO Guide](./lib/seo/README.md) - SEO implementation details
- [Supabase Setup](./SUPABASE_SETUP.md) - Database configuration

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Write tests
4. Run tests: `npm run test`
5. Submit PR

## 📝 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Lint code
npm run test         # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
npm run lighthouse   # Lighthouse audit
```

## 🐛 Troubleshooting

### Images not loading
- Check image paths in `public/` folder
- Use Next.js Image component
- Verify Next.js config image domains

### API routes not working
- Check environment variables
- Verify Supabase connection
- Check Vercel function logs

### i18n not working
- Clear browser cache
- Check i18n configuration
- Verify translation files

## 📄 License

Private - Autoilty.com

## 🔗 Links

- **Production**: https://autoilty.com
- **Staging**: https://autoilty-asia.vercel.app
- **Supabase**: https://supabase.com/dashboard
- **Vercel**: https://vercel.com/dashboard

## 📞 Support

For issues or questions, check:
1. Documentation in project
2. Component README files
3. Supabase logs
4. Vercel deployment logs

---

Built with ❤️ using Next.js 15, TypeScript, Tailwind CSS, and Supabase.
