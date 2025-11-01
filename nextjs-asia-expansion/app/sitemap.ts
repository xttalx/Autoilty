/**
 * Dynamic Sitemap Generator
 * Generates XML sitemap for all countries and pages
 */

import { MetadataRoute } from 'next';
import { CountryCode, countries } from '@/lib/countries';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://autoilty.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const supportedCountries: CountryCode[] = ['CA', 'SG', 'MY', 'ID', 'TH'];
  const routes: MetadataRoute.Sitemap = [];

  // Add homepage for each country
  supportedCountries.forEach((country) => {
    const countryConfig = countries[country];
    routes.push({
      url: `${BASE_URL}/${country.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          supportedCountries.map((c) => {
            const config = countries[c];
            return [config.locale, `${BASE_URL}/${c.toLowerCase()}`];
          })
        ),
      },
    });

    // Add listing pages
    routes.push({
      url: `${BASE_URL}/${country.toLowerCase()}/listings`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    });

    // Add forum pages
    routes.push({
      url: `${BASE_URL}/${country.toLowerCase()}/forums`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    });

    // Add guides pages
    routes.push({
      url: `${BASE_URL}/${country.toLowerCase()}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });

    // Add category pages
    const categories = ['cars', 'suvs', 'electric', 'luxury', 'trucks', 'mpv'];
    categories.forEach((category) => {
      routes.push({
        url: `${BASE_URL}/${country.toLowerCase()}/category/${category}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });
    });
  });

  // Add static pages
  const staticPages = [
    { path: '/about', priority: 0.6 },
    { path: '/contact', priority: 0.5 },
    { path: '/privacy', priority: 0.3 },
    { path: '/terms', priority: 0.3 },
  ];

  staticPages.forEach((page) => {
    routes.push({
      url: `${BASE_URL}${page.path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: page.priority,
    });
  });

  return routes;
}

