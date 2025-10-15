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
    
    // Hot Topics - Featured discussions
    hotTopics: [
        {
            id: 101,
            title: "🔥 Electric Vehicle Range in Canadian Winter - Real Data",
            author: "EVResearch",
            category: "General Discussion",
            replies: 234,
            views: 15632,
            lastPost: "5 min ago",
            isPinned: true,
            isHot: true,
            tags: ["EV", "Winter", "Range", "Canada"],
            keywords: ["electric", "ev", "winter", "range", "cold", "battery"]
        },
        {
            id: 102,
            title: "🔥 Best Budget SUV Under $35K - Community Poll Results",
            author: "BudgetAuto",
            category: "Buying & Selling",
            replies: 456,
            views: 23451,
            lastPost: "12 min ago",
            isPinned: true,
            isHot: true,
            tags: ["SUV", "Budget", "Buying"],
            keywords: ["suv", "budget", "cheap", "affordable", "buy", "purchase", "under 35k"]
        },
        {
            id: 103,
            title: "🔥 Oil Change DIY vs Dealership - Cost Breakdown 2024",
            author: "DIYMechanic",
            category: "Maintenance & Repair",
            replies: 189,
            views: 18934,
            lastPost: "30 min ago",
            isPinned: false,
            isHot: true,
            tags: ["Maintenance", "Oil", "DIY"],
            keywords: ["oil change", "diy", "dealership", "maintenance", "service", "cost"]
        },
        {
            id: 104,
            title: "🔥 Tesla Model 3 vs Polestar 2 - Owner Comparison",
            author: "EVOwner",
            category: "Vehicle Reviews",
            replies: 312,
            views: 21234,
            lastPost: "45 min ago",
            isPinned: false,
            isHot: true,
            tags: ["Tesla", "Polestar", "EV", "Comparison"],
            keywords: ["tesla", "polestar", "model 3", "comparison", "electric", "review"]
        },
        {
            id: 105,
            title: "🔥 How to Negotiate Car Prices in 2024 - Success Stories",
            author: "DealMaster",
            category: "Buying & Selling",
            replies: 267,
            views: 19876,
            lastPost: "1 hour ago",
            isPinned: false,
            isHot: true,
            tags: ["Negotiation", "Buying", "Tips"],
            keywords: ["negotiate", "price", "deal", "buying", "discount", "haggle"]
        },
        {
            id: 106,
            title: "🔥 Winter Tire Recommendations for 2024-2025",
            author: "TireExpert",
            category: "Maintenance & Repair",
            replies: 423,
            views: 28543,
            lastPost: "2 hours ago",
            isPinned: true,
            isHot: true,
            tags: ["Tires", "Winter", "Safety"],
            keywords: ["winter tire", "snow tire", "tire", "winter", "snow", "recommendations"]
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
            tags: ["Toyota", "Camry", "2024", "Review"],
            keywords: ["toyota", "camry", "review", "sedan"]
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
            tags: ["Winter", "Maintenance", "Guide"],
            keywords: ["winter", "maintenance", "checklist", "prepare", "guide"]
        },
        {
            id: 3,
            title: "Strange Engine Noise - Need Help Diagnosing",
            author: "ConcernedOwner",
            category: "Maintenance & Repair",
            replies: 15,
            views: 892,
            lastPost: "3 hours ago",
            isPinned: false,
            isLocked: false,
            tags: ["Help", "Engine", "Diagnosis"],
            keywords: ["engine", "noise", "problem", "diagnosis", "help"]
        },
        {
            id: 4,
            title: "Honda CR-V vs Mazda CX-5 - Which Should I Buy?",
            author: "SUVShopper",
            category: "Buying & Selling",
            replies: 42,
            views: 2341,
            lastPost: "4 hours ago",
            isPinned: false,
            isLocked: false,
            tags: ["Honda", "Mazda", "Comparison"],
            keywords: ["honda", "cr-v", "mazda", "cx-5", "comparison", "buy"]
        },
        {
            id: 5,
            title: "Best Car Insurance Rates in Ontario?",
            author: "InsuranceSeeker",
            category: "General Discussion",
            replies: 56,
            views: 3421,
            lastPost: "5 hours ago",
            isPinned: false,
            isLocked: false,
            tags: ["Insurance", "Ontario", "Advice"],
            keywords: ["insurance", "rates", "ontario", "cheap", "affordable"]
        },
        {
            id: 6,
            title: "Detailing Tips for Removing Scratches",
            author: "DetailPro",
            category: "Modifications & Tuning",
            replies: 28,
            views: 1654,
            lastPost: "6 hours ago",
            isPinned: false,
            isLocked: false,
            tags: ["Detailing", "Tips", "Scratches"],
            keywords: ["detailing", "scratch", "remove", "paint", "fix"]
        },
        {
            id: 7,
            title: "Reliable Mechanic in Vancouver - Recommendations?",
            author: "VancouverDriver",
            category: "Mechanic Reviews",
            replies: 34,
            views: 2123,
            lastPost: "8 hours ago",
            isPinned: false,
            isLocked: false,
            tags: ["Vancouver", "Mechanic", "Recommendations"],
            keywords: ["mechanic", "vancouver", "reliable", "recommendation", "garage"]
        },
        {
            id: 8,
            title: "Turbocharger Upgrade - Worth It?",
            author: "BoostLover",
            category: "Modifications & Tuning",
            replies: 67,
            views: 4532,
            lastPost: "10 hours ago",
            isPinned: false,
            isLocked: false,
            tags: ["Turbo", "Performance", "Modification"],
            keywords: ["turbo", "turbocharger", "upgrade", "performance", "boost"]
        },
        {
            id: 9,
            title: "Hybrid Battery Replacement Cost - What to Expect",
            author: "HybridOwner",
            category: "Maintenance & Repair",
            replies: 45,
            views: 3234,
            lastPost: "12 hours ago",
            isPinned: false,
            isLocked: false,
            tags: ["Hybrid", "Battery", "Cost"],
            keywords: ["hybrid", "battery", "replacement", "cost", "price"]
        },
        {
            id: 10,
            title: "First Car for Teen Driver - Safety First",
            author: "ParentDriver",
            category: "Buying & Selling",
            replies: 89,
            views: 5643,
            lastPost: "1 day ago",
            isPinned: false,
            isLocked: false,
            tags: ["First Car", "Teen", "Safety"],
            keywords: ["first car", "teen", "teenager", "safety", "beginner"]
        }
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

