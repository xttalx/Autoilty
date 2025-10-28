// Sample Thread Data for Demo
// This file initializes sample threads if none exist

document.addEventListener('DOMContentLoaded', function() {
    // Check if threads exist in localStorage
    if (!localStorage.getItem('autoilty_threads')) {
        const sampleThreads = [
            {
                id: 'thread_101',
                userId: 'sample_user_1',
                username: 'CanadianDriver',
                title: 'Electric Vehicle Range in Canadian Winter - Real Data',
                content: 'I\'ve owned a Tesla Model 3 for 2 years now and wanted to share real-world winter range data for those considering EVs in Canada.\n\nDuring summer months, I get about 400-420km range on a full charge with mixed city/highway driving. During harsh Canadian winters (Toronto area), the range drops significantly to about 280-300km.\n\nThe cold weather affects battery performance, and using the heater definitely impacts range. I\'ve found that pre-heating the car while plugged in helps preserve range.\n\nFor anyone considering an EV in Canada, make sure you have home charging or reliable access to chargers, especially during winter.\n\nAnyone else want to share their winter EV experiences?',
                category: 'general',
                views: 3421,
                replies: 45,
                likes: 234,
                created: '2024-01-15T10:30:00.000Z',
                tags: ['EV', 'Winter', 'Range', 'Canada']
            },
            {
                id: 'thread_102',
                userId: 'sample_user_2',
                username: 'BudgetAuto',
                title: 'Best Budget SUV Under $35K - Community Poll Results',
                content: 'We asked the community about the best SUV options under $35,000 and here are the top recommendations based on votes:\n\n1. **Toyota RAV4** - Most reliable and great resale value\n2. **Honda CR-V** - Best interior and technology\n3. **Mazda CX-5** - Best driving experience and premium feel\n4. **Hyundai Tucson** - Best warranty and features for the money\n5. **Subaru Outback** - Best AWD system and off-road capability\n\nDetailed breakdown:\n\nThe RAV4 wins for its proven reliability and Toyota\'s reputation. Owners love the fuel efficiency and cargo space.\n\nThe CR-V has the best tech features including Honda Sensing standard, and the interior quality is excellent.\n\nMazda CX-5 offers the most premium driving experience with its handling and interior materials.\n\nWhat do you think? Did we miss any great options in this price range?',
                category: 'buying',
                views: 5432,
                replies: 89,
                likes: 156,
                created: '2024-01-14T14:20:00.000Z',
                tags: ['SUV', 'Budget', 'Buying', 'Recommendations']
            },
            {
                id: 'thread_103',
                userId: 'sample_user_3',
                username: 'DIYMechanic',
                title: 'Oil Change DIY vs Dealership - Cost Breakdown 2024',
                content: 'I\'ve been tracking the costs of oil changes and here\'s a detailed breakdown:\n\n**Dealership Service:**\n- Synthetic oil change: $80-120\n- Conventional oil change: $50-80\n- Average wait time: 1-2 hours\n\n**DIY Oil Change:**\n- Synthetic oil (5 quarts): $30-45\n- Oil filter: $8-15\n- Tools (one-time): $20-40\n- Your time: 30-45 minutes\n\n**Savings:** ~$40-60 per oil change\n\n**Cost per year (4 changes):**\n- Dealership: $320-480\n- DIY: $152-240\n- **Annual Savings: $168-240**\n\nSteps for DIY:\n1. Warm up engine for 5 minutes\n2. Position drain pan under oil pan\n3. Remove drain plug (careful - oil will be hot!)\n4. Remove oil filter\n5. Install new filter (lightly coat gasket with oil)\n6. Refill with correct amount of new oil\n7. Check level, dispose of old oil properly\n\nSafety tip: Never work on a hot engine for extended periods. Let it cool down first.\n\nAny questions about doing your own oil changes?',
                category: 'maintenance',
                views: 8923,
                replies: 145,
                likes: 89,
                created: '2024-01-13T09:15:00.000Z',
                tags: ['Oil Change', 'DIY', 'Maintenance', 'Cost']
            },
            {
                id: 'thread_104',
                userId: 'sample_user_4',
                username: 'ToyotaFan2024',
                title: '2024 Toyota Camry - First Impressions After 5000km',
                content: 'I picked up my 2024 Toyota Camry SE Hybrid in October and have put over 5000km on it. Here are my honest first impressions:\n\n**What I Love:**\n- Fuel economy is incredible: 4.8L/100km average (mixed city/highway)\n- Toyota Safety Sense 2.5 is excellent - adaptive cruise control works smoothly\n- Interior build quality is solid - no rattles or squeaks\n- The infotainment system is responsive and intuitive\n- Ride comfort is great for a midsize sedan\n\n**What Could Be Better:**\n- The engine drone under heavy acceleration is noticeable\n- Rear seat legroom could be better\n- Some competitors have more powerful engine options\n- The sportier trims lack some luxury touches\n\n**Overall Rating: 4.5/5**\n\nThis is a solid, reliable daily driver. It\'s not exciting, but it does everything well. Perfect for someone who wants a dependable commuter car.\n\nAnyone else have long-term experience with their Camry? How\'s reliability after 50k+ km?',
                category: 'reviews',
                views: 3456,
                replies: 67,
                likes: 112,
                created: '2024-01-12T16:45:00.000Z',
                tags: ['Toyota', 'Camry', '2024', 'Review', 'Hybrid']
            },
            {
                id: 'thread_105',
                userId: 'sample_user_5',
                username: 'WinterExpert',
                title: '[GUIDE] Complete Winter Prep Checklist for Canadian Weather',
                content: 'Winter is harsh in Canada. Here\'s a comprehensive checklist to prepare your vehicle:\n\n**Essential Items:**\n\n**Fluids:**\n- ✅ Winter washer fluid (won\'t freeze)\n- ✅ Check antifreeze concentration (should be good to -35°C)\n- ✅ Top up all fluids\n\n**Tires:**\n- ✅ Inspect tread depth (minimum 4mm for winter)\n- ✅ Check tire pressure (cold weather reduces PSI)\n- ✅ Consider dedicated winter tires\n- ✅ Switch to winter tires before first snowfall\n\n**Battery:**\n- ✅ Test battery voltage (should be 12.6V minimum)\n- ✅ Clean battery terminals\n- ✅ Cold weather is tough on batteries\n\n**Emergency Kit:**\n- ✅ Ice scraper and snow brush\n- ✅ Blanket and warm clothes\n- ✅ Jumper cables\n- ✅ Emergency flares/reflectors\n- ✅ First aid kit\n- ✅ Non-perishable snacks and water\n\n**Pre-Departure Checks:**\n- Warm up engine for 2-3 minutes in extreme cold\n- Clear all windows and lights\n- Check that exhaust isn\'t blocked by snow\n- Ensure wipers aren\'t frozen to windshield\n\nWhat would you add to this list? Stay safe out there!',
                category: 'maintenance',
                views: 8765,
                replies: 123,
                likes: 178,
                created: '2024-01-11T11:00:00.000Z',
                tags: ['Winter', 'Maintenance', 'Guide', 'Safety', 'Checklist']
            }
        ];
        
        localStorage.setItem('autoilty_threads', JSON.stringify(sampleThreads));
    }
});

