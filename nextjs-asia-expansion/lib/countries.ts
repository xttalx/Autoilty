export type CountryCode = 'CA' | 'SG' | 'MY' | 'ID' | 'TH';

export interface CountryConfig {
  code: CountryCode;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  timezone: string;
  phoneCode: string;
  categories: {
    id: string;
    name: string;
    icon: string;
  }[];
  popularBrands: string[];
  popularModels: string[];
  searchPlaceholder: string;
  listingFeatures: {
    showMileage: boolean;
    showYear: boolean;
    showEngine: boolean;
    showFuelType: boolean;
    showTransmission: boolean;
  };
}

export const countries: Record<CountryCode, CountryConfig> = {
  CA: {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    currencySymbol: 'C$',
    locale: 'en-CA',
    timezone: 'America/Toronto',
    phoneCode: '+1',
    categories: [
      { id: 'cars', name: 'Cars', icon: '🚗' },
      { id: 'suvs', name: 'SUVs', icon: '🚙' },
      { id: 'trucks', name: 'Trucks', icon: '🛻' },
      { id: 'electric', name: 'Electric', icon: '🔌' },
      { id: 'luxury', name: 'Luxury', icon: '💎' },
    ],
    popularBrands: ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan'],
    popularModels: ['Civic', 'Corolla', 'F-150', 'Rogue', 'Camry'],
    searchPlaceholder: 'Search for cars, trucks, SUVs...',
    listingFeatures: {
      showMileage: true,
      showYear: true,
      showEngine: true,
      showFuelType: true,
      showTransmission: true,
    },
  },
  SG: {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    currencySymbol: 'S$',
    locale: 'en-SG',
    timezone: 'Asia/Singapore',
    phoneCode: '+65',
    categories: [
      { id: 'cars', name: 'Cars', icon: '🚗' },
      { id: 'suvs', name: 'SUVs', icon: '🚙' },
      { id: 'mpv', name: 'MPV', icon: '🚐' },
      { id: 'electric', name: 'Electric', icon: '🔌' },
      { id: 'luxury', name: 'Luxury', icon: '💎' },
    ],
    popularBrands: ['Toyota', 'Honda', 'Mercedes-Benz', 'BMW', 'Mazda'],
    popularModels: ['Vios', 'Civic', 'C-Class', '3 Series', 'Mazda3'],
    searchPlaceholder: 'Search for cars in Singapore...',
    listingFeatures: {
      showMileage: true,
      showYear: true,
      showEngine: true,
      showFuelType: true,
      showTransmission: true,
    },
  },
  MY: {
    code: 'MY',
    name: 'Malaysia',
    flag: '🇲🇾',
    currency: 'MYR',
    currencySymbol: 'RM',
    locale: 'ms-MY',
    timezone: 'Asia/Kuala_Lumpur',
    phoneCode: '+60',
    categories: [
      { id: 'cars', name: 'Kereta', icon: '🚗' },
      { id: 'suvs', name: 'SUV', icon: '🚙' },
      { id: 'mpv', name: 'MPV', icon: '🚐' },
      { id: 'pickup', name: 'Pickup', icon: '🛻' },
      { id: 'luxury', name: 'Mewah', icon: '💎' },
    ],
    popularBrands: ['Perodua', 'Proton', 'Toyota', 'Honda', 'Nissan'],
    popularModels: ['Myvi', 'Saga', 'Vios', 'City', 'Almera'],
    searchPlaceholder: 'Cari kereta di Malaysia...',
    listingFeatures: {
      showMileage: true,
      showYear: true,
      showEngine: true,
      showFuelType: true,
      showTransmission: true,
    },
  },
  ID: {
    code: 'ID',
    name: 'Indonesia',
    flag: '🇮🇩',
    currency: 'IDR',
    currencySymbol: 'Rp',
    locale: 'id-ID',
    timezone: 'Asia/Jakarta',
    phoneCode: '+62',
    categories: [
      { id: 'cars', name: 'Mobil', icon: '🚗' },
      { id: 'suvs', name: 'SUV', icon: '🚙' },
      { id: 'mpv', name: 'MPV', icon: '🚐' },
      { id: 'lcgc', name: 'LCGC', icon: '🚘' },
      { id: 'luxury', name: 'Mewah', icon: '💎' },
    ],
    popularBrands: ['Toyota', 'Honda', 'Daihatsu', 'Suzuki', 'Mitsubishi'],
    popularModels: ['Avanza', 'Brio', 'Xenia', 'Ertiga', 'Xpander'],
    searchPlaceholder: 'Cari mobil di Indonesia...',
    listingFeatures: {
      showMileage: true,
      showYear: true,
      showEngine: true,
      showFuelType: true,
      showTransmission: true,
    },
  },
  TH: {
    code: 'TH',
    name: 'Thailand',
    flag: '🇹🇭',
    currency: 'THB',
    currencySymbol: '฿',
    locale: 'th-TH',
    timezone: 'Asia/Bangkok',
    phoneCode: '+66',
    categories: [
      { id: 'cars', name: 'รถยนต์', icon: '🚗' },
      { id: 'suvs', name: 'SUV', icon: '🚙' },
      { id: 'pickup', name: 'รถกระบะ', icon: '🛻' },
      { id: 'electric', name: 'รถยนต์ไฟฟ้า', icon: '🔌' },
      { id: 'luxury', name: 'หรูหรา', icon: '💎' },
    ],
    popularBrands: ['Toyota', 'Honda', 'Isuzu', 'Mazda', 'Nissan'],
    popularModels: ['Vios', 'City', 'D-Max', 'Mazda2', 'Almera'],
    searchPlaceholder: 'ค้นหารถยนต์ในประเทศไทย...',
    listingFeatures: {
      showMileage: true,
      showYear: true,
      showEngine: true,
      showFuelType: true,
      showTransmission: true,
    },
  },
};

export const getCountryByIP = (ip: string): CountryCode | null => {
  try {
    const geoip = require('geoip-lite');
    const geo = geoip.lookup(ip);
    
    if (!geo) return null;
    
    const countryCode = geo.country;
    
    // Map geoip country codes to our country codes
    const countryMap: Record<string, CountryCode> = {
      'CA': 'CA',
      'SG': 'SG',
      'MY': 'MY',
      'ID': 'ID',
      'TH': 'TH',
    };
    
    return countryMap[countryCode] || null;
  } catch (error) {
    console.error('Error in geo-IP lookup:', error);
    return null;
  }
};

export const getCountryConfig = (code: CountryCode): CountryConfig => {
  return countries[code] || countries.CA;
};

