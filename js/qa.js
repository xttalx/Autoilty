// Q&A Page JavaScript

let allQuestions = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
    // Expand Q&A data with more questions
    allQuestions = [
        ...(window.forumData?.qa || []),
        { id: 5, question: "Best oil for Toyota Camry 2020?", author: "ToyotaOwner", answers: 9, timeAgo: "2 hours ago", solved: true, category: "Maintenance", views: 234 },
        { id: 6, question: "Transmission slipping - what to check first?", author: "TransmissionTrouble", answers: 14, timeAgo: "4 hours ago", solved: true, category: "Repair", views: 567 },
        { id: 7, question: "Is the Ford F-150 good for Canadian winters?", author: "WinterDriver", answers: 21, timeAgo: "6 hours ago", solved: false, category: "Buying", views: 892 },
        { id: 8, question: "How to install winter tires myself?", author: "DIYer", answers: 7, timeAgo: "8 hours ago", solved: true, category: "DIY", views: 445 },
        { id: 9, question: "Check engine light - P0420 code meaning?", author: "CodeChecker", answers: 16, timeAgo: "1 day ago", solved: true, category: "Diagnostics", views: 1234 },
        { id: 10, question: "Best affordable AWD SUV for family?", author: "FamilyMan", answers: 28, timeAgo: "1 day ago", solved: false, category: "Buying", views: 1567 },
        { id: 11, question: "Brake pads vs brake rotors - when to replace?", author: "BrakeQuestion", answers: 11, timeAgo: "2 days ago", solved: true, category: "Maintenance", views: 678 },
        { id: 12, question: "Tesla Model 3 worth it in Canada?", author: "EVCurious", answers: 34, timeAgo: "2 days ago", solved: false, category: "Electric", views: 2134 },
        { id: 13, question: "Strange vibration at highway speeds", author: "VibratingCar", answers: 13, timeAgo: "3 days ago", solved: true, category: "Repair", views: 789 },
        { id: 14, question: "When to use synthetic vs conventional oil?", author: "OilConfused", answers: 19, timeAgo: "3 days ago", solved: true, category: "Maintenance", views: 1023 },
        { id: 15, question: "Is extended warranty worth it?", author: "WarrantyQuestion", answers: 25, timeAgo: "4 days ago", solved: false, category: "Buying", views: 1456 }
    ];
    
    loadQuestions();
});

function loadQuestions() {
    const container = document.getElementById('questionsList');
    if (!container) return;
    
    let questions = allQuestions;
    
    // Apply filter
    if (currentFilter === 'solved') {
        questions = questions.filter(q => q.solved);
    } else if (currentFilter === 'unsolved') {
        questions = questions.filter(q => !q.solved);
    } else if (currentFilter === 'popular') {
        questions = [...questions].sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    
    container.innerHTML = questions.map(q => `
        <div class="question-item">
            <div class="question-header">
                <div class="question-title">${q.question}</div>
                ${q.solved ? '<span class="question-solved">✓ Solved</span>' : ''}
            </div>
            <div class="question-meta">
                <span>Asked by <strong>${q.author}</strong></span>
                <span>${q.timeAgo}</span>
                ${q.category ? `<span>in ${q.category}</span>` : ''}
            </div>
            <div class="question-footer">
                <div class="question-tags">
                    ${(q.category ? ['#' + q.category] : []).map(tag => `<span class="qa-tag">${tag}</span>`).join('')}
                </div>
                <div class="question-stats">
                    <span>💬 ${q.answers} answers</span>
                    ${q.views ? `<span>👁️ ${q.views} views</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function filterQA(filter) {
    currentFilter = filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadQuestions();
}

function searchQuestions() {
    const searchTerm = document.getElementById('qaSearch').value.toLowerCase();
    const container = document.getElementById('questionsList');
    
    if (!searchTerm) {
        loadQuestions();
        return;
    }
    
    const filtered = allQuestions.filter(q => 
        q.question.toLowerCase().includes(searchTerm) ||
        q.author.toLowerCase().includes(searchTerm) ||
        (q.category && q.category.toLowerCase().includes(searchTerm))
    );
    
    if (filtered.length === 0) {
        container.innerHTML = '<p style="padding: 3rem; text-align: center; color: var(--text-secondary);">No questions found. Try different keywords.</p>';
        return;
    }
    
    container.innerHTML = filtered.map(q => `
        <div class="question-item">
            <div class="question-header">
                <div class="question-title">${q.question}</div>
                ${q.solved ? '<span class="question-solved">✓ Solved</span>' : ''}
            </div>
            <div class="question-meta">
                <span>Asked by <strong>${q.author}</strong></span>
                <span>${q.timeAgo}</span>
                ${q.category ? `<span>in ${q.category}</span>` : ''}
            </div>
            <div class="question-footer">
                <div class="question-tags">
                    ${(q.category ? ['#' + q.category] : []).map(tag => `<span class="qa-tag">${tag}</span>`).join('')}
                </div>
                <div class="question-stats">
                    <span>💬 ${q.answers} answers</span>
                    ${q.views ? `<span>👁️ ${q.views} views</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function askQuestion() {
    alert('Ask a question feature coming soon! This is a demonstration version.');
}

