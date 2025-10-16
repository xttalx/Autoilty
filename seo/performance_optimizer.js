/**
 * Core Web Vitals Performance Optimizer for Autoilty.com
 * Target: 100/100 PageSpeed Insights scores
 */

class PerformanceOptimizer {
    constructor() {
        this.config = {
            lazyLoadOffset: 200,
            imageQuality: 85,
            cacheVersion: '1.0'
        };
    }

    /**
     * Lazy load images with Intersection Observer
     */
    initLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Load image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: `${this.config.lazyLoadOffset}px`
        });

        // Observe all lazy-load images
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    /**
     * Optimize images with responsive srcset
     */
    generateResponsiveImage(src, alt, sizes = [320, 640, 960, 1280, 1920]) {
        const srcset = sizes.map(size => 
            `${src}?w=${size}&q=${this.config.imageQuality} ${size}w`
        ).join(', ');

        return `
            <img 
                data-src="${src}" 
                data-srcset="${srcset}"
                alt="${alt}"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                class="lazy-image"
                loading="lazy"
            >
        `;
    }

    /**
     * Preload critical resources
     */
    preloadCriticalResources() {
        const criticalResources = [
            { href: '/css/main.css', as: 'style' },
            { href: '/css/forum.css', as: 'style' },
            { href: '/js/main.js', as: 'script' },
            { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap', as: 'style' }
        ];

        const head = document.head;
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'style') {
                link.onload = function() { this.rel = 'stylesheet'; };
            }
            head.appendChild(link);
        });
    }

    /**
     * Defer non-critical JavaScript
     */
    deferNonCriticalScripts() {
        const scripts = [
            '/js/chatbot.js',
            '/js/analytics.js',
            'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
        ];

        window.addEventListener('load', () => {
            scripts.forEach(src => {
                const script = document.createElement('script');
                script.src = src;
                script.defer = true;
                document.body.appendChild(script);
            });
        });
    }

    /**
     * Implement service worker for caching
     */
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('✅ Service Worker registered:', reg.scope))
                    .catch(err => console.log('❌ Service Worker registration failed:', err));
            });
        }
    }

    /**
     * Generate service worker code
     */
    static generateServiceWorkerCode() {
        return `
// Service Worker for Autoilty.com
const CACHE_NAME = 'autoilty-v1';
const urlsToCache = [
    '/',
    '/css/main.css',
    '/css/forum.css',
    '/js/main.js',
    '/js/forum.js',
    '/offline.html'
];

// Install service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Fetch from cache first
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Clone request
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(response => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone response
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
    );
});

// Clean old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
        `;
    }

    /**
     * Optimize CSS delivery
     */
    optimizeCSSDelivery() {
        // Inline critical CSS
        const criticalCSS = `
/* Critical above-the-fold CSS */
body { 
    margin: 0; 
    font-family: 'Inter', sans-serif; 
    background: #fff;
}
.navbar { 
    background: #000; 
    color: #fff; 
    padding: 1rem;
}
.container { 
    max-width: 1200px; 
    margin: 0 auto; 
    padding: 0 1rem;
}
        `;

        // Inject critical CSS
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.appendChild(style);

        // Load full CSS asynchronously
        const loadCSS = (href) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.media = 'print';
            link.onload = function() { this.media = 'all'; };
            document.head.appendChild(link);
        };

        loadCSS('/css/main.css');
        loadCSS('/css/forum.css');
    }

    /**
     * Implement infinite scroll with performance optimization
     */
    initInfiniteScroll(loadMoreCallback) {
        let loading = false;
        const threshold = 500; // pixels from bottom

        const handleScroll = () => {
            if (loading) return;

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight >= documentHeight - threshold) {
                loading = true;
                loadMoreCallback().then(() => {
                    loading = false;
                });
            }
        };

        // Throttle scroll event
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /**
     * Measure and report Core Web Vitals
     */
    measureWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                const fid = entry.processingStart - entry.startTime;
                console.log('FID:', fid);
            });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsScore = 0;
        new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsScore += entry.value;
                    console.log('CLS:', clsScore);
                }
            });
        }).observe({ entryTypes: ['layout-shift'] });
    }

    /**
     * Initialize all optimizations
     */
    init() {
        // Wait for DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this._runOptimizations());
        } else {
            this._runOptimizations();
        }
    }

    _runOptimizations() {
        this.initLazyLoading();
        this.deferNonCriticalScripts();
        this.registerServiceWorker();
        this.measureWebVitals();
        
        console.log('✅ Performance optimizations initialized');
    }
}

// Auto-initialize
const optimizer = new PerformanceOptimizer();
optimizer.init();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}

