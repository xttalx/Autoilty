'use client';

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { countries, CountryCode } from '@/lib/countries';

export default function HomePage() {
  const { t } = useTranslation();
  const [country, setCountry] = useState<CountryCode>('CA');

  useEffect(() => {
    // Get country from URL params or localStorage
    const params = new URLSearchParams(window.location.search);
    const countryParam = params.get('country') as CountryCode;
    const savedCountry = localStorage.getItem('country') as CountryCode;
    
    if (countryParam && ['CA', 'SG', 'MY', 'ID', 'TH'].includes(countryParam)) {
      setCountry(countryParam);
    } else if (savedCountry && ['CA', 'SG', 'MY', 'ID', 'TH'].includes(savedCountry)) {
      setCountry(savedCountry);
    }
  }, []);

  const countryConfig = countries[country];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              {t('home.title')}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto">
              {t('home.subtitle')}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder={countryConfig.searchPlaceholder}
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary focus:outline-none text-sm sm:text-base"
                />
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary-dark rounded-lg font-semibold transition-colors text-sm sm:text-base">
                  {t('home.searchButton')}
                </button>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="mt-8 sm:mt-12">
              <p className="text-sm sm:text-base text-gray-400 mb-4">{t('home.popularSearches')}</p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {countryConfig.popularBrands.slice(0, 5).map((brand) => (
                  <Link
                    key={brand}
                    href={`/search?brand=${brand}`}
                    className="px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm sm:text-base transition-colors"
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {countryConfig.categories.map((category) => (
              <Link
                key={category.id}
                href={`/search?category=${category.id}`}
                className="flex flex-col items-center p-4 sm:p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-lg transition-all text-center"
              >
                <span className="text-3xl sm:text-4xl mb-2 sm:mb-3">{category.icon}</span>
                <span className="text-sm sm:text-base font-medium text-gray-700">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            {t('home.howItWorks')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.step1')}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{t('home.step1Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.step2')}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{t('home.step2Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.step3')}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{t('home.step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

