// Main JavaScript for Autoilty.com

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    }
}

// Auto Industry News Data
window.autoNews = {
    today: [
        {
            id: 'news1',
            title: 'Toyota Announces 2025 Hybrid Lineup with Increased Range',
            source: 'Autoblog',
            time: new Date().toISOString(),
            category: 'Hybrid',
            image: 'https://via.placeholder.com/400x250?text=Toyota+Hybrid+2025',
            summary: 'Toyota reveals new hybrid models with extended electric-only range and improved fuel efficiency.',
            url: 'https://www.autoblog.com'
        },
        {
            id: 'news2',
            title: 'Tesla Model 3 Price Reduction in Canada - Now Starting at $49,999',
            source: 'Driving.ca',
            time: new Date().toISOString(),
            category: 'EV',
            image: 'https://via.placeholder.com/400x250?text=Tesla+Model+3',
            summary: 'Tesla drops Model 3 prices by $2,000, making it more accessible to Canadian buyers.',
            url: 'https://www.driving.ca'
        },
        {
            id: 'news3',
            title: 'Honda Recalls 200,000 Vehicles in Canada Over Brake Issue',
            source: 'CBC Auto',
            time: new Date(Date.now() - 3600000).toISOString(),
            category: 'Recalls',
            image: 'https://via.placeholder.com/400x250?text=Honda+Recall',
            summary: 'Honda issues voluntary recall for certain 2022-2024 models due to potential brake malfunction.',
            url: 'https://www.cbc.ca'
        },
        {
            id: 'news4',
            title: 'Ford F-150 Lightning Production Doubles in 2024',
            source: 'Motor1',
            time: new Date(Date.now() - 7200000).toISOString(),
            category: 'Trucks',
            image: 'https://via.placeholder.com/400x250?text=Ford+F-150+Lightning',
            summary: 'Ford ramps up production of the F-150 Lightning electric pickup to meet growing demand.',
            url: 'https://www.motor1.com'
        },
        {
            id: 'news5',
            title: 'Highway 401 Electric Vehicle Charging Stations Opening Soon',
            source: 'Global News',
            time: new Date(Date.now() - 10800000).toISOString(),
            category: 'EV Infrastructure',
            image: 'https://via.placeholder.com/400x250?text=EV+Charging',
            summary: 'Ontario announces 50 new DC fast-charging stations along Highway 401 corridor.',
            url: 'https://globalnews.ca'
        },
        {
            id: 'news6',
            title: '2025 Honda CR-V Hybrid Gets 40 mpg Combined',
            source: 'Car and Driver',
            time: new Date(Date.now() - 14400000).toISOString(),
            category: 'SUV',
            image: 'https://via.placeholder.com/400x250?text=Honda+CR-V',
            summary: 'New CR-V Hybrid achieves impressive fuel economy ratings, setting new benchmark for compact SUVs.',
            url: 'https://www.caranddriver.com'
        }
    ]
};

// Load trending discussions on homepage
// Load Vehicle Listings for Homepage
function loadVehicleListingsHome() {
    const container = document.getElementById('vehicleListingsHome');
    if (!container) return;
    
    // Get listings from localStorage
    let listings = [];
    try {
        listings = JSON.parse(localStorage.getItem('autoilty_listings') || '[]');
    } catch (e) {
        console.error('Error loading listings:', e);
    }
    
    // Filter to only show vehicle listings (cars category)
    const vehicleListings = listings.filter(l => 
        l.category === 'cars' && 
        l.status !== 'sold' && 
        l.status !== 'expired'
    );
    
    // If no listings, create sample data
    if (vehicleListings.length === 0) {
        vehicleListings.push(
            {
                id: 'sample1',
                title: '2022 Honda Civic Sport',
                price: 28500,
                location: 'Toronto, ON',
                category: 'cars',
                images: ['https://via.placeholder.com/400x300?text=2022+Honda+Civic'],
                description: 'Excellent condition, low mileage, one owner',
                created: new Date(Date.now() - 86400000).toISOString(),
                views: 234,
                username: 'CarDealer123'
            },
            {
                id: 'sample2',
                title: '2021 Toyota RAV4 Hybrid',
                price: 35900,
                location: 'Vancouver, BC',
                category: 'cars',
                images: ['https://via.placeholder.com/400x300?text=2021+RAV4+Hybrid'],
                description: 'Fuel efficient, AWD, loaded with features',
                created: new Date(Date.now() - 172800000).toISOString(),
                views: 456,
                username: 'VancouverAutos'
            },
            {
                id: 'sample3',
                title: '2023 Ford F-150 XLT',
                price: 52000,
                location: 'Calgary, AB',
                category: 'cars',
                images: ['https://via.placeholder.com/400x300?text=2023+Ford+F-150'],
                description: 'Work truck, barely used, warranty remaining',
                created: new Date(Date.now() - 259200000).toISOString(),
                views: 189,
                username: 'TruckSales'
            },
            {
                id: 'sample4',
                title: '2020 Mazda CX-5 GT',
                price: 26900,
                location: 'Montreal, QC',
                category: 'cars',
                images: ['https://via.placeholder.com/400x300?text=2020+Mazda+CX-5'],
                description: 'Premium trim, leather seats, sunroof',
                created: new Date(Date.now() - 345600000).toISOString(),
                views: 312,
                username: 'MTLMotors'
            },
            {
                id: 'sample5',
                title: '2024 Tesla Model 3',
                price: 54999,
                location: 'Ottawa, ON',
                category: 'cars',
                images: ['https://via.placeholder.com/400x300?text=2024+Tesla+Model+3'],
                description: 'Brand new, never driven, factory warranty',
                created: new Date(Date.now() - 432000000).toISOString(),
                views: 567,
                username: 'EVDealer'
            },
            {
                id: 'sample6',
                title: '2021 Subaru Outback',
                price: 32500,
                location: 'Edmonton, AB',
                category: 'cars',
                images: ['https://via.placeholder.com/400x300?text=2021+Subaru+Outback'],
                description: 'Perfect for winter, AWD, low km',
                created: new Date(Date.now() - 518400000).toISOString(),
                views: 278,
                username: 'SubaruPro'
            }
        );
    }
    
    // Show max 8 listings
    const displayListings = vehicleListings.slice(0, 8);
    
    if (displayListings.length === 0) {
        container.innerHTML = `
            <div style="min-width: 100%; text-align: center; padding: 40px; background: rgba(255,255,255,0.1); border-radius: 12px; color: white;">
                <h3 style="margin: 0 0 16px 0; font-size: 24px;">No Active Listings</h3>
                <p style="margin: 0 0 24px 0; opacity: 0.9;">Be the first to post a vehicle listing!</p>
                <a href="categories/buying-selling.html" style="background: white; color: #27ae60; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                    Post Your Listing
                </a>
            </div>
        `;
        return;
    }
    
    // Render listings
    container.innerHTML = displayListings.map(listing => {
        const timeAgo = getTimeAgo(listing.created);
        const imageUrl = listing.images && listing.images[0] ? listing.images[0] : 'https://via.placeholder.com/400x300?text=No+Image';
        
        return `
            <div class="listing-card-home" onclick="window.location.href='listing.html?id=${listing.id}'" style="min-width: 320px; max-width: 320px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15); cursor: pointer; transition: all 0.3s;">
                <div style="position: relative;">
                    <img src="${imageUrl}" alt="${listing.title}" style="width: 100%; height: 200px; object-fit: cover;">
                    <div style="position: absolute; top: 12px; right: 12px; background: rgba(39, 174, 96, 0.95); color: white; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                        $${listing.price.toLocaleString()}
                    </div>
                    ${listing.views ? `
                        <div style="position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.7); color: white; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                            👁️ ${formatNumber(listing.views)} views
                        </div>
                    ` : ''}
                </div>
                <div style="padding: 16px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #1a1a1a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${listing.title}
                    </h3>
                    <p style="margin: 0 0 12px 0; color: #666; font-size: 13px; display: flex; align-items: center; gap: 6px;">
                        📍 ${listing.location}
                    </p>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #e0e0e0;">
                        <div style="font-size: 12px; color: #999;">
                            ${timeAgo}
                        </div>
                        <div style="font-size: 12px; color: #27ae60; font-weight: 600;">
                            View Details →
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Add hover effect
    const cards = container.querySelectorAll('.listing-card-home');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });
    });
}

// Scroll listings horizontally
function scrollListings(direction) {
    const container = document.querySelector('.listings-scroll');
    if (!container) return;
    
    const scrollAmount = 350; // Scroll by one card width + gap
    
    if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadTrendingDiscussions();
    loadLatestNews();
    loadTopContributors();
    loadVehicleListingsHome();
});

function loadTrendingDiscussions() {
    const container = document.getElementById('trendingDiscussions');
    if (!container) return;
    
    const news = window.autoNews?.today || [];
    
    if (news.length === 0) {
        container.innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--text-secondary);">Loading news...</p>';
        return;
    }
    
    // Show latest 4 news items in trending section
    const trendingNews = news.slice(0, 4);
    
    container.innerHTML = trendingNews.map(item => `
        <a href="${item.url}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit; display: block;">
            <div class="trending-card" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: all 0.3s; cursor: pointer;" onmouseover="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'; this.style.transform='translateY(0)'">
                <div style="display: flex; gap: 20px; align-items: start;">
                    <img src="${item.image}" alt="${item.title}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px; flex-shrink: 0;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                            <span style="background: #E2231A; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">${item.category}</span>
                            <span style="color: #666; font-size: 12px;">📰 ${item.source}</span>
                        </div>
                        <h3 style="font-size: 20px; color: #1a1a1a; margin-bottom: 12px; line-height: 1.4; font-weight: 600;">
                            ${item.title}
                        </h3>
                        <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">${item.summary}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: #999; font-size: 13px;">🕐 ${formatTime(item.time)}</span>
                            <span style="color: #E2231A; font-size: 13px; font-weight: 600;">Read full article →</span>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    `).join('');
}

function loadLatestNews() {
    const container = document.getElementById('latestNews');
    if (!container) return;
    
    const news = window.autoNews?.today || [];
    
    if (news.length === 0) {
        container.innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--text-secondary);">Loading news...</p>';
        return;
    }
    
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
            ${news.map(item => `
                <a href="${item.url}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit; display: block;">
                    <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: all 0.3s; cursor: pointer; height: 100%;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'">
                        <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 180px; object-fit: cover;">
                        <div style="padding: 20px;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                                <span style="background: #E2231A; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">${item.category}</span>
                                <span style="color: #666; font-size: 12px;">${item.source}</span>
                            </div>
                            <h3 style="font-size: 18px; color: #1a1a1a; margin-bottom: 12px; line-height: 1.4;">${item.title}</h3>
                            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">${item.summary}</p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: #999; font-size: 12px;">${formatTime(item.time)}</span>
                                <span style="color: #E2231A; font-size: 12px; font-weight: 600;">Read more →</span>
                            </div>
                        </div>
                    </div>
                </a>
            `).join('')}
        </div>
    `;
}

function loadTodayNews() {
    // Refresh news data
    loadLatestNews();
    loadTrendingDiscussions();
    alert('📰 News updated! Latest automotive industry updates loaded.');
}

function loadTopContributors() {
    const container = document.getElementById('topContributors');
    if (!container) return;
    
    const contributors = window.forumData?.contributors || [];
    
    container.innerHTML = contributors.map(c => `
        <div class="contributor">
            <div class="contributor-avatar" style="background: linear-gradient(135deg, ${c.color1}, ${c.color2})"></div>
            <div class="contributor-info">
                <div class="contributor-name">${c.name}</div>
                <div class="contributor-points">${c.points} points</div>
            </div>
        </div>
    `).join('');
}

// Utility functions
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return time.toLocaleDateString();
}

function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (let key in intervals) {
        const interval = Math.floor(seconds / intervals[key]);
        if (interval >= 1) {
            return interval + ' ' + key + (interval === 1 ? '' : 's') + ' ago';
        }
    }
    
    return 'Just now';
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

