/**
 * AI Chat Widget for Autoilty.com
 * Floating, draggable chat interface with Canadian auto expertise
 * Supports EN/FR, authentication flow, and smart redirects
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './ChatWidget.css';

const ChatWidget = ({ category, province }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth - 400, y: window.innerHeight - 600 });
    const [isDragging, setIsDragging] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const messagesEndRef = useRef(null);
    const chatRef = useRef(null);
    const dragStartPos = useRef({ x: 0, y: 0 });

    // Initialize chat with welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMessage = {
                id: Date.now(),
                type: 'bot',
                text: t('chat.welcome', { 
                    category: category || 'General Discussion',
                    province: province || 'Canada'
                }),
                timestamp: new Date(),
                quickReplies: [
                    { id: 'winter', text: t('chat.quickReplies.winter'), icon: '❄️' },
                    { id: 'maintenance', text: t('chat.quickReplies.maintenance'), icon: '🔧' },
                    { id: 'buying', text: t('chat.quickReplies.buying'), icon: '🚗' },
                    { id: 'recall', text: t('chat.quickReplies.recall'), icon: '⚠️' }
                ]
            };
            setMessages([welcomeMessage]);
        }
    }, [isOpen, messages.length, t, category, province]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Check authentication status
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
    }, []);

    // Drag handlers
    const handleDragStart = (e) => {
        setIsDragging(true);
        dragStartPos.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    const handleDrag = (e) => {
        if (!isDragging) return;
        
        const newX = e.clientX - dragStartPos.current.x;
        const newY = e.clientY - dragStartPos.current.y;
        
        // Keep within bounds
        const maxX = window.innerWidth - 400;
        const maxY = window.innerHeight - 600;
        
        setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY))
        });
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    // Send message to AI backend
    const sendMessage = async (text) => {
        if (!text.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: text,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Call AI API
            const response = await fetch('/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': i18n.language
                },
                body: JSON.stringify({
                    message: text,
                    category: category,
                    province: province,
                    sessionId: getSessionId(),
                    history: messages.slice(-5) // Last 5 messages for context
                })
            });

            const data = await response.json();
            
            // Add bot response
            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                text: data.response,
                timestamp: new Date(),
                confidence: data.confidence,
                sources: data.sources,
                suggestedThreads: data.suggestedThreads,
                requiresAuth: data.requiresAuth
            };

            setMessages(prev => [...prev, botMessage]);

            // Handle auth requirement
            if (data.requiresAuth && !isAuthenticated) {
                setTimeout(() => {
                    const authPromptMessage = {
                        id: Date.now() + 2,
                        type: 'bot',
                        text: t('chat.authRequired'),
                        timestamp: new Date(),
                        actionButtons: [
                            { 
                                id: 'login', 
                                text: t('chat.login'), 
                                action: () => handleLoginRedirect(text)
                            },
                            { 
                                id: 'register', 
                                text: t('chat.register'), 
                                action: () => handleRegisterRedirect(text)
                            }
                        ]
                    };
                    setMessages(prev => [...prev, authPromptMessage]);
                }, 500);
            }

        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                text: t('chat.error'),
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    // Handle quick reply
    const handleQuickReply = (replyId) => {
        const quickReplyTexts = {
            'winter': t('chat.quickReplyMessages.winter'),
            'maintenance': t('chat.quickReplyMessages.maintenance'),
            'buying': t('chat.quickReplyMessages.buying'),
            'recall': t('chat.quickReplyMessages.recall')
        };
        
        sendMessage(quickReplyTexts[replyId] || replyId);
    };

    // Handle login/register redirects
    const handleLoginRedirect = (context) => {
        localStorage.setItem('chatContext', JSON.stringify({
            message: context,
            returnUrl: window.location.pathname
        }));
        navigate('/login');
    };

    const handleRegisterRedirect = (context) => {
        localStorage.setItem('chatContext', JSON.stringify({
            message: context,
            returnUrl: window.location.pathname
        }));
        navigate('/register');
    };

    // Get or create session ID
    const getSessionId = () => {
        let sessionId = sessionStorage.getItem('chatSessionId');
        if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            sessionStorage.setItem('chatSessionId', sessionId);
        }
        return sessionId;
    };

    // Handle suggested thread click
    const handleThreadClick = (threadId) => {
        navigate(`/forum/thread/${threadId}`);
    };

    // Handle input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputValue);
        }
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        className="chat-toggle-button"
                        onClick={() => setIsOpen(true)}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <svg className="chat-icon" viewBox="0 0 24 24" fill="none">
                            <path 
                                d="M12 2C6.5 2 2 6.5 2 12C2 13.8 2.5 15.5 3.4 17L2 22L7 20.6C8.5 21.5 10.2 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" 
                                fill="currentColor"
                            />
                        </svg>
                        <span className="chat-badge">{t('chat.askMe')}</span>
                        <div className="chat-pulse" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={chatRef}
                        className="chat-widget"
                        style={{
                            left: position.x,
                            top: position.y
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Header */}
                        <div 
                            className="chat-header"
                            onMouseDown={handleDragStart}
                            onMouseMove={handleDrag}
                            onMouseUp={handleDragEnd}
                            onMouseLeave={handleDragEnd}
                            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                        >
                            <div className="chat-header-content">
                                <div className="chat-avatar">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" fill="#E2231A"/>
                                        <path d="M8 10C8 9.4 8.4 9 9 9C9.6 9 10 9.4 10 10C10 10.6 9.6 11 9 11C8.4 11 8 10.6 8 10Z" fill="white"/>
                                        <path d="M14 10C14 9.4 14.4 9 15 9C15.6 9 16 9.4 16 10C16 10.6 15.6 11 15 11C14.4 11 14 10.6 14 10Z" fill="white"/>
                                        <path d="M8 14C8 14 9 16 12 16C15 16 16 14 16 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="chat-title">{t('chat.title')}</div>
                                    <div className="chat-status">
                                        <span className="status-dot"></span>
                                        {t('chat.status')}
                                    </div>
                                </div>
                            </div>
                            <div className="chat-actions">
                                {/* Language toggle */}
                                <button
                                    className="chat-action-btn"
                                    onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en')}
                                    title={t('chat.switchLanguage')}
                                >
                                    {i18n.language === 'en' ? 'FR' : 'EN'}
                                </button>
                                {/* Minimize */}
                                <button
                                    className="chat-action-btn"
                                    onClick={() => setIsOpen(false)}
                                    title={t('chat.minimize')}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="chat-messages">
                            {messages.map((message) => (
                                <div 
                                    key={message.id} 
                                    className={`message message-${message.type}`}
                                >
                                    {message.type === 'bot' && (
                                        <div className="message-avatar">🤖</div>
                                    )}
                                    
                                    <div className="message-content">
                                        <div className="message-text">{message.text}</div>
                                        
                                        {/* Quick Replies */}
                                        {message.quickReplies && (
                                            <div className="quick-replies">
                                                {message.quickReplies.map((reply) => (
                                                    <button
                                                        key={reply.id}
                                                        className="quick-reply-btn"
                                                        onClick={() => handleQuickReply(reply.id)}
                                                    >
                                                        <span>{reply.icon}</span>
                                                        {reply.text}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        {message.actionButtons && (
                                            <div className="action-buttons">
                                                {message.actionButtons.map((button) => (
                                                    <button
                                                        key={button.id}
                                                        className="action-btn"
                                                        onClick={button.action}
                                                    >
                                                        {button.text}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Suggested Threads */}
                                        {message.suggestedThreads && (
                                            <div className="suggested-threads">
                                                <div className="suggested-title">{t('chat.relatedThreads')}</div>
                                                {message.suggestedThreads.map((thread) => (
                                                    <button
                                                        key={thread.id}
                                                        className="thread-suggestion"
                                                        onClick={() => handleThreadClick(thread.id)}
                                                    >
                                                        <span className="thread-icon">💬</span>
                                                        <span className="thread-title">{thread.title}</span>
                                                        <span className="thread-replies">{thread.replies} replies</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        <div className="message-time">
                                            {new Date(message.timestamp).toLocaleTimeString(i18n.language, { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="message message-bot">
                                    <div className="message-avatar">🤖</div>
                                    <div className="message-content">
                                        <div className="typing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="chat-input">
                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={t('chat.inputPlaceholder')}
                                rows="1"
                                maxLength="500"
                            />
                            <button
                                className="send-btn"
                                onClick={() => sendMessage(inputValue)}
                                disabled={!inputValue.trim() || isTyping}
                            >
                                <svg viewBox="0 0 24 24" fill="none">
                                    <path 
                                        d="M2 12L22 2L12 22L10 14L2 12Z" 
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="chat-footer">
                            <span>{t('chat.poweredBy')}</span>
                            <a href="/about" target="_blank">Autoilty AI</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatWidget;

