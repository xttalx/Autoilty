// Main JavaScript for Autoilty.com

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    }
}

// Load trending discussions on homepage
document.addEventListener('DOMContentLoaded', function() {
    loadTrendingDiscussions();
    loadLatestQA();
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
        <a href="forum/thread.html?id=${d.id}" class="discussion-item">
            <div class="discussion-avatar">${d.author.charAt(0)}</div>
            <div class="discussion-content">
                <div class="discussion-title">${d.title}</div>
                <div class="discussion-meta">
                    Posted by ${d.author} • ${d.category} • ${d.timeAgo}
                </div>
            </div>
            <div class="discussion-stats">
                <div class="stat-item">👍 ${d.likes}</div>
                <div class="stat-item">💬 ${d.replies}</div>
                <div class="stat-item">👁️ ${d.views}</div>
            </div>
        </a>
    `).join('');
}

function loadLatestQA() {
    const container = document.getElementById('latestQA');
    if (!container) return;
    
    const questions = window.forumData?.qa || [];
    
    if (questions.length === 0) {
        container.innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--text-secondary);">Loading questions...</p>';
        return;
    }
    
    container.innerHTML = questions.map(q => `
        <a href="qa/question.html?id=${q.id}" class="qa-item">
            <div class="qa-question">${q.question}</div>
            <div class="qa-info">
                <span>${q.author}</span>
                <span>${q.answers} answers</span>
                <span>${q.timeAgo}</span>
                ${q.solved ? '<span style="color: var(--primary); font-weight: 600;">✓ Solved</span>' : ''}
            </div>
        </a>
    `).join('');
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

