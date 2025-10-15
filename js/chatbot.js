// Chatbot for Autoilty Forum
// Provides instant answers and redirects to relevant discussions

let chatHistory = [];
let chatOpen = false;

// Initialize chatbot
document.addEventListener('DOMContentLoaded', function() {
    initChatbot();
});

function initChatbot() {
    // Add welcome message after a delay
    setTimeout(() => {
        addBotMessage("👋 Hi! I'm your Autoilty assistant. Ask me anything about cars or topics in our forum!");
    }, 1000);
}

function toggleChat() {
    chatOpen = !chatOpen;
    const chatWidget = document.getElementById('chatWidget');
    const chatButton = document.getElementById('chatToggleBtn');
    
    if (chatOpen) {
        chatWidget.classList.add('open');
        chatButton.style.display = 'none';
    } else {
        chatWidget.classList.remove('open');
        chatButton.style.display = 'flex';
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addUserMessage(message);
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message and respond
    setTimeout(() => {
        hideTypingIndicator();
        processUserMessage(message);
    }, 800);
}

function addUserMessage(message) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageEl = document.createElement('div');
    messageEl.className = 'chat-message user-message';
    messageEl.innerHTML = `
        <div class="message-content">${escapeHtml(message)}</div>
    `;
    messagesContainer.appendChild(messageEl);
    scrollToBottom();
    
    chatHistory.push({ role: 'user', message });
}

function addBotMessage(message, suggestions = []) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageEl = document.createElement('div');
    messageEl.className = 'chat-message bot-message';
    
    let suggestionsHtml = '';
    if (suggestions.length > 0) {
        suggestionsHtml = `
            <div class="chat-suggestions">
                ${suggestions.map(s => `<button class="suggestion-btn" onclick="handleSuggestion('${s.id}')">${s.text}</button>`).join('')}
            </div>
        `;
    }
    
    messageEl.innerHTML = `
        <div class="bot-avatar">🤖</div>
        <div class="message-content">${message}${suggestionsHtml}</div>
    `;
    messagesContainer.appendChild(messageEl);
    scrollToBottom();
    
    chatHistory.push({ role: 'bot', message });
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const indicator = document.createElement('div');
    indicator.className = 'chat-message bot-message typing-indicator';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = `
        <div class="bot-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    messagesContainer.appendChild(indicator);
    scrollToBottom();
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function processUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for greetings
    if (lowerMessage.match(/\b(hi|hello|hey|greetings)\b/)) {
        addBotMessage("Hello! 👋 How can I help you today? I can help you find discussions about cars, maintenance, buying advice, and more!");
        return;
    }
    
    // Check for help/what can you do
    if (lowerMessage.match(/\b(help|what can you do|how to use|commands)\b/)) {
        addBotMessage(
            "I can help you with:<br>• Finding relevant discussions<br>• Answering common car questions<br>• Redirecting you to hot topics<br>• Providing quick tips<br><br>Just ask me anything about cars or our forum topics!",
            [
                { id: 'hot', text: '🔥 Show Hot Topics' },
                { id: 'maintenance', text: '🔧 Maintenance Tips' },
                { id: 'buying', text: '🚗 Buying Advice' }
            ]
        );
        return;
    }
    
    // Search for matching discussions
    const matchedDiscussions = findRelevantDiscussions(lowerMessage);
    
    if (matchedDiscussions.length > 0) {
        const topMatch = matchedDiscussions[0];
        let response = `I found a relevant discussion that might help you!<br><br>`;
        response += `<strong>${topMatch.title}</strong><br>`;
        response += `Category: ${topMatch.category}<br>`;
        response += `${topMatch.replies} replies • ${formatNumber(topMatch.views)} views<br>`;
        
        const suggestions = [
            { id: `view-${topMatch.id}`, text: '👀 View Discussion' }
        ];
        
        if (matchedDiscussions.length > 1) {
            response += `<br>I also found ${matchedDiscussions.length - 1} other related discussion(s).`;
            suggestions.push({ id: 'more-results', text: '📋 Show More Results' });
        }
        
        addBotMessage(response, suggestions);
        
        // Store matched discussions for "show more" functionality
        window.lastMatchedDiscussions = matchedDiscussions;
        return;
    }
    
    // Provide topic-specific responses
    if (lowerMessage.match(/\b(oil change|oil|maintenance schedule)\b/)) {
        addBotMessage(
            "Regular oil changes are crucial! Most vehicles need oil changes every 5,000-10,000 km depending on the oil type and driving conditions.<br><br>💡 Check out our maintenance discussions for detailed guides!",
            [{ id: '103', text: '🔥 Oil Change DIY Guide' }]
        );
        return;
    }
    
    if (lowerMessage.match(/\b(winter tire|snow tire|winter)\b/)) {
        addBotMessage(
            "Winter tires are essential in Canada! They should be installed when temperatures consistently drop below 7°C.<br><br>🌨️ Check out our community's top recommendations!",
            [{ id: '106', text: '🔥 Winter Tire Recommendations' }]
        );
        return;
    }
    
    if (lowerMessage.match(/\b(electric|ev|electric vehicle|tesla|hybrid)\b/)) {
        addBotMessage(
            "Electric vehicles are gaining popularity in Canada! Range, charging infrastructure, and winter performance are key considerations.<br><br>⚡ Here are some hot discussions about EVs:",
            [
                { id: '101', text: '🔥 EV Winter Range Data' },
                { id: '104', text: '🔥 Tesla vs Polestar' }
            ]
        );
        return;
    }
    
    if (lowerMessage.match(/\b(buy|buying|purchase|should i buy|which car)\b/)) {
        addBotMessage(
            "Buying a car is a big decision! Consider your budget, needs (space, fuel economy), and long-term costs (insurance, maintenance).<br><br>🚗 Check out these popular buying discussions:",
            [
                { id: '102', text: '🔥 Best Budget SUVs' },
                { id: '105', text: '🔥 Negotiation Tips' }
            ]
        );
        return;
    }
    
    if (lowerMessage.match(/\b(mechanic|garage|repair shop|service)\b/)) {
        addBotMessage(
            "Finding a reliable mechanic is important! Check our mechanic reviews section where the community shares their experiences with local shops.",
            [{ id: 'mechanic-finder', text: '🔍 Find Mechanics Near You' }]
        );
        return;
    }
    
    if (lowerMessage.match(/\b(hot topics|trending|popular)\b/)) {
        showHotTopics();
        return;
    }
    
    // Default response with suggestions
    addBotMessage(
        "I'm not sure about that specific question, but I can help you search our forum! Try asking about:<br>• Car maintenance<br>• Buying advice<br>• Winter driving<br>• Electric vehicles<br>• Mechanic recommendations",
        [
            { id: 'hot', text: '🔥 Show Hot Topics' },
            { id: 'search-forum', text: '🔍 Search Forum' }
        ]
    );
}

function findRelevantDiscussions(query) {
    const allDiscussions = [
        ...(window.forumData?.hotTopics || []),
        ...(window.forumData?.threads || [])
    ];
    
    const matches = [];
    
    allDiscussions.forEach(discussion => {
        let score = 0;
        const keywords = discussion.keywords || [];
        
        // Check title match
        if (discussion.title.toLowerCase().includes(query)) {
            score += 10;
        }
        
        // Check keywords match
        keywords.forEach(keyword => {
            if (query.includes(keyword.toLowerCase())) {
                score += 5;
            }
        });
        
        // Check category match
        if (discussion.category.toLowerCase().includes(query)) {
            score += 3;
        }
        
        // Check tags match
        discussion.tags.forEach(tag => {
            if (query.includes(tag.toLowerCase())) {
                score += 3;
            }
        });
        
        if (score > 0) {
            matches.push({ ...discussion, score });
        }
    });
    
    // Sort by score (highest first)
    return matches.sort((a, b) => b.score - a.score);
}

function showHotTopics() {
    const hotTopics = window.forumData?.hotTopics || [];
    
    if (hotTopics.length === 0) {
        addBotMessage("No hot topics available right now. Check back later!");
        return;
    }
    
    let response = "🔥 <strong>Hot Topics Right Now:</strong><br><br>";
    hotTopics.slice(0, 3).forEach((topic, index) => {
        response += `${index + 1}. ${topic.title.replace('🔥 ', '')}<br>`;
    });
    
    const suggestions = hotTopics.slice(0, 3).map(topic => ({
        id: topic.id.toString(),
        text: `View: ${topic.tags[0]}`
    }));
    
    addBotMessage(response, suggestions);
}

function handleSuggestion(id) {
    // Handle special suggestion IDs
    if (id === 'hot') {
        showHotTopics();
        return;
    }
    
    if (id === 'search-forum') {
        addBotMessage("What would you like to search for? Just type your question or topic!");
        return;
    }
    
    if (id === 'maintenance') {
        processUserMessage('maintenance tips');
        return;
    }
    
    if (id === 'buying') {
        processUserMessage('buying advice');
        return;
    }
    
    if (id === 'mechanic-finder') {
        window.location.href = 'tools/mechanic-finder.html';
        return;
    }
    
    if (id === 'more-results') {
        showMoreResults();
        return;
    }
    
    // Handle view discussion
    if (id.startsWith('view-')) {
        const discussionId = id.replace('view-', '');
        redirectToDiscussion(discussionId);
        return;
    }
    
    // Handle hot topic IDs
    const topicId = parseInt(id);
    if (!isNaN(topicId)) {
        redirectToDiscussion(topicId);
    }
}

function redirectToDiscussion(id) {
    addBotMessage(`Redirecting you to the discussion... 🚀`);
    
    setTimeout(() => {
        // In a real implementation, this would go to the actual thread page
        window.location.href = `forum/thread.html?id=${id}`;
        // For now, show a message
        addBotMessage(`This would redirect to discussion #${id}. (Thread pages coming soon!)`);
    }, 500);
}

function showMoreResults() {
    if (!window.lastMatchedDiscussions || window.lastMatchedDiscussions.length <= 1) {
        addBotMessage("No additional results to show.");
        return;
    }
    
    let response = "<strong>Other Related Discussions:</strong><br><br>";
    window.lastMatchedDiscussions.slice(1, 4).forEach((discussion, index) => {
        response += `${index + 2}. ${discussion.title}<br>`;
    });
    
    const suggestions = window.lastMatchedDiscussions.slice(1, 4).map((discussion, index) => ({
        id: `view-${discussion.id}`,
        text: `View #${index + 2}`
    }));
    
    addBotMessage(response, suggestions);
}

// Enter key to send message
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Format numbers (reuse from forum.js)
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

