/**
 * A/B Test Wrapper Component
 * Wraps homepage to show different variants
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getVariant, getStoredVariant, recordVariantAssignment, HOMEPAGE_AB_TEST, Variant } from '@/lib/ab-test';
import CountryHomePage from './pages/CountryHomePage';

interface ABTestWrapperProps {
  defaultCountry: 'SG' | 'CA';
}

export default function ABTestWrapper({ defaultCountry }: ABTestWrapperProps) {
  const [variant, setVariant] = useState<Variant>(defaultCountry);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for forced variant in URL (for testing)
    const forcedVariant = searchParams?.get('variant') as Variant | null;
    if (forcedVariant && HOMEPAGE_AB_TEST.variants.includes(forcedVariant)) {
      setVariant(forcedVariant);
      setLoading(false);
      return;
    }

    // Check stored variant first
    const stored = getStoredVariant(HOMEPAGE_AB_TEST.testId);
    if (stored) {
      setVariant(stored);
      setLoading(false);
      return;
    }

    // Generate session ID
    const sessionId = sessionStorage.getItem('sessionId') || 
                     Math.random().toString(36).substring(7);
    if (!sessionStorage.getItem('sessionId')) {
      sessionStorage.setItem('sessionId', sessionId);
    }

    // Assign variant
    const assignedVariant = getVariant(undefined, sessionId);
    setVariant(assignedVariant);
    
    // Record assignment
    recordVariantAssignment(
      HOMEPAGE_AB_TEST.testId,
      assignedVariant,
      undefined,
      sessionId
    );

    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Map variant to country
  const countryMap: Record<Variant, 'SG' | 'CA'> = {
    SG: 'SG',
    CA: 'CA',
    control: defaultCountry,
  };

  const country = countryMap[variant];

  return (
    <>
      {/* A/B Test indicator (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm z-50">
          A/B Test: {variant} → {country}
        </div>
      )}
      <CountryHomePage country={country} />
    </>
  );
}

