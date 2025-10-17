/**
 * AUTOILTY INTELLIGENT BACKLINK SYSTEM
 * Generates contextual related links for every page
 */

const backlinkData = {
    // Category-based backlinks
    'general-discussion': {
        related: [
            { title: 'Automotive News', url: '/categories/automotive-news.html', icon: '📰' },
            { title: 'Car Lifestyle', url: '/categories/car-lifestyle.html', icon: '🚗' },
            { title: 'Tips & Tricks', url: '/categories/tips-tricks.html', icon: '💡' },
            { title: 'Community Lounge', url: '/categories/community-lounge.html', icon: '💬' }
        ],
        external: [
            { title: 'Car and Driver - Auto News', url: 'https://www.caranddriver.com/news/', desc: 'Latest automotive industry news' },
            { title: 'MotorTrend News', url: 'https://www.motortrend.com/news/', desc: 'Breaking automotive news and reviews' },
            { title: 'AutoTrader Canada News', url: 'https://www.autotrader.ca/newsfeatures/', desc: 'Canadian auto market updates' }
        ]
    },
    
    'maintenance-repair': {
        related: [
            { title: 'Brakes & Suspension', url: '/categories/brakes-suspension.html', icon: '🔧' },
            { title: 'Engine & Transmission', url: '/categories/engine-transmission.html', icon: '⚙️' },
            { title: 'Electrical Systems', url: '/categories/electrical-systems.html', icon: '⚡' },
            { title: 'DIY Tutorials', url: '/categories/diy-tutorials.html', icon: '🛠️' },
            { title: 'Body & Paint', url: '/categories/body-paint.html', icon: '🎨' },
            { title: 'Mechanic Finder', url: '/tools/mechanic-finder.html', icon: '🔍' },
            { title: 'Maintenance Tracker', url: '/tools/maintenance-tracker.html', icon: '📊' }
        ],
        external: [
            { title: 'ChrisFix YouTube Channel', url: 'https://www.youtube.com/user/PaintballOO7', desc: 'DIY car repair tutorials' },
            { title: 'Haynes Manuals', url: 'https://haynes.com/en-ca/', desc: 'Comprehensive repair manuals' },
            { title: 'RockAuto Parts', url: 'https://www.rockauto.com/', desc: 'Affordable OEM and aftermarket parts' },
            { title: 'NAPA Auto Parts Canada', url: 'https://www.napacanada.com/', desc: 'Quality auto parts and advice' }
        ]
    },
    
    'buying-selling': {
        related: [
            { title: 'New Cars', url: '/categories/new-cars.html', icon: '🆕' },
            { title: 'Used Cars', url: '/categories/used-cars.html', icon: '🚙' },
            { title: 'Financing & Insurance', url: '/categories/financing-insurance.html', icon: '💰' },
            { title: 'Parts Marketplace', url: '/categories/parts-marketplace.html', icon: '🛒' },
            { title: 'Trade-In Tips', url: '/categories/trade-in-tips.html', icon: '🔄' },
            { title: 'Car Comparison Tool', url: '/tools/comparison.html', icon: '⚖️' },
            { title: 'Financing Calculator', url: '/tools/financing.html', icon: '🧮' }
        ],
        external: [
            { title: 'AutoTrader.ca', url: 'https://www.autotrader.ca/', desc: 'Canada\'s #1 auto marketplace' },
            { title: 'Kijiji Autos', url: 'https://www.kijiji.ca/b-cars-vehicles/canada/c27l0', desc: 'Buy and sell vehicles locally' },
            { title: 'CarFax Canada', url: 'https://www.carfax.ca/', desc: 'Vehicle history reports' },
            { title: 'Unhaggle', url: 'https://www.unhaggle.com/', desc: 'New car pricing and dealer invoice info' }
        ]
    },
    
    'modifications-performance': {
        related: [
            { title: 'Performance Upgrades', url: '/categories/performance-upgrades.html', icon: '🏎️' },
            { title: 'Aesthetic Mods', url: '/categories/aesthetic-mods.html', icon: '✨' },
            { title: 'Audio & Electronics', url: '/categories/audio-electronics.html', icon: '🔊' },
            { title: 'Wheels & Tires', url: '/categories/wheels-tires.html', icon: '🛞' },
            { title: 'DIY Tutorials', url: '/categories/diy-tutorials.html', icon: '🛠️' }
        ],
        external: [
            { title: 'Summit Racing', url: 'https://www.summitracing.com/', desc: 'Performance parts and accessories' },
            { title: 'Crutchfield', url: 'https://www.crutchfield.ca/', desc: 'Car audio and electronics' },
            { title: 'Tire Rack', url: 'https://www.tirerack.com/', desc: 'Wheels, tires, and reviews' },
            { title: 'Revscene', url: 'https://www.revscene.net/', desc: 'Canadian car modification community' }
        ]
    },
    
    'events-meetups': {
        related: [
            { title: 'Car Shows', url: '/categories/car-shows.html', icon: '🏆' },
            { title: 'Local Meetups', url: '/categories/local-meetups.html', icon: '👥' },
            { title: 'Track Days', url: '/categories/track-days.html', icon: '🏁' },
            { title: 'Car Cruises', url: '/categories/car-cruises.html', icon: '🚗' },
            { title: 'Regional Forums', url: '/categories/regional.html', icon: '🗺️' }
        ],
        external: [
            { title: 'Canadian Tire Motorsport Park', url: 'https://canadiantiremotorsportpark.com/', desc: 'Ontario racing circuit' },
            { title: 'Circuit Mont-Tremblant', url: 'https://www.circuitmttremblant.com/', desc: 'Quebec racing circuit' },
            { title: 'Cars & Coffee Canada', url: 'https://carsandcoffeecanada.com/', desc: 'Monthly car meetups nationwide' }
        ]
    },
    
    'brand-specific': {
        related: [
            { title: 'Toyota & Lexus', url: '/brands/toyota-lexus.html', icon: '🏷️' },
            { title: 'Honda & Acura', url: '/brands/honda-acura.html', icon: '🏷️' },
            { title: 'Ford & Lincoln', url: '/brands/ford-lincoln.html', icon: '🏷️' },
            { title: 'GM Brands', url: '/brands/gm-brands.html', icon: '🏷️' },
            { title: 'Tesla & EVs', url: '/brands/tesla-ev.html', icon: '⚡' },
            { title: 'European Brands', url: '/brands/european-brands.html', icon: '🏷️' }
        ],
        external: [
            { title: 'Edmunds Reviews', url: 'https://www.edmunds.com/', desc: 'Expert car reviews and ratings' },
            { title: 'Consumer Reports Autos', url: 'https://www.consumerreports.org/cars/', desc: 'Unbiased vehicle testing' }
        ]
    },
    
    'regional': {
        related: [
            { title: 'Ontario Forum', url: '/regions/ontario.html', icon: '🗺️' },
            { title: 'Quebec Forum', url: '/regions/quebec.html', icon: '🗺️' },
            { title: 'British Columbia Forum', url: '/regions/british-columbia.html', icon: '🗺️' },
            { title: 'Alberta Forum', url: '/regions/alberta.html', icon: '🗺️' },
            { title: 'Prairies Forum', url: '/regions/prairies.html', icon: '🗺️' },
            { title: 'Atlantic Canada Forum', url: '/regions/atlantic-canada.html', icon: '🗺️' }
        ],
        external: [
            { title: 'Transport Canada', url: 'https://tc.canada.ca/', desc: 'Federal transportation regulations' },
            { title: 'CAA Canada', url: 'https://www.caa.ca/', desc: 'Roadside assistance and travel services' }
        ]
    },
    
    'winter-driving': {
        related: [
            { title: 'Winter Tires', url: '/categories/winter-tires.html', icon: '🛞' },
            { title: 'Winter Preparation', url: '/categories/winter-preparation.html', icon: '❄️' },
            { title: 'Winter Driving Tips', url: '/categories/winter-driving-tips.html', icon: '🚗' },
            { title: 'Regional Forums', url: '/categories/regional.html', icon: '🗺️' }
        ],
        external: [
            { title: 'Tire and Rubber Association', url: 'https://www.tracanada.ca/winter-tires', desc: 'Winter tire regulations by province' },
            { title: 'Tire Rack Winter Guide', url: 'https://www.tirerack.com/winter/', desc: 'Winter tire reviews and ratings' }
        ]
    }
};

// Generate backlink HTML
function generateBacklinks(category, additionalLinks = []) {
    const data = backlinkData[category] || { related: [], external: [] };
    const allRelated = [...data.related, ...additionalLinks];
    
    let html = '<div class="backlinks-widget">';
    
    // Related Internal Links
    if (allRelated.length > 0) {
        html += '<div class="backlinks-section">';
        html += '<h3>📌 Related Topics</h3>';
        html += '<div class="backlinks-list">';
        
        allRelated.forEach(link => {
            html += `
                <a href="${link.url}" class="backlink-item">
                    <span class="backlink-icon">${link.icon || '📄'}</span>
                    <span class="backlink-title">${link.title}</span>
                    <span class="backlink-arrow">→</span>
                </a>
            `;
        });
        
        html += '</div></div>';
    }
    
    // External Resources
    if (data.external && data.external.length > 0) {
        html += '<div class="backlinks-section">';
        html += '<h3>🔗 Helpful Resources</h3>';
        html += '<div class="external-links">';
        
        data.external.forEach(link => {
            html += `
                <a href="${link.url}" class="external-link" target="_blank" rel="noopener">
                    <div class="external-link-title">${link.title}</div>
                    <div class="external-link-desc">${link.desc}</div>
                    <span class="external-icon">↗</span>
                </a>
            `;
        });
        
        html += '</div></div>';
    }
    
    // Popular Forum Threads
    html += `
        <div class="backlinks-section">
            <h3>🔥 Popular Discussions</h3>
            <div class="popular-threads">
                <a href="/forum.html" class="thread-link">
                    <span class="thread-title">Best winter tires for 2025</span>
                    <span class="thread-count">234 replies</span>
                </a>
                <a href="/forum.html" class="thread-link">
                    <span class="thread-title">DIY oil change guide</span>
                    <span class="thread-count">156 replies</span>
                </a>
                <a href="/forum.html" class="thread-link">
                    <span class="thread-title">Used car buying checklist</span>
                    <span class="thread-count">189 replies</span>
                </a>
                <a href="/forum.html" class="thread-link">
                    <span class="thread-title">Best mechanics in Toronto</span>
                    <span class="thread-count">298 replies</span>
                </a>
            </div>
        </div>
    `;
    
    // Quick Tools
    html += `
        <div class="backlinks-section">
            <h3>🛠️ Quick Tools</h3>
            <div class="quick-tools">
                <a href="/tools/comparison.html" class="tool-btn">
                    <span>⚖️</span> Compare Cars
                </a>
                <a href="/tools/financing.html" class="tool-btn">
                    <span>💰</span> Financing
                </a>
                <a href="/tools/mechanic-finder.html" class="tool-btn">
                    <span>🔍</span> Find Mechanic
                </a>
                <a href="/tools/maintenance-tracker.html" class="tool-btn">
                    <span>📊</span> Track Maintenance
                </a>
            </div>
        </div>
    `;
    
    html += '</div>'; // Close backlinks-widget
    
    return html;
}

// Load backlinks on page load
document.addEventListener('DOMContentLoaded', function() {
    const backlinkContainer = document.getElementById('backlinks-container');
    if (backlinkContainer) {
        const category = backlinkContainer.getAttribute('data-category');
        backlinkContainer.innerHTML = generateBacklinks(category);
    }
});

