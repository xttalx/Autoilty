// Advanced Schema Markup Generator for Autoilty
// Generates JSON-LD structured data for SEO & AEO

class SchemaGenerator {
    constructor() {
        this.baseUrl = 'https://autoilty.com';
        this.siteName = 'Autoilty';
        this.logoUrl = 'https://autoilty.com/images/logo.png';
    }

    // Organization Schema
    getOrganizationSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": this.siteName,
            "url": this.baseUrl,
            "logo": this.logoUrl,
            "description": "Canada's premier automotive community, forum, and mechanic directory",
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "CA"
            },
            "sameAs": [
                "https://www.facebook.com/autoilty",
                "https://www.twitter.com/autoilty",
                "https://www.instagram.com/autoilty",
                "https://www.youtube.com/autoilty"
            ],
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "15243"
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "email": "support@autoilty.com",
                "availableLanguage": ["English", "French"]
            }
        };
    }

    // WebSite Schema with Site Search
    getWebSiteSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": this.siteName,
            "alternateName": "Autoilty.com",
            "url": this.baseUrl,
            "description": "Canada's premier automotive community and directory",
            "potentialAction": {
                "@type": "SearchAction",
                "target": `${this.baseUrl}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string"
            },
            "publisher": {
                "@type": "Organization",
                "name": this.siteName,
                "logo": {
                    "@type": "ImageObject",
                    "url": this.logoUrl
                }
            }
        };
    }

    // FAQ Page Schema (Voice Search Gold)
    getFAQSchema(faqs) {
        const mainEntity = faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }));

        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": mainEntity
        };
    }

    // HowTo Schema (Featured Snippets)
    getHowToSchema(data) {
        return {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": data.name,
            "description": data.description,
            "image": data.image || null,
            "totalTime": data.totalTime || null,
            "estimatedCost": data.estimatedCost ? {
                "@type": "MonetaryAmount",
                "currency": "CAD",
                "value": data.estimatedCost
            } : null,
            "tool": data.tools ? data.tools.map(tool => ({
                "@type": "HowToTool",
                "name": tool
            })) : [],
            "supply": data.supplies ? data.supplies.map(supply => ({
                "@type": "HowToSupply",
                "name": supply
            })) : [],
            "step": data.steps.map((step, index) => ({
                "@type": "HowToStep",
                "position": index + 1,
                "name": step.name,
                "text": step.text,
                "image": step.image || null,
                "url": `${data.url}#step${index + 1}`
            }))
        };
    }

    // Article Schema
    getArticleSchema(data) {
        return {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": data.headline,
            "image": data.image,
            "datePublished": data.datePublished,
            "dateModified": data.dateModified || data.datePublished,
            "author": {
                "@type": "Person",
                "name": data.author || "Autoilty Team",
                "url": data.authorUrl || `${this.baseUrl}/about`
            },
            "publisher": {
                "@type": "Organization",
                "name": this.siteName,
                "logo": {
                    "@type": "ImageObject",
                    "url": this.logoUrl
                }
            },
            "description": data.description,
            "articleBody": data.body || null,
            "wordCount": data.wordCount || null,
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": data.url
            }
        };
    }

    // Product Schema (Vehicle Comparisons)
    getProductSchema(data) {
        return {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": data.name,
            "image": data.image,
            "description": data.description,
            "brand": {
                "@type": "Brand",
                "name": data.brand
            },
            "aggregateRating": data.rating ? {
                "@type": "AggregateRating",
                "ratingValue": data.rating.value,
                "reviewCount": data.rating.count,
                "bestRating": "5",
                "worstRating": "1"
            } : null,
            "offers": {
                "@type": "Offer",
                "price": data.price,
                "priceCurrency": "CAD",
                "availability": "https://schema.org/InStock",
                "url": data.url
            },
            "review": data.reviews ? data.reviews.map(review => ({
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": review.author
                },
                "datePublished": review.date,
                "reviewBody": review.text,
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": review.rating
                }
            })) : []
        };
    }

    // LocalBusiness Schema (Mechanic Listings)
    getLocalBusinessSchema(data) {
        return {
            "@context": "https://schema.org",
            "@type": "AutomotiveBusiness",
            "name": data.name,
            "image": data.image,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": data.address.street,
                "addressLocality": data.address.city,
                "addressRegion": data.address.province,
                "postalCode": data.address.postalCode,
                "addressCountry": "CA"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": data.coordinates.lat,
                "longitude": data.coordinates.lng
            },
            "telephone": data.phone,
            "priceRange": data.priceRange || "$$",
            "aggregateRating": data.rating ? {
                "@type": "AggregateRating",
                "ratingValue": data.rating.value,
                "reviewCount": data.rating.count
            } : null,
            "openingHours": data.hours || null,
            "url": data.url
        };
    }

    // BreadcrumbList Schema
    getBreadcrumbSchema(items) {
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": items.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": item.url ? `${this.baseUrl}${item.url}` : undefined
            }))
        };
    }

    // Video Schema
    getVideoSchema(data) {
        return {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": data.name,
            "description": data.description,
            "thumbnailUrl": data.thumbnail,
            "uploadDate": data.uploadDate,
            "duration": data.duration,
            "contentUrl": data.url,
            "embedUrl": data.embedUrl,
            "publisher": {
                "@type": "Organization",
                "name": this.siteName,
                "logo": {
                    "@type": "ImageObject",
                    "url": this.logoUrl
                }
            }
        };
    }

    // Forum Posting Schema
    getDiscussionForumPostingSchema(data) {
        return {
            "@context": "https://schema.org",
            "@type": "DiscussionForumPosting",
            "headline": data.title,
            "text": data.content,
            "datePublished": data.datePublished,
            "author": {
                "@type": "Person",
                "name": data.author
            },
            "interactionStatistic": [
                {
                    "@type": "InteractionCounter",
                    "interactionType": "https://schema.org/CommentAction",
                    "userInteractionCount": data.replies || 0
                },
                {
                    "@type": "InteractionCounter",
                    "interactionType": "https://schema.org/LikeAction",
                    "userInteractionCount": data.likes || 0
                }
            ]
        };
    }

    // Inject schema into page
    injectSchema(schema) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    // Initialize based on page type
    init() {
        // Add organization schema to all pages
        this.injectSchema(this.getOrganizationSchema());

        // Add website schema to homepage
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            this.injectSchema(this.getWebSiteSchema());
        }

        // Auto-detect and add breadcrumbs
        this.addBreadcrumbs();

        // Check for FAQ sections
        this.addFAQSchema();
    }

    // Auto-generate breadcrumbs
    addBreadcrumbs() {
        const pathParts = window.location.pathname.split('/').filter(part => part);
        if (pathParts.length === 0) return;

        const breadcrumbs = [{ name: 'Home', url: '/' }];
        let currentPath = '';

        pathParts.forEach((part, index) => {
            currentPath += `/${part}`;
            const name = this.formatBreadcrumbName(part);
            breadcrumbs.push({
                name: name,
                url: index === pathParts.length - 1 ? null : currentPath
            });
        });

        this.injectSchema(this.getBreadcrumbSchema(breadcrumbs));
    }

    // Format breadcrumb names
    formatBreadcrumbName(part) {
        return part
            .replace('.html', '')
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Auto-detect and add FAQ schema
    addFAQSchema() {
        const faqs = [];
        const h3Elements = document.querySelectorAll('h3');

        h3Elements.forEach(h3 => {
            const question = h3.textContent.trim();
            // Check if this looks like a question
            if (question.includes('?') || question.toLowerCase().startsWith('what') || 
                question.toLowerCase().startsWith('how') || question.toLowerCase().startsWith('why') ||
                question.toLowerCase().startsWith('when') || question.toLowerCase().startsWith('where')) {
                
                // Get the next paragraph or div as the answer
                let answer = '';
                let nextElement = h3.nextElementSibling;
                if (nextElement && (nextElement.tagName === 'P' || nextElement.tagName === 'DIV')) {
                    answer = nextElement.textContent.trim();
                }

                if (answer) {
                    faqs.push({ question, answer });
                }
            }
        });

        if (faqs.length > 0) {
            this.injectSchema(this.getFAQSchema(faqs));
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const schemaGenerator = new SchemaGenerator();
    schemaGenerator.init();
});

// Export for use in other scripts
window.SchemaGenerator = SchemaGenerator;

