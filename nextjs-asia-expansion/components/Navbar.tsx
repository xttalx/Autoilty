'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { CountryCode, countries } from '@/lib/countries';

interface NavbarProps {
  currentCountry?: CountryCode;
}

export default function Navbar({ currentCountry = 'CA' }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [country, setCountry] = useState<CountryCode>(currentCountry);

  useEffect(() => {
    // Set country from cookie or localStorage
    const savedCountry = localStorage.getItem('country') as CountryCode;
    if (savedCountry && ['CA', 'SG', 'MY', 'ID', 'TH'].includes(savedCountry)) {
      setCountry(savedCountry);
    }
  }, []);

  const handleCountryChange = (newCountry: CountryCode) => {
    setCountry(newCountry);
    localStorage.setItem('country', newCountry);
    setIsMobileMenuOpen(false);
    // Optionally reload or redirect
    window.location.href = `/?country=${newCountry}`;
  };

  const currentCountryConfig = countries[country];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">AUTOILTY</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
              {t('nav.home')}
            </Link>
            <Link href="/search" className="text-gray-700 hover:text-primary transition-colors">
              {t('nav.search')}
            </Link>
            <Link href="/listings" className="text-gray-700 hover:text-primary transition-colors">
              {t('nav.listings')}
            </Link>
            <Link href="/sell" className="text-gray-700 hover:text-primary transition-colors">
              {t('nav.sell')}
            </Link>
            <Link href="/forum" className="text-gray-700 hover:text-primary transition-colors">
              {t('nav.forum')}
            </Link>

            {/* Country Selector */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors">
                <span>{currentCountryConfig.flag}</span>
                <span className="hidden lg:inline">{currentCountryConfig.code}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {(['CA', 'SG', 'MY', 'ID', 'TH'] as CountryCode[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => handleCountryChange(code)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center space-x-2 ${
                      country === code ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <span>{countries[code].flag}</span>
                    <span>{countries[code].name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selector */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-primary transition-colors">
                {i18n.language.toUpperCase()}
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {['en', 'ms', 'id'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => i18n.changeLanguage(lang)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      i18n.language === lang ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-700'
                    }`}
                  >
                    {lang === 'en' ? 'English' : lang === 'ms' ? 'Bahasa Melayu' : 'Bahasa Indonesia'}
                  </button>
                ))}
              </div>
            </div>

            {/* Auth Buttons */}
            <Link
              href="/login"
              className="px-4 py-2 text-gray-700 hover:text-primary transition-colors"
            >
              {t('nav.login')}
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              {t('nav.signup')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                {t('nav.home')}
              </Link>
              <Link href="/search" className="text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                {t('nav.search')}
              </Link>
              <Link href="/listings" className="text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                {t('nav.listings')}
              </Link>
              <Link href="/sell" className="text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                {t('nav.sell')}
              </Link>
              <Link href="/forum" className="text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                {t('nav.forum')}
              </Link>

              {/* Mobile Country Selector */}
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select
                  value={country}
                  onChange={(e) => handleCountryChange(e.target.value as CountryCode)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {(['CA', 'SG', 'MY', 'ID', 'TH'] as CountryCode[]).map((code) => (
                    <option key={code} value={code}>
                      {countries[code].flag} {countries[code].name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Language Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={i18n.language}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="en">English</option>
                  <option value="ms">Bahasa Melayu</option>
                  <option value="id">Bahasa Indonesia</option>
                </select>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/login"
                  className="block text-center px-4 py-2 text-gray-700 hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href="/signup"
                  className="block text-center px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.signup')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

