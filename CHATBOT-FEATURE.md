# Forum Chat Assistant Feature

## Overview
The Autoilty forum now includes an intelligent chatbot assistant that helps users find relevant discussions and get quick answers to their automotive questions.

## Features

### 🔥 Hot Topics Section
- Displays the most popular and trending discussions
- Eye-catching gradient design with fire emojis
- Shows key metrics: replies, views, and last post time
- Categorized tags for easy topic identification
- Responsive grid layout (3 columns on desktop, 2 on tablet, 1 on mobile)

### 💬 Chat Assistant
- **Floating Chat Button**: Always visible in the bottom-right corner with a pulsing "Ask me!" badge
- **Smart Conversation**: Understands natural language queries about cars and automotive topics
- **Keyword Matching**: Intelligently searches discussions based on keywords
- **Auto-Redirect**: Can redirect users to specific discussion threads
- **Quick Suggestions**: Provides clickable suggestion buttons for common actions
- **Typing Indicator**: Shows when the bot is "thinking"
- **Message History**: Keeps track of conversation within the session

## How the Chatbot Works

### Keyword Detection
The chatbot analyzes user input for keywords and matches them against:
- Discussion titles
- Tags
- Categories
- Custom keywords defined in the data

### Topic-Specific Responses

1. **Oil Change / Maintenance**
   - Provides general maintenance advice
   - Links to relevant DIY guides

2. **Winter Tires**
   - Canadian-specific tire recommendations
   - Links to winter tire discussion threads

3. **Electric Vehicles (EV)**
   - Information about range, charging, winter performance
   - Links to EV comparison threads

4. **Buying Advice**
   - Budget considerations
   - Links to buying guides and negotiation tips

5. **Mechanic Recommendations**
   - Directs to mechanic finder tool
   - Links to mechanic review section

### Smart Search
When a user asks a question, the chatbot:
1. Extracts keywords from the query
2. Searches all discussions (hot topics + regular threads)
3. Scores matches based on:
   - Title match (10 points)
   - Keyword match (5 points each)
   - Category match (3 points)
   - Tag match (3 points each)
4. Returns the best matches with links

## Files Added/Modified

### New Files
- `js/chatbot.js` - Complete chatbot logic and conversation handling
- `CHATBOT-FEATURE.md` - This documentation file

### Modified Files
- `forum.html` - Added hot topics section and chat widget HTML
- `js/forum.js` - Added `loadHotTopics()` function
- `js/forum-data.js` - Added hot topics data with keywords
- `css/forum.css` - Added all chat widget and hot topics styling

## Usage Examples

### Example Queries
1. **"Tell me about winter tires"**
   - Bot responds with winter tire info and links to the hot topic

2. **"I need help with oil change"**
   - Bot provides maintenance tips and links to DIY guide

3. **"Best budget SUV"**
   - Bot links to the budget SUV discussion thread

4. **"Electric car winter range"**
   - Bot provides EV info and links to winter range discussion

5. **"Show me hot topics"**
   - Bot displays current trending discussions

## Customization

### Adding New Keywords
Edit `js/forum-data.js` and add keywords array to any discussion:

```javascript
{
    id: 101,
    title: "Your Discussion Title",
    keywords: ["keyword1", "keyword2", "topic", "phrase"]
}
```

### Adding New Bot Responses
Edit `js/chatbot.js` in the `processUserMessage()` function:

```javascript
if (lowerMessage.match(/\b(your|keywords|here)\b/)) {
    addBotMessage(
        "Your response here",
        [{ id: 'action-id', text: 'Button Text' }]
    );
    return;
}
```

### Styling Customization
All chat widget styles are in `css/forum.css` under the "Chat Widget Styles" section.

Key CSS variables you can customize:
- Primary gradient: `linear-gradient(135deg, #E2231A 0%, #ff6b6b 100%)`
- Chat widget width: `380px` (desktop)
- Chat widget height: `600px` (desktop)

## Browser Compatibility
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Design
- **Desktop (>1024px)**: Full chat widget, 3-column hot topics grid
- **Tablet (769-1024px)**: Adjusted chat widget, 2-column hot topics grid
- **Mobile (<768px)**: Full-screen chat widget, single-column layout

## Future Enhancements
- [ ] Integrate with actual backend API for real-time data
- [ ] Add user authentication for personalized responses
- [ ] Implement conversation memory across sessions
- [ ] Add multi-language support
- [ ] Voice input capability
- [ ] Integration with AI services (OpenAI, etc.) for more advanced responses
- [ ] Analytics tracking for popular queries
- [ ] Admin panel to manage bot responses

## Technical Notes

### No Dependencies
The chatbot is built with vanilla JavaScript and requires no external libraries.

### Local Storage
Currently uses browser's local storage for:
- Saving forum threads
- Future: Can store chat history

### Performance
- Lightweight (~8KB for chatbot.js)
- Lazy-loaded (only when user interacts)
- Efficient keyword matching algorithm
- Smooth animations with CSS transitions

## Support
For issues or feature requests, contact the development team or open an issue in the project repository.

