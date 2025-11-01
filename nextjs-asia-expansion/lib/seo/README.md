# SEO Implementation Guide

This directory contains all SEO utilities and components for Autoilty.com, optimized for global/Asia markets inspired by Cars.com and Carsome.

## Features

✅ Dynamic meta tags with localized keywords  
✅ OpenGraph and Twitter Card support  
✅ JSON-LD structured data (Schema.org)  
✅ Hreflang tags for multi-country SEO  
✅ Dynamic sitemap generation  
✅ Image optimization with Next.js Image  
✅ Lazy loading for performance  

## Usage

### 1. Page Metadata

```typescript
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateMetaDescription } from '@/lib/seo/keywords';

export const metadata = generatePageMetadata({
  title: 'Auto Directory Singapore | Autoilty',
  description: generateMetaDescription('SG', 'home'),
  country: 'SG',
  keywords: ['used cars singapore', 'car listings singapore'],
});
```

### 2. Schema Markup

```typescript
import { WebsiteSchema, OrganizationSchema } from '@/components/seo/SchemaMarkup';

export default function Page() {
  return (
    <>
      <WebsiteSchema country="SG" />
      <OrganizationSchema />
    </>
  );
}
```

### 3. Hreflang Tags

```typescript
import { HreflangTags } from '@/components/seo/HreflangTags';

<HreflangTags 
  path="/listings" 
  supportedCountries={['CA', 'SG', 'MY', 'ID', 'TH']} 
/>
```

### 4. Lazy Loading

```typescript
import { LazyImage } from '@/components/ui/LazyImage';
import { LazyListingItem } from '@/components/ui/LazyListings';

// For images
<LazyImage 
  src="/car.jpg" 
  alt="Car" 
  fill 
  sizes="(max-width: 768px) 100vw, 50vw" 
/>

// For listings
<LazyListingItem index={0}>
  <DirectoryListing listing={listing} />
</LazyListingItem>
```

## Files Structure

```
lib/seo/
├── types.ts          # TypeScript interfaces
├── keywords.ts       # Localized keyword generation
├── metadata.ts       # Metadata generation utilities
└── README.md         # This file

components/seo/
├── SchemaMarkup.tsx  # JSON-LD schema components
└── HreflangTags.tsx  # Hreflang alternates

components/ui/
├── LazyImage.tsx     # Optimized lazy-loading images
└── LazyListings.tsx  # Lazy-loading listings grid
```

## SEO Best Practices

1. **Keywords**: Use localized keywords from `keywords.ts`
2. **Meta Descriptions**: Keep under 160 characters, include country name
3. **Titles**: Format as "Page Title | Autoilty [Country]"
4. **Images**: Always use `LazyImage` component with proper alt text
5. **Schema**: Add appropriate schema markup for each page type
6. **Hreflang**: Always include for multi-country pages

## Performance

- Images are automatically optimized with Next.js Image
- Lazy loading reduces initial bundle size
- Schema markup is server-rendered
- Meta tags are generated at build time

## Testing

Use these tools to verify SEO:
- Google Search Console
- Google Rich Results Test
- Facebook Sharing Debugger
- Twitter Card Validator
- Lighthouse SEO audit

