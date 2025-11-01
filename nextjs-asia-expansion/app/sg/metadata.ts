/**
 * Singapore Page SEO Metadata
 */

import { Metadata } from 'next';
import { generatePageMetadata, generateCountryTitle } from '@/lib/seo/metadata';
import { generateMetaDescription } from '@/lib/seo/keywords';

export const metadata: Metadata = generatePageMetadata({
  title: generateCountryTitle('SG', 'Auto Directory'),
  description: generateMetaDescription('SG', 'home'),
  country: 'SG',
  keywords: ['used cars singapore', 'car listings singapore', 'buy car singapore', 'COE cars singapore', 'second hand cars singapore'],
  image: '/og-image-singapore.jpg',
});

