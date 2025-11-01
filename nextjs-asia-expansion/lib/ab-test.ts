/**
 * A/B Testing Framework
 * Compare SG vs CA homepage performance
 */

export type Variant = 'SG' | 'CA' | 'control';

export interface ABTestConfig {
  testId: string;
  variants: Variant[];
  defaultVariant: Variant;
}

export interface ABTestResult {
  variant: Variant;
  userId?: string;
  sessionId?: string;
}

// A/B Test Configuration
export const HOMEPAGE_AB_TEST: ABTestConfig = {
  testId: 'homepage-variant',
  variants: ['SG', 'CA', 'control'],
  defaultVariant: 'control',
};

/**
 * Get or assign variant for user
 */
export function getVariant(userId?: string, sessionId?: string): Variant {
  // In production, use a proper A/B testing service (e.g., Optimizely, VWO, or custom)
  // For now, use consistent hashing based on userId or sessionId
  
  if (typeof window === 'undefined') {
    // Server-side: return default
    return HOMEPAGE_AB_TEST.defaultVariant;
  }

  const id = userId || sessionId || Math.random().toString();
  
  // Simple hash-based assignment
  const hash = id.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  const index = Math.abs(hash) % HOMEPAGE_AB_TEST.variants.length;
  return HOMEPAGE_AB_TEST.variants[index];
}

/**
 * Track A/B test event
 */
export function trackABTestEvent(
  testId: string,
  variant: Variant,
  event: 'view' | 'click' | 'conversion',
  metadata?: Record<string, any>
) {
  // In production, send to analytics (Google Analytics, Mixpanel, etc.)
  if (typeof window !== 'undefined') {
    // Example: Google Analytics 4
    if (window.gtag) {
      window.gtag('event', event, {
        test_id: testId,
        variant,
        ...metadata,
      });
    }

    // Log for debugging
    console.log('AB Test Event:', {
      testId,
      variant,
      event,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Record variant assignment
 */
export function recordVariantAssignment(
  testId: string,
  variant: Variant,
  userId?: string,
  sessionId?: string
) {
  // Store in localStorage for consistency
  if (typeof window !== 'undefined') {
    const key = `ab_test_${testId}`;
    const data = {
      variant,
      userId,
      sessionId,
      assignedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(data));
    
    // Track view event
    trackABTestEvent(testId, variant, 'view');
  }
}

/**
 * Get stored variant (if previously assigned)
 */
export function getStoredVariant(testId: string): Variant | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const key = `ab_test_${testId}`;
  const stored = localStorage.getItem(key);
  
  if (stored) {
    try {
      const data = JSON.parse(stored);
      return data.variant;
    } catch (e) {
      return null;
    }
  }
  
  return null;
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

