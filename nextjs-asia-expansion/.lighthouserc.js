/**
 * Lighthouse CI Configuration
 * Target: Mobile score >90 for all pages
 */

module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/sg',
        'http://localhost:3000/ca',
        'http://localhost:3000/my',
        'http://localhost:3000/id',
        'http://localhost:3000/th',
        'http://localhost:3000/sg/listings',
        'http://localhost:3000/ca/listings',
      ],
      numberOfRuns: 3,
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'Ready on',
      startServerReadyTimeout: 30000,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.90 }],
        'categories:accessibility': ['error', { minScore: 0.90 }],
        'categories:best-practices': ['error', { minScore: 0.90 }],
        'categories:seo': ['error', { minScore: 0.90 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'speed-index': ['error', { maxNumericValue: 3400 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

