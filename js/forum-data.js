// Forum Data - Scalable structure for auto community

window.forumData = {
    // Trending discussions for homepage
    trending: [
        {
            id: 1,
            title: "Best winter tires for 2024 - Canadian winters",
            author: "CanadianDriver",
            category: "Tires & Wheels",
            timeAgo: "2 hours ago",
            likes: 124,
            replies: 45,
            views: 3421
        },
        {
            id: 2,
            title: "Should I buy a Toyota Camry or Honda Accord?",
            author: "FirstTimeBuyer",
            category: "Buying Advice",
            timeAgo: "5 hours ago",
            likes: 89,
            replies: 67,
            views: 2156
        },
        {
            id: 3,
            title: "DIY: How to change your oil in 30 minutes",
            author: "MechanicMike",
            category: "Maintenance",
            timeAgo: "1 day ago",
            likes: 234,
            replies: 23,
            views: 5632
        },
        {
            id: 4,
            title: "Electric vs Hybrid - Real world comparison after 2 years",
            author: "EVOwner2022",
            category: "General Discussion",
            timeAgo: "1 day ago",
            likes: 156,
            replies: 91,
            views: 4321
        },
        {
            id: 5,
            title: "Warning: Avoid this mechanic in Toronto",
            author: "TorontoLocal",
            category: "Mechanic Reviews",
            timeAgo: "2 days ago",
            likes: 67,
            replies: 34,
            views: 1876
        }
    ],
    
    // Latest Q&A for homepage
    qa: [
        {
            id: 1,
            question: "Check engine light on - should I be worried?",
            author: "WorriedOwner",
            answers: 12,
            timeAgo: "1 hour ago",
            solved: true
        },
        {
            id: 2,
            question: "Best used SUV under $30,000 in Canada?",
            author: "BudgetBuyer",
            answers: 8,
            timeAgo: "3 hours ago",
            solved: false
        },
        {
            id: 3,
            question: "How often should I rotate my tires?",
            author: "NewDriver",
            answers: 15,
            timeAgo: "5 hours ago",
            solved: true
        },
        {
            id: 4,
            question: "Strange noise when braking - what could it be?",
            author: "ConcernedDriver",
            answers: 6,
            timeAgo: "1 day ago",
            solved: false
        }
    ],
    
    // Top contributors
    contributors: [
        { name: "MechanicPro", points: 15420, color1: "#E50914", color2: "#ff6b6b" },
        { name: "AutoExpert", points: 12350, color1: "#2563EB", color2: "#60a5fa" },
        { name: "CanadianGearhead", points: 9870, color1: "#10B981", color2: "#34d399" },
        { name: "TechSavvy", points: 8540, color1: "#F59E0B", color2: "#fbbf24" },
        { name: "VintageCollector", points: 7230, color1: "#8B5CF6", color2: "#a78bfa" }
    ],
    
    // Forum categories
    categories: [
        {
            id: "general",
            name: "General Discussion",
            description: "Talk about anything automotive",
            icon: "💬",
            threads: 15243,
            posts: 234567,
            color: "#2563EB"
        },
        {
            id: "maintenance",
            name: "Maintenance & Repair",
            description: "DIY repairs, service questions, maintenance tips",
            icon: "🔧",
            threads: 22156,
            posts: 189432,
            color: "#E50914"
        },
        {
            id: "buying",
            name: "Buying & Selling",
            description: "Purchase advice, selling tips, market discussions",
            icon: "🚗",
            threads: 12445,
            posts: 156789,
            color: "#10B981"
        },
        {
            id: "reviews",
            name: "Vehicle Reviews",
            description: "Share and read honest vehicle reviews",
            icon: "⭐",
            threads: 8934,
            posts: 67234,
            color: "#F59E0B"
        },
        {
            id: "modifications",
            name: "Modifications & Tuning",
            description: "Performance upgrades, custom work, modifications",
            icon: "⚡",
            threads: 6789,
            posts: 89123,
            color: "#8B5CF6"
        },
        {
            id: "mechanics",
            name: "Mechanic Reviews",
            description: "Share experiences with local mechanics",
            icon: "🏪",
            threads: 5632,
            posts: 45678,
            color: "#EC4899"
        }
    ],
    
    // Sample threads for forum page
    threads: [
        {
            id: 1,
            title: "2024 Toyota Camry - First Impressions After 5000km",
            author: "ToyotaFan2024",
            category: "Vehicle Reviews",
            replies: 23,
            views: 1567,
            lastPost: "15 min ago",
            isPinned: false,
            isLocked: false,
            tags: ["Toyota", "Camry", "2024", "Review"]
        },
        {
            id: 2,
            title: "[GUIDE] Complete Winter Prep Checklist for Canadian Weather",
            author: "WinterExpert",
            category: "Maintenance & Repair",
            replies: 89,
            views: 12453,
            lastPost: "1 hour ago",
            isPinned: true,
            isLocked: false,
            tags: ["Winter", "Maintenance", "Guide"]
        },
        // Add more threads as needed
    ],
    
    // Vehicle reviews
    vehicleReviews: [
        {
            id: 1,
            make: "Toyota",
            model: "Camry",
            year: 2024,
            rating: 4.5,
            reviewCount: 234,
            pros: ["Reliable", "Fuel efficient", "Comfortable"],
            cons: ["Bland styling", "Not sporty"]
        },
        {
            id: 2,
            make: "Honda",
            model: "CR-V",
            year: 2024,
            rating: 4.7,
            reviewCount: 189,
            pros: ["Spacious", "Great technology", "Resale value"],
            cons: ["Price", "Road noise"]
        },
        // Add more reviews
    ],
    
    // Mechanic reviews
    mechanicReviews: [
        {
            id: 1,
            name: "Precision Auto Care",
            city: "Toronto",
            province: "ON",
            rating: 4.8,
            reviews: 156,
            verified: true
        },
        {
            id: 2,
            name: "Honest Mechanics",
            city: "Vancouver",
            province: "BC",
            rating: 4.9,
            reviews: 203,
            verified: true
        },
        // Add more mechanics
    ]
};

// Utility to add new discussions (scalable)
window.addDiscussion = function(discussion) {
    if (!window.forumData.threads) {
        window.forumData.threads = [];
    }
    window.forumData.threads.unshift(discussion);
    
    // Save to localStorage for persistence
    localStorage.setItem('forumThreads', JSON.stringify(window.forumData.threads));
};

// Load saved threads from localStorage
const savedThreads = localStorage.getItem('forumThreads');
if (savedThreads) {
    try {
        const parsed = JSON.parse(savedThreads);
        window.forumData.threads = parsed;
    } catch (e) {
        console.error('Error loading saved threads:', e);
    }
}

