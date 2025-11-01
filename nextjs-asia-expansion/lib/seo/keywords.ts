/**
 * SEO Keywords Generator
 * Localized keywords inspired by Carsome and Cars.com
 */

import { CountryCode, countries } from '@/lib/countries';

export interface CountryKeywords {
  primary: string[];
  secondary: string[];
  longTail: string[];
}

const keywordMap: Record<CountryCode, CountryKeywords> = {
  CA: {
    primary: [
      'used cars canada',
      'car listings canada',
      'buy car online canada',
      'used vehicles canada',
      'auto directory canada',
    ],
    secondary: [
      'toronto cars',
      'vancouver cars',
      'montreal cars',
      'used car dealers canada',
      'private car sales canada',
      'car buying guide canada',
    ],
    longTail: [
      'best used cars under 20000 canada',
      'reliable used cars canada',
      'winter driving cars canada',
      'electric vehicles canada',
      'certified pre owned canada',
    ],
  },
  SG: {
    primary: [
      'used cars singapore',
      'car listings singapore',
      'buy car singapore',
      'car directory singapore',
      'sg car marketplace',
    ],
    secondary: [
      'COE cars singapore',
      'parallel import singapore',
      'used car dealers singapore',
      'car loans singapore',
      'second hand cars singapore',
      'car inspection singapore',
    ],
    longTail: [
      'best cars for singapore roads',
      'LTA approved cars',
      'fuel efficient cars singapore',
      'COE renewal singapore',
      'car financing singapore',
      'singapore car auctions',
    ],
  },
  MY: {
    primary: [
      'kereta terpakai malaysia',
      'jual beli kereta malaysia',
      'kereta second hand malaysia',
      'kereta murah malaysia',
      'used cars malaysia',
    ],
    secondary: [
      'kereta kuala lumpur',
      'kereta selangor',
      'kereta penang',
      'kereta johor',
      'kereta proton',
      'kereta perodua',
    ],
    longTail: [
      'kereta terpakai bawah rm30000',
      'kereta fuel efficient malaysia',
      'kereta flood free malaysia',
      'kereta AP malaysia',
      'kereta loan approval malaysia',
      'best kereta untuk keluarga malaysia',
    ],
  },
  ID: {
    primary: [
      'mobil bekas indonesia',
      'jual beli mobil indonesia',
      'mobil second indonesia',
      'mobil murah indonesia',
      'used cars indonesia',
    ],
    secondary: [
      'mobil jakarta',
      'mobil surabaya',
      'mobil bandung',
      'mobil medan',
      'LCGC indonesia',
      'mobil toyota indonesia',
    ],
    longTail: [
      'mobil bekas dibawah 200 juta',
      'mobil flood proof indonesia',
      'mobil irit bbm indonesia',
      'mobil keluarga indonesia',
      'mobil kredit indonesia',
      'mobil terlaris indonesia',
    ],
  },
  TH: {
    primary: [
      'รถยนต์มือสอง ประเทศไทย',
      'ขายรถยนต์ ประเทศไทย',
      'รถใช้แล้ว ประเทศไทย',
      'used cars thailand',
      'car listings thailand',
    ],
    secondary: [
      'รถกรุงเทพ',
      'รถเชียงใหม่',
      'รถปิคอัพ ประเทศไทย',
      'รถยนต์ไฟฟ้า ประเทศไทย',
      'รถ toyota ประเทศไทย',
      'รถ honda ประเทศไทย',
    ],
    longTail: [
      'รถมือสองราคาไม่เกิน 500000',
      'รถประหยัดน้ำมัน ประเทศไทย',
      'รถสำหรับครอบครัว ประเทศไทย',
      'รถผ่อนชำระ ประเทศไทย',
      'รถขายดี ประเทศไทย',
    ],
  },
};

/**
 * Get localized keywords for a country
 */
export function getCountryKeywords(country: CountryCode): CountryKeywords {
  return keywordMap[country] || keywordMap.CA;
}

/**
 * Generate keywords for a specific page
 */
export function generatePageKeywords(
  country: CountryCode,
  category?: string,
  make?: string,
  model?: string
): string[] {
  const countryKeywords = getCountryKeywords(country);
  const keywords: string[] = [...countryKeywords.primary];

  if (category) {
    const countryName = countries[country].name;
    keywords.push(`${category} ${countryName.toLowerCase()}`);
    keywords.push(`${category} ${country.toLowerCase()}`);
  }

  if (make) {
    keywords.push(`${make} ${country.toLowerCase()}`);
    keywords.push(`used ${make} ${country.toLowerCase()}`);
  }

  if (make && model) {
    keywords.push(`${make} ${model} ${country.toLowerCase()}`);
    keywords.push(`used ${make} ${model} ${country.toLowerCase()}`);
  }

  return [...new Set(keywords)]; // Remove duplicates
}

/**
 * Generate meta description with keywords
 */
export function generateMetaDescription(
  country: CountryCode,
  type: 'home' | 'listing' | 'category' | 'brand',
  additionalInfo?: {
    category?: string;
    make?: string;
    model?: string;
    location?: string;
    price?: string;
  }
): string {
  const countryName = countries[country].name;
  const countryCode = country;

  switch (type) {
    case 'home':
      return `Search thousands of verified car listings in ${countryName}. Find used cars, SUVs, and vehicles from trusted dealers and private sellers. Compare prices, read reviews, and connect with sellers.`;
    
    case 'listing':
      if (additionalInfo?.make && additionalInfo?.model && additionalInfo?.year) {
        return `Buy ${additionalInfo.year} ${additionalInfo.make} ${additionalInfo.model} in ${additionalInfo.location || countryName}. Price: ${additionalInfo.price || 'Contact for price'}. View full details, photos, and contact seller on Autoilty.`;
      }
      return `View car listing details, specifications, photos, and seller information. Connect with verified sellers in ${countryName}.`;
    
    case 'category':
      const categoryName = additionalInfo?.category || 'vehicles';
      return `Browse ${categoryName} listings in ${countryName}. Find the best deals on ${categoryName} from verified dealers and private sellers. Compare prices and connect directly with sellers.`;
    
    case 'brand':
      const brandName = additionalInfo?.make || 'vehicles';
      return `Explore ${brandName} car listings in ${countryName}. Find new and used ${brandName} vehicles, compare prices, read reviews, and connect with sellers.`;
    
    default:
      return `Find your perfect car in ${countryName} on Autoilty. Search thousands of verified listings.`;
  }
}

