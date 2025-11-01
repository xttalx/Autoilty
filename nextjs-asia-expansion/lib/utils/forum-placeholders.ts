import { CountryCode, countries } from '@/lib/countries';

/**
 * Get country-specific forum post placeholders
 */
export function getForumPlaceholder(country: CountryCode, category?: string): string {
  const placeholders: Record<CountryCode, Record<string, string>> = {
    CA: {
      default: 'Share your thoughts...',
      general: 'What\'s on your mind about Canadian cars?',
      maintenance: 'Ask about maintenance tips, winter driving, or repairs...',
      buying: 'Looking for buying advice? Share your questions...',
      modifications: 'Discuss mods, upgrades, or performance tuning...',
    },
    SG: {
      default: 'Share your thoughts...',
      general: 'Discuss cars in Singapore - COE, road tax, inspections...',
      maintenance: 'Ask about servicing, inspections, or repairs in SG...',
      buying: 'Looking to buy? Ask about COE prices, dealers, or models...',
      modifications: 'Discuss LTA-compliant mods and upgrades...',
    },
    MY: {
      default: 'Kongsi pendapat anda...',
      general: 'Bincang tentang kereta di Malaysia - AP, duti, road tax...',
      maintenance: 'Tanya tentang servis, pembaikan, atau penyelenggaraan...',
      buying: 'Nak beli kereta? Tanya tentang harga, dealer, atau model...',
      modifications: 'Bincang tentang modifikasi yang sah...',
    },
    ID: {
      default: 'Bagikan pemikiran Anda...',
      general: 'Diskusikan mobil di Indonesia - Pajak, STNK, banjir...',
      maintenance: 'Tanya tentang servis, perbaikan, atau perawatan mobil...',
      buying: 'Mau beli mobil? Tanya tentang harga, dealer, atau model...',
      modifications: 'Diskusikan modifikasi flood-proof dan upgrade...',
    },
    TH: {
      default: 'แบ่งปันความคิดของคุณ...',
      general: 'พูดคุยเกี่ยวกับรถยนต์ในประเทศไทย...',
      maintenance: 'ถามเกี่ยวกับการบำรุงรักษา การซ่อมแซม...',
      buying: 'ต้องการซื้อรถ? ถามเกี่ยวกับราคา ร้านจำหน่าย หรือรุ่น...',
      modifications: 'พูดคุยเกี่ยวกับการปรับแต่งและการอัพเกรด...',
    },
  };

  const countryPlaceholders = placeholders[country] || placeholders.CA;
  return category && countryPlaceholders[category] 
    ? countryPlaceholders[category] 
    : countryPlaceholders.default;
}

/**
 * Get country-specific thread title suggestions
 */
export function getThreadTitleSuggestions(country: CountryCode): string[] {
  const suggestions: Record<CountryCode, string[]> = {
    CA: [
      'Best winter tires for Canadian roads?',
      'EV charging stations in Toronto',
      'Toyota vs Honda - which is more reliable?',
    ],
    SG: [
      'COE prices - will they go down?',
      'Best car for Singapore roads?',
      'LTA-compliant modifications guide',
    ],
    MY: [
      'Proton vs Perodua - which is better?',
      'Flood-proof modifications in Malaysia',
      'Best car for Malaysian roads?',
    ],
    ID: [
      'Flood-proof modifications in Indonesia',
      'Honda vs Toyota - which is more reliable?',
      'Best LCGC car for city driving?',
    ],
    TH: [
      'Best pickup truck for Thailand?',
      'Toyota vs Honda - reliability comparison',
      'EV adoption in Bangkok',
    ],
  };

  return suggestions[country] || suggestions.CA;
}

