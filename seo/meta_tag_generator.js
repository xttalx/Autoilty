/**
 * Dynamic Meta Tag Generator for Autoilty Forum Pages
 * Automatically generates SEO-optimized titles and descriptions
 */

class MetaTagGenerator {
    constructor() {
        this.siteName = "Autoilty";
        this.maxTitleLength = 60;
        this.maxDescriptionLength = 155;
    }

    /**
     * Generate optimized title tag
     */
    generateTitle(threadTitle, category, engagement) {
        const templates = {
            high_engagement: `${threadTitle} - ${engagement.replies}+ Replies | ${this.siteName}`,
            question: `${threadTitle} | Expert Answers | ${this.siteName} Forum`,
            guide: `${threadTitle} - Complete Guide | ${this.siteName}`,
            review: `${threadTitle} | Real Reviews | ${this.siteName}`,
            default: `${threadTitle} | ${category} | ${this.siteName} Canada`
        };

        let title = templates.default;

        // Select template based on thread characteristics
        if (threadTitle.match(/\?$/)) {
            title = templates.question;
        } else if (threadTitle.match(/guide|how to|tutorial/i)) {
            title = templates.guide;
        } else if (threadTitle.match(/review|experience|opinion/i)) {
            title = templates.review;
        } else if (engagement && engagement.replies > 50) {
            title = templates.high_engagement;
        }

        // Truncate if needed
        if (title.length > this.maxTitleLength) {
            title = title.substring(0, this.maxTitleLength - 3) + '...';
        }

        return title;
    }

    /**
     * Generate optimized meta description
     */
    generateDescription(threadTitle, excerpt, stats) {
        const { replies, views, author, timeAgo } = stats;

        const templates = [
            `${excerpt} Join ${replies}+ Canadian auto enthusiasts discussing ${threadTitle}. Expert advice from real car owners on Autoilty.com.`,
            `${excerpt} ${views.toLocaleString()} views • ${replies} replies • Posted ${timeAgo}. Canada's most active automotive community forum.`,
            `${excerpt} Get expert answers from 50,000+ members. Join the discussion on Autoilty.com - Canada's premier auto enthusiast forum.`
        ];

        // Select best template based on content
        let description = templates[0];

        // Truncate if needed
        if (description.length > this.maxDescriptionLength) {
            description = description.substring(0, this.maxDescriptionLength - 3) + '...';
        }

        return description;
    }

    /**
     * Generate JSON-LD structured data for forum thread
     */
    generateForumPostingSchema(thread) {
        return {
            "@context": "https://schema.org",
            "@type": "DiscussionForumPosting",
            "headline": thread.title,
            "text": thread.content,
            "datePublished": thread.publishedDate,
            "dateModified": thread.modifiedDate,
            "author": {
                "@type": "Person",
                "name": thread.author,
                "url": `https://autoilty.com/users/${thread.authorId}`
            },
            "publisher": {
                "@type": "Organization",
                "name": "Autoilty",
                "url": "https://autoilty.com",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://autoilty.com/logo.png"
                }
            },
            "discussionUrl": `https://autoilty.com/forum/thread/${thread.id}`,
            "commentCount": thread.replies,
            "interactionStatistic": {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/ViewAction",
                "userInteractionCount": thread.views
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://autoilty.com/forum/thread/${thread.id}`
            }
        };
    }

    /**
     * Generate FAQ schema for Q&A threads
     */
    generateFAQSchema(question, answers) {
        const mainEntity = answers.map(answer => ({
            "@type": "Question",
            "name": question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": answer.text,
                "author": {
                    "@type": "Person",
                    "name": answer.author
                },
                "upvoteCount": answer.upvotes,
                "dateCreated": answer.date
            }
        }));

        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": mainEntity
        };
    }

    /**
     * Generate breadcrumb schema
     */
    generateBreadcrumbSchema(path) {
        const items = path.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }));

        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": items
        };
    }

    /**
     * Generate Open Graph tags for social sharing
     */
    generateOpenGraphTags(thread) {
        return {
            "og:type": "article",
            "og:site_name": "Autoilty",
            "og:title": thread.title,
            "og:description": thread.excerpt,
            "og:url": `https://autoilty.com/forum/thread/${thread.id}`,
            "og:image": thread.featuredImage || "https://autoilty.com/og-default.jpg",
            "og:image:width": "1200",
            "og:image:height": "630",
            "article:published_time": thread.publishedDate,
            "article:author": thread.author,
            "article:section": thread.category,
            "article:tag": thread.tags.join(",")
        };
    }

    /**
     * Generate Twitter Card tags
     */
    generateTwitterCardTags(thread) {
        return {
            "twitter:card": "summary_large_image",
            "twitter:site": "@Autoilty",
            "twitter:title": thread.title,
            "twitter:description": thread.excerpt,
            "twitter:image": thread.featuredImage || "https://autoilty.com/twitter-card.jpg",
            "twitter:creator": `@${thread.author}`
        };
    }

    /**
     * Generate canonical URL
     */
    generateCanonicalUrl(thread, currentPage = 1) {
        const baseUrl = `https://autoilty.com/forum/thread/${thread.id}`;
        return currentPage > 1 ? `${baseUrl}?page=${currentPage}` : baseUrl;
    }

    /**
     * Generate complete HTML meta tags
     */
    generateCompleteMeta(thread, stats) {
        const title = this.generateTitle(thread.title, thread.category, stats);
        const description = this.generateDescription(thread.title, thread.excerpt, stats);
        const canonical = this.generateCanonicalUrl(thread);
        const ogTags = this.generateOpenGraphTags(thread);
        const twitterTags = this.generateTwitterCardTags(thread);
        const schema = this.generateForumPostingSchema(thread);

        return `
<!-- SEO Meta Tags -->
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">

<!-- Open Graph -->
${Object.entries(ogTags).map(([key, value]) => 
    `<meta property="${key}" content="${value}">`
).join('\n')}

<!-- Twitter Card -->
${Object.entries(twitterTags).map(([key, value]) => 
    `<meta name="${key}" content="${value}">`
).join('\n')}

<!-- Structured Data -->
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
`;
    }
}

// Export for use in forum pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MetaTagGenerator;
}

// Example usage
if (typeof window !== 'undefined') {
    window.MetaTagGenerator = MetaTagGenerator;
}

