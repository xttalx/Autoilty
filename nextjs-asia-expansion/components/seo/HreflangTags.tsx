/**
 * Hreflang Tags Component
 * Adds hreflang alternates for multi-country SEO
 */

import { CountryCode, countries } from '@/lib/countries';

interface HreflangTagsProps {
  path: string;
  supportedCountries?: CountryCode[];
  baseUrl?: string;
}

export function HreflangTags({
  path,
  supportedCountries = ['CA', 'SG', 'MY', 'ID', 'TH'],
  baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://autoilty.com',
}: HreflangTagsProps) {
  return (
    <>
      {supportedCountries.map((country) => {
        const countryConfig = countries[country];
        const url = `${baseUrl}/${country.toLowerCase()}${path}`;
        const locale = countryConfig.locale;

        return (
          <link
            key={country}
            rel="alternate"
            hrefLang={locale}
            href={url}
          />
        );
      })}
      {/* Country-specific hreflang */}
      {supportedCountries.map((country) => {
        const url = `${baseUrl}/${country.toLowerCase()}${path}`;
        return (
          <link
            key={`${country}-alt`}
            rel="alternate"
            hrefLang={country.toLowerCase()}
            href={url}
          />
        );
      })}
      {/* x-default for fallback */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}${path}`}
      />
    </>
  );
}

