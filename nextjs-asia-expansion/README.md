# Autoilty Asia Expansion - Next.js 15

Full-stack Next.js 15 application for expanding Autoilty.com to Asian markets (Singapore, Malaysia, Indonesia, Thailand).

## Features

- ✅ Next.js 15 with App Router
- ✅ Multi-language support (English, Bahasa Melayu, Bahasa Indonesia)
- ✅ Multi-country support (CA, SG, MY, ID, TH)
- ✅ Server-side geo-IP detection
- ✅ Mobile-first responsive design
- ✅ Tailwind CSS styling
- ✅ TypeScript

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
nextjs-asia-expansion/
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx         # Root layout with geo-detection
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   └── Navbar.tsx        # Responsive navigation
├── lib/                  # Utilities
│   ├── countries.ts      # Country configurations
│   ├── geo-detection.ts  # Geo-IP detection
│   └── i18n/            # Internationalization
│       ├── config.ts     # i18next setup
│       └── locales/      # Translation files
│           ├── en.json
│           ├── ms.json
│           └── id.json
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Country Configurations

Each country includes:
- Currency & symbol
- Categories (localized)
- Popular brands/models
- Search placeholders
- Listing features

## Geo-IP Detection

Server-side detection using:
1. User cookie preference (highest priority)
2. IP address lookup (via geoip-lite)
3. Accept-Language header (fallback)
4. Default to Canada

## Mobile-First Design

All components are built mobile-first with:
- Responsive breakpoints (sm, md, lg, xl)
- Touch-friendly navigation
- Mobile menu toggle
- Optimized layouts for all screen sizes

## License

MIT

