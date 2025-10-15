// Forum Page JavaScript

let currentPage = 1;
let threadsPerPage = 15;
let filteredThreads = [];

document.addEventListener('DOMContentLoaded', function() {
    loadHotTopics();
    loadCategories();
    loadThreads();
});

function loadHotTopics() {
    const grid = document.getElementById('hotTopicsGrid');
    if (!grid) return;
    
    const hotTopics = window.forumData?.hotTopics || [];
    
    grid.innerHTML = hotTopics.map(topic => `
        <a href="forum/thread.html?id=${topic.id}" class="hot-topic-card">
            <div class="hot-topic-header">
                <span class="hot-badge">🔥 HOT</span>
                <span class="hot-views">👁️ ${formatNumber(topic.views)}</span>
            </div>
            <div class="hot-topic-title">${topic.title}</div>
            <div class="hot-topic-meta">
                <span class="hot-author">by ${topic.author}</span>
                <span class="hot-category">${topic.category}</span>
            </div>
            <div class="hot-topic-stats">
                <span>💬 ${topic.replies} replies</span>
                <span>🕐 ${topic.lastPost}</span>
            </div>
            <div class="hot-topic-tags">
                ${topic.tags.slice(0, 3).map(tag => `<span class="hot-tag">${tag}</span>`).join('')}
            </div>
        </a>
    `).join('');
}

function loadCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    
    const categories = window.forumData?.categories || [];
    
    grid.innerHTML = categories.map(cat => `
        <a href="forum/category.html?id=${cat.id}" class="category-card" style="border-left-color: ${cat.color}">
            <div class="category-header">
                <div class="category-icon">${cat.icon}</div>
                <div>
                    <div class="category-name">${cat.name}</div>
                    <div class="category-description">${cat.description}</div>
                </div>
            </div>
            <div class="category-stats">
                <span>📝 ${formatNumber(cat.threads)} threads</span>
                <span>💬 ${formatNumber(cat.posts)} posts</span>
            </div>
        </a>
    `).join('');
}

function loadThreads() {
    filteredThreads = window.forumData?.threads || [];
    renderThreads();
}

function renderThreads() {
    const container = document.getElementById('threadsList');
    if (!container) return;
    
    // Pagination
    const start = (currentPage - 1) * threadsPerPage;
    const end = start + threadsPerPage;
    const paginatedThreads = filteredThreads.slice(start, end);
    
    if (paginatedThreads.length === 0) {
        container.innerHTML = '<p style="padding: 3rem; text-align: center; color: var(--text-secondary);">No discussions found</p>';
        return;
    }
    
    container.innerHTML = paginatedThreads.map(thread => `
        <a href="forum/thread.html?id=${thread.id}" class="thread-item ${thread.isPinned ? 'pinned' : ''}">
            <div class="thread-avatar">${thread.author.charAt(0)}</div>
            <div class="thread-content">
                <div class="thread-title">
                    ${thread.title}
                    <span class="thread-badges">
                        ${thread.isPinned ? '<span class="badge badge-pinned">📌 Pinned</span>' : ''}
                        ${thread.isLocked ? '<span class="badge badge-locked">🔒 Locked</span>' : ''}
                    </span>
                </div>
                <div class="thread-meta">
                    Posted by <strong>${thread.author}</strong> in <strong>${thread.category}</strong>
                </div>
                <div class="thread-tags">
                    ${thread.tags.map(tag => `<span class="thread-tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="thread-stats">
                <span>💬 ${thread.replies} replies</span>
                <span>👁️ ${formatNumber(thread.views)} views</span>
                <span>🕐 ${thread.lastPost}</span>
            </div>
        </a>
    `).join('');
    
    renderPagination();
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredThreads.length / threadsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    if (currentPage > 1) {
        html += `<button class="page-btn" onclick="changePage(${currentPage - 1})">← Prev</button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }
    
    if (totalPages > 5) {
        html += `<button class="page-btn">...</button>`;
    }
    
    // Next button
    if (currentPage < totalPages) {
        html += `<button class="page-btn" onclick="changePage(${currentPage + 1})">Next →</button>`;
    }
    
    pagination.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    renderThreads();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterThreads() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    let threads = window.forumData?.threads || [];
    
    if (categoryFilter) {
        threads = threads.filter(t => t.category.toLowerCase().includes(categoryFilter));
    }
    
    filteredThreads = threads;
    currentPage = 1;
    renderThreads();
}

function sortThreads() {
    const sortBy = document.getElementById('sortBy').value;
    
    switch(sortBy) {
        case 'popular':
            filteredThreads.sort((a, b) => b.views - a.views);
            break;
        case 'replies':
            filteredThreads.sort((a, b) => b.replies - a.replies);
            break;
        default: // recent
            filteredThreads.sort((a, b) => b.id - a.id);
    }
    
    renderThreads();
}

function searchForum() {
    const searchTerm = document.getElementById('forumSearch').value.toLowerCase();
    let threads = window.forumData?.threads || [];
    
    if (searchTerm) {
        threads = threads.filter(t => 
            t.title.toLowerCase().includes(searchTerm) ||
            t.author.toLowerCase().includes(searchTerm) ||
            t.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    filteredThreads = threads;
    currentPage = 1;
    renderThreads();
}

function showNewThreadModal() {
    alert('New thread feature coming soon! For now, this is a demonstration.');
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

