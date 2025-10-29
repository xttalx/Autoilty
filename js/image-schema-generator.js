// Advanced Image Schema Generator for Autoilty
// Optimizes vehicle images for Google Image Search

class ImageSchemaGenerator {
    constructor() {
        this.baseUrl = 'https://autoilty.com';
    }

    // Generate ImageObject Schema for Vehicle Images
    generateVehicleImageSchema(data) {
        return {
            "@context": "https://schema.org",
            "@type": "ImageObject",
            "name": `${data.year} ${data.make} ${data.model}`,
            "description": data.description || `High-quality image of ${data.year} ${data.make} ${data.model}`,
            "contentUrl": data.imageUrl,
            "url": data.pageUrl || this.baseUrl,
            "width": data.width || "1200",
            "height": data.height || "675",
            "encodingFormat": "image/jpeg",
            "thumbnailUrl": data.thumbnailUrl || data.imageUrl,
            "caption": `${data.year} ${data.make} ${data.model} - ${data.caption || 'Official Photo'}`,
            "creditText": data.creditText || "Autoilty",
            "creator": {
                "@type": "Organization",
                "name": "Autoilty"
            },
            "copyrightNotice": `© ${new Date().getFullYear()} Autoilty`,
            "license": `${this.baseUrl}/license`,
            "acquireLicensePage": `${this.baseUrl}/contact`,
            "isPartOf": {
                "@type": "WebPage",
                "@id": data.pageUrl || this.baseUrl
            }
        };
    }

    // Generate Product Schema with Images (for vehicle listings)
    generateVehicleProductSchema(data) {
        return {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": `${data.year} ${data.make} ${data.model}`,
            "description": data.description,
            "image": data.images || [data.imageUrl], // Multiple images
            "brand": {
                "@type": "Brand",
                "name": data.make
            },
            "offers": {
                "@type": "Offer",
                "price": data.price,
                "priceCurrency": "CAD",
                "availability": "https://schema.org/InStock",
                "url": data.pageUrl
            },
            "aggregateRating": data.rating ? {
                "@type": "AggregateRating",
                "ratingValue": data.rating.value,
                "reviewCount": data.rating.count,
                "bestRating": "5",
                "worstRating": "1"
            } : null,
            "manufacturer": {
                "@type": "Organization",
                "name": data.make
            },
            "model": data.model,
            "productionDate": data.year.toString(),
            "vehicleConfiguration": data.trim || "Base",
            "fuelType": data.fuelType || "Gasoline"
        };
    }

    // Generate ItemList Schema for Gallery/Comparison
    generateImageGallerySchema(images, title) {
        return {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": title || "Vehicle Image Gallery",
            "numberOfItems": images.length,
            "itemListElement": images.map((img, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "ImageObject",
                    "name": img.name,
                    "contentUrl": img.url,
                    "description": img.description,
                    "thumbnail": img.thumbnail || img.url
                }
            }))
        };
    }

    // Auto-detect and add schema to vehicle images on page
    autoAddImageSchemas() {
        // Find all images with data-vehicle attributes
        const vehicleImages = document.querySelectorAll('img[data-vehicle-year][data-vehicle-make]');
        
        vehicleImages.forEach(img => {
            const year = img.getAttribute('data-vehicle-year');
            const make = img.getAttribute('data-vehicle-make');
            const model = img.getAttribute('data-vehicle-model') || '';
            const price = img.getAttribute('data-vehicle-price');
            const description = img.getAttribute('alt') || `${year} ${make} ${model}`;
            
            // Ensure proper alt text
            if (!img.alt) {
                img.alt = `${year} ${make} ${model}`;
            }

            // Generate and inject schema
            const imageSchema = this.generateVehicleImageSchema({
                year: year,
                make: make,
                model: model,
                imageUrl: img.src,
                thumbnailUrl: img.getAttribute('data-thumbnail') || img.src,
                pageUrl: window.location.href,
                description: description,
                width: img.naturalWidth || 1200,
                height: img.naturalHeight || 675,
                caption: img.getAttribute('data-caption') || `${year} ${make} ${model}`
            });

            this.injectSchema(imageSchema);

            // If price is available, also add Product schema
            if (price) {
                const productSchema = this.generateVehicleProductSchema({
                    year: year,
                    make: make,
                    model: model,
                    imageUrl: img.src,
                    price: price,
                    pageUrl: window.location.href,
                    description: description
                });
                this.injectSchema(productSchema);
            }
        });
    }

    // Inject schema into page
    injectSchema(schema) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    // Add structured data to comparison images
    addComparisonImageSchemas() {
        const comparisonImages = document.querySelectorAll('.comparison-image');
        const images = [];

        comparisonImages.forEach((img, index) => {
            const year = img.getAttribute('data-year');
            const make = img.getAttribute('data-make');
            const model = img.getAttribute('data-model');

            images.push({
                name: `${year} ${make} ${model}`,
                url: img.src,
                description: img.alt || `${year} ${make} ${model}`,
                thumbnail: img.getAttribute('data-thumbnail') || img.src
            });
        });

        if (images.length > 0) {
            const gallerySchema = this.generateImageGallerySchema(
                images,
                document.title + ' - Image Gallery'
            );
            this.injectSchema(gallerySchema);
        }
    }

    // Initialize
    init() {
        // Auto-add schemas for vehicle images
        this.autoAddImageSchemas();
        
        // Add comparison image schemas if on comparison page
        if (window.location.pathname.includes('comparison')) {
            this.addComparisonImageSchemas();
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const imageSchemaGenerator = new ImageSchemaGenerator();
    imageSchemaGenerator.init();
});

// Export for use in other scripts
window.ImageSchemaGenerator = ImageSchemaGenerator;

// Helper function to add image schema manually
window.addVehicleImageSchema = function(imageElement, vehicleData) {
    const generator = new ImageSchemaGenerator();
    const schema = generator.generateVehicleImageSchema({
        year: vehicleData.year,
        make: vehicleData.make,
        model: vehicleData.model,
        imageUrl: imageElement.src,
        pageUrl: window.location.href,
        description: vehicleData.description,
        width: imageElement.naturalWidth,
        height: imageElement.naturalHeight
    });
    generator.injectSchema(schema);
};

