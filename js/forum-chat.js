/**
 * AUTOILTY FORUM CHAT SYSTEM
 * Real-time forum discussions and user messaging
 */

// Mock current user (in production, this would come from authentication)
const currentUser = {
    id: 'user-' + Math.random().toString(36).substr(2, 9),
    username: 'Guest' + Math.floor(Math.random() * 1000),
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('Guest')}&background=E2231A&color=fff`,
    isOnline: true
};

// Store messages in localStorage for persistence
const STORAGE_KEY = 'autoilty_forum_messages';
const CONVERSATIONS_KEY = 'autoilty_conversations';

// Initialize chat system
class ForumChatSystem {
    constructor() {
        this.messages = this.loadMessages();
        this.conversations = this.loadConversations();
        this.activeUsers = this.generateActiveUsers();
        this.setupEventListeners();
        this.startPresenceUpdate();
    }

    loadMessages() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : this.generateInitialMessages();
    }

    loadConversations() {
        const stored = localStorage.getItem(CONVERSATIONS_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    saveMessages() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.messages));
    }

    saveConversations() {
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(this.conversations));
    }

    generateActiveUsers() {
        return [
            { id: '1', username: 'CarEnthusiast123', avatar: 'https://ui-avatars.com/api/?name=CarEnthusiast123&background=2196F3&color=fff', isOnline: true, lastSeen: Date.now() },
            { id: '2', username: 'TechMike_Mech', avatar: 'https://ui-avatars.com/api/?name=TechMike&background=4CAF50&color=fff', isOnline: true, lastSeen: Date.now() },
            { id: '3', username: 'TorontoDriver', avatar: 'https://ui-avatars.com/api/?name=Toronto&background=FF9800&color=fff', isOnline: true, lastSeen: Date.now() },
            { id: '4', username: 'VancouverGuy', avatar: 'https://ui-avatars.com/api/?name=Vancouver&background=9C27B0&color=fff', isOnline: false, lastSeen: Date.now() - 300000 },
            { id: '5', username: 'AlbertaTrucks', avatar: 'https://ui-avatars.com/api/?name=Alberta&background=F44336&color=fff', isOnline: true, lastSeen: Date.now() },
            { id: '6', username: 'MTLDriver', avatar: 'https://ui-avatars.com/api/?name=MTL&background=00BCD4&color=fff', isOnline: false, lastSeen: Date.now() - 600000 },
        ];
    }

    generateInitialMessages() {
        return [
            {
                id: 'm1',
                threadId: 'winter-tires-2025',
                userId: '2',
                username: 'TechMike_Mech',
                avatar: 'https://ui-avatars.com/api/?name=TechMike&background=4CAF50&color=fff',
                message: 'Just installed Michelin X-Ice on my Civic. Night and day difference!',
                timestamp: Date.now() - 3600000,
                likes: 5,
                replies: []
            },
            {
                id: 'm2',
                threadId: 'winter-tires-2025',
                userId: '1',
                username: 'CarEnthusiast123',
                avatar: 'https://ui-avatars.com/api/?name=CarEnthusiast123&background=2196F3&color=fff',
                message: 'How do they compare to Bridgestone Blizzaks? Been using those for years.',
                timestamp: Date.now() - 3000000,
                likes: 2,
                replies: []
            },
            {
                id: 'm3',
                threadId: 'winter-tires-2025',
                userId: '5',
                username: 'AlbertaTrucks',
                avatar: 'https://ui-avatars.com/api/?name=Alberta&background=F44336&color=fff',
                message: 'For Alberta winters (-40C), I swear by Nokian Hakkapeliitta. Nothing else comes close.',
                timestamp: Date.now() - 1800000,
                likes: 8,
                replies: []
            }
        ];
    }

    setupEventListeners() {
        // Thread chat input
        const threadInput = document.getElementById('thread-message-input');
        const threadSend = document.getElementById('thread-send-btn');
        
        if (threadInput && threadSend) {
            threadSend.addEventListener('click', () => this.sendThreadMessage());
            threadInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendThreadMessage();
                }
            });
        }

        // Private message input
        const pmInput = document.getElementById('pm-message-input');
        const pmSend = document.getElementById('pm-send-btn');
        
        if (pmInput && pmSend) {
            pmSend.addEventListener('click', () => this.sendPrivateMessage());
            pmInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendPrivateMessage();
                }
            });
        }

        // Community chat input
        const communityInput = document.getElementById('community-chat-input');
        const communitySend = document.getElementById('community-send-btn');
        
        if (communityInput && communitySend) {
            communitySend.addEventListener('click', () => this.sendCommunityMessage());
            communityInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendCommunityMessage();
                }
            });
        }
    }

    sendThreadMessage() {
        const input = document.getElementById('thread-message-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        const newMessage = {
            id: 'm' + Date.now(),
            threadId: 'current-thread',
            userId: currentUser.id,
            username: currentUser.username,
            avatar: currentUser.avatar,
            message: message,
            timestamp: Date.now(),
            likes: 0,
            replies: []
        };
        
        this.messages.push(newMessage);
        this.saveMessages();
        this.renderThreadMessages();
        
        input.value = '';
        
        // Simulate other users responding
        setTimeout(() => this.simulateResponse(), Math.random() * 5000 + 2000);
    }

    sendPrivateMessage() {
        const input = document.getElementById('pm-message-input');
        const message = input.value.trim();
        const conversationId = document.getElementById('pm-conversation-id')?.value;
        
        if (!message || !conversationId) return;
        
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (!conversation) return;
        
        const newMessage = {
            id: 'pm' + Date.now(),
            userId: currentUser.id,
            username: currentUser.username,
            message: message,
            timestamp: Date.now(),
            read: false
        };
        
        conversation.messages.push(newMessage);
        conversation.lastMessage = message;
        conversation.lastTimestamp = Date.now();
        
        this.saveConversations();
        this.renderConversationMessages(conversationId);
        
        input.value = '';
        
        // Simulate reply
        setTimeout(() => this.simulatePrivateReply(conversationId), Math.random() * 4000 + 1000);
    }

    sendCommunityMessage() {
        const input = document.getElementById('community-chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        const chatContainer = document.getElementById('community-chat-messages');
        if (!chatContainer) return;
        
        const messageEl = this.createChatMessage({
            userId: currentUser.id,
            username: currentUser.username,
            avatar: currentUser.avatar,
            message: message,
            timestamp: Date.now()
        });
        
        chatContainer.appendChild(messageEl);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        input.value = '';
        
        // Simulate other users chatting
        setTimeout(() => this.simulateCommunityChat(), Math.random() * 3000 + 1000);
    }

    simulateResponse() {
        const responses = [
            'Great point! I totally agree.',
            'Thanks for sharing your experience!',
            'Have you tried comparing with other brands?',
            'What model year is your vehicle?',
            'Interesting perspective. In my experience...',
            'I had the same issue last winter.',
            'Could you share more details about that?',
            '+1 for this recommendation'
        ];
        
        const randomUser = this.activeUsers[Math.floor(Math.random() * this.activeUsers.length)];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const newMessage = {
            id: 'm' + Date.now(),
            threadId: 'current-thread',
            userId: randomUser.id,
            username: randomUser.username,
            avatar: randomUser.avatar,
            message: randomResponse,
            timestamp: Date.now(),
            likes: 0,
            replies: []
        };
        
        this.messages.push(newMessage);
        this.saveMessages();
        this.renderThreadMessages();
    }

    simulatePrivateReply(conversationId) {
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (!conversation) return;
        
        const responses = [
            'Thanks for the message!',
            'That sounds good to me.',
            'Let me check and get back to you.',
            'Sure, I can help with that.',
            'Interesting! Tell me more.',
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const replyMessage = {
            id: 'pm' + Date.now(),
            userId: conversation.withUser.id,
            username: conversation.withUser.username,
            message: randomResponse,
            timestamp: Date.now(),
            read: false
        };
        
        conversation.messages.push(replyMessage);
        conversation.lastMessage = randomResponse;
        conversation.lastTimestamp = Date.now();
        
        this.saveConversations();
        this.renderConversationMessages(conversationId);
    }

    simulateCommunityChat() {
        const messages = [
            'Anyone going to the car show this weekend?',
            'Just picked up my new ride! 🚗',
            'What\'s the best oil for synthetic changes?',
            'Looking for mechanic recommendations in Toronto',
            'Snow tires installed and ready for winter!',
            'Check out my latest mod - posted in showcase',
            'Traffic on the 401 is brutal today',
            'Anyone know good detailing spots?'
        ];
        
        const randomUser = this.activeUsers.filter(u => u.isOnline)[Math.floor(Math.random() * this.activeUsers.filter(u => u.isOnline).length)];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        const chatContainer = document.getElementById('community-chat-messages');
        if (!chatContainer) return;
        
        const messageEl = this.createChatMessage({
            userId: randomUser.id,
            username: randomUser.username,
            avatar: randomUser.avatar,
            message: randomMessage,
            timestamp: Date.now()
        });
        
        chatContainer.appendChild(messageEl);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    renderThreadMessages() {
        const container = document.getElementById('thread-messages');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.messages.forEach(msg => {
            const messageEl = this.createThreadMessage(msg);
            container.appendChild(messageEl);
        });
        
        container.scrollTop = container.scrollHeight;
    }

    createThreadMessage(msg) {
        const div = document.createElement('div');
        div.className = 'thread-message';
        div.innerHTML = `
            <img src="${msg.avatar}" alt="${msg.username}" class="message-avatar">
            <div class="message-content">
                <div class="message-header">
                    <span class="message-username">${msg.username}</span>
                    <span class="message-time">${this.formatTime(msg.timestamp)}</span>
                </div>
                <div class="message-text">${this.escapeHtml(msg.message)}</div>
                <div class="message-actions">
                    <button class="message-action" onclick="forumChat.likeMessage('${msg.id}')">
                        <span>👍</span> <span class="like-count">${msg.likes}</span>
                    </button>
                    <button class="message-action" onclick="forumChat.replyToMessage('${msg.id}')">
                        <span>💬</span> Reply
                    </button>
                </div>
            </div>
        `;
        return div;
    }

    createChatMessage(msg) {
        const div = document.createElement('div');
        div.className = 'chat-message' + (msg.userId === currentUser.id ? ' own-message' : '');
        div.innerHTML = `
            <img src="${msg.avatar}" alt="${msg.username}" class="chat-avatar">
            <div class="chat-bubble">
                <div class="chat-username">${msg.username}</div>
                <div class="chat-text">${this.escapeHtml(msg.message)}</div>
                <div class="chat-time">${this.formatTime(msg.timestamp)}</div>
            </div>
        `;
        return div;
    }

    renderActiveUsers() {
        const container = document.getElementById('active-users-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.activeUsers.forEach(user => {
            const userEl = document.createElement('div');
            userEl.className = 'active-user-item';
            userEl.innerHTML = `
                <img src="${user.avatar}" alt="${user.username}" class="user-avatar-small">
                <div class="user-info">
                    <div class="user-name">${user.username}</div>
                    <div class="user-status ${user.isOnline ? 'online' : 'offline'}">
                        ${user.isOnline ? '🟢 Online' : '⚪ ' + this.formatTime(user.lastSeen)}
                    </div>
                </div>
                <button class="btn-message" onclick="forumChat.startConversation('${user.id}')">💬</button>
            `;
            container.appendChild(userEl);
        });
    }

    startConversation(userId) {
        const user = this.activeUsers.find(u => u.id === userId);
        if (!user) return;
        
        let conversation = this.conversations.find(c => c.withUser.id === userId);
        
        if (!conversation) {
            conversation = {
                id: 'conv' + Date.now(),
                withUser: user,
                messages: [],
                lastMessage: '',
                lastTimestamp: Date.now(),
                unread: 0
            };
            this.conversations.push(conversation);
            this.saveConversations();
        }
        
        this.openConversation(conversation.id);
    }

    openConversation(conversationId) {
        // Show conversation modal or panel
        const modal = document.getElementById('conversation-modal');
        if (modal) {
            modal.style.display = 'flex';
            this.renderConversationMessages(conversationId);
        }
    }

    renderConversationMessages(conversationId) {
        const container = document.getElementById('conversation-messages');
        const titleEl = document.getElementById('conversation-title');
        const idInput = document.getElementById('pm-conversation-id');
        
        if (!container) return;
        
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (!conversation) return;
        
        if (titleEl) titleEl.textContent = conversation.withUser.username;
        if (idInput) idInput.value = conversationId;
        
        container.innerHTML = '';
        
        conversation.messages.forEach(msg => {
            const messageEl = this.createChatMessage({
                ...msg,
                avatar: msg.userId === currentUser.id ? currentUser.avatar : conversation.withUser.avatar
            });
            container.appendChild(messageEl);
        });
        
        container.scrollTop = container.scrollHeight;
    }

    likeMessage(messageId) {
        const message = this.messages.find(m => m.id === messageId);
        if (message) {
            message.likes++;
            this.saveMessages();
            this.renderThreadMessages();
        }
    }

    replyToMessage(messageId) {
        const input = document.getElementById('thread-message-input');
        if (input) {
            input.focus();
            input.placeholder = `Replying to message...`;
        }
    }

    formatTime(timestamp) {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    startPresenceUpdate() {
        setInterval(() => {
            // Randomly update user online status
            this.activeUsers.forEach(user => {
                if (Math.random() > 0.95) {
                    user.isOnline = !user.isOnline;
                    user.lastSeen = Date.now();
                }
            });
            this.renderActiveUsers();
        }, 10000);
    }
}

// Initialize when DOM is ready
let forumChat;
document.addEventListener('DOMContentLoaded', () => {
    forumChat = new ForumChatSystem();
    forumChat.renderThreadMessages();
    forumChat.renderActiveUsers();
    
    // Simulate community chat messages periodically
    setInterval(() => {
        if (Math.random() > 0.7 && document.getElementById('community-chat-messages')) {
            forumChat.simulateCommunityChat();
        }
    }, 15000);
});

