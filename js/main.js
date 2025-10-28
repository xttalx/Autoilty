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
document.addEventListener('DOMContentLoaded', function() {
    loadTrendingDiscussions();
    loadLatestNews();
    loadTopContributors();
});

function loadTrendingDiscussions() {
    const container = document.getElementById('trendingDiscussions');
    if (!container) return;
    
    const discussions = window.forumData?.trending || [];
    
    if (discussions.length === 0) {
        container.innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--text-secondary);">Loading discussions...</p>';
        return;
    }
    
    container.innerHTML = discussions.map(d => `
        <div class="trending-card" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: all 0.3s;" onmouseover="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'; this.style.transform='translateY(0)'">
            <div style="display: flex; gap: 16px; align-items: start;">
                <div style="font-size: 32px; width: 48px; height: 48px; background: linear-gradient(135deg, #E2231A, #ff6b6b); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">
                    ${d.author.charAt(0)}
                </div>
                <div style="flex: 1;">
                    <h3 style="font-size: 18px; color: #1a1a1a; margin-bottom: 8px; line-height: 1.4;">
                        <a href="forum.html" style="color: #1a1a1a; text-decoration: none;" onmouseover="this.style.color='#E2231A'" onmouseout="this.style.color='#1a1a1a'">${d.title}</a>
                    </h3>
                    <div style="display: flex; gap: 16px; align-items: center; color: #666; font-size: 14px; margin-bottom: 12px;">
                        <span>👤 ${d.author}</span>
                        <span>📂 ${d.category}</span>
                        <span>🕐 ${d.timeAgo}</span>
                    </div>
                    <div style="display: flex; gap: 24px; color: #999; font-size: 13px;">
                        <span>👍 ${d.likes}</span>
                        <span>💬 ${d.replies}</span>
                        <span>👁️ ${d.views}</span>
                    </div>
                </div>
            </div>
        </div>
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

