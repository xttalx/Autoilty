import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '../lib/i18n/config';
import Navbar from '@/components/Navbar';
import { SessionProvider } from '@/components/SessionProvider';
import { headers } from 'next/headers';
import { detectCountryFromHeaders, getCountryFromCookie } from '@/lib/geo-detection';
import { CountryCode } from '@/lib/countries';
import { cookies } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Autoilty - Find Your Perfect Car',
  description: 'Search thousands of verified car listings across Canada and Asia',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side geo-detection
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  
  // Try to get country from cookie first (user preference)
  let countryCode: CountryCode = getCountryFromCookie(cookieString) || 'CA';
  
  // If no cookie, try to detect from headers (server-side)
  if (!getCountryFromCookie(cookieString)) {
    try {
      const headersList = headers();
      const headersObj = new Headers();
      
      // Get IP-related headers
      const forwardedFor = headersList.get('x-forwarded-for');
      const realIP = headersList.get('x-real-ip');
      const cfConnectingIP = headersList.get('cf-connecting-ip');
      const acceptLanguage = headersList.get('accept-language');
      
      if (forwardedFor) headersObj.set('x-forwarded-for', forwardedFor);
      if (realIP) headersObj.set('x-real-ip', realIP);
      if (cfConnectingIP) headersObj.set('cf-connecting-ip', cfConnectingIP);
      if (acceptLanguage) headersObj.set('accept-language', acceptLanguage);
      
      const geoResult = detectCountryFromHeaders(headersObj);
      countryCode = geoResult.countryCode;
    } catch (error) {
      console.error('Geo-detection error:', error);
      // Fallback to default
      countryCode = 'CA';
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <Navbar currentCountry={countryCode} />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </SessionProvider>
        <footer className="bg-gray-900 text-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">AUTOILTY</h3>
                <p className="text-gray-400 text-sm">
                  Find your perfect car across Canada and Asia
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Explore</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/search" className="hover:text-white">Search Cars</a></li>
                  <li><a href="/listings" className="hover:text-white">Browse Listings</a></li>
                  <li><a href="/sell" className="hover:text-white">Sell Your Car</a></li>
                  <li><a href="/forum" className="hover:text-white">Community Forum</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/guides" className="hover:text-white">Buying Guides</a></li>
                  <li><a href="/tools" className="hover:text-white">Tools & Calculators</a></li>
                  <li><a href="/about" className="hover:text-white">About Us</a></li>
                  <li><a href="/contact" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Countries</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/?country=CA" className="hover:text-white">🇨🇦 Canada</a></li>
                  <li><a href="/?country=SG" className="hover:text-white">🇸🇬 Singapore</a></li>
                  <li><a href="/?country=MY" className="hover:text-white">🇲🇾 Malaysia</a></li>
                  <li><a href="/?country=ID" className="hover:text-white">🇮🇩 Indonesia</a></li>
                  <li><a href="/?country=TH" className="hover:text-white">🇹🇭 Thailand</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 Autoilty. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

