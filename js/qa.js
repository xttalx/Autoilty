// Q&A System with Authentication and Related Links

let currentUser = JSON.parse(localStorage.getItem('autoilty_user'));
let currentFilter = 'all';

// User Management
function updateAuthButton() {
    if (currentUser) {
        document.getElementById('authBtn').style.display = 'none';
        document.getElementById('profileBtn').style.display = 'block';
        document.getElementById('profileBtn').textContent = currentUser.username;
    } else {
        document.getElementById('authBtn').style.display = 'block';
        document.getElementById('profileBtn').style.display = 'none';
    }
}

function showAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

function handleAuth() {
    const username = document.getElementById('usernameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    
    if (!username || !email) {
        alert('Please enter both username and email');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    const existingUser = JSON.parse(localStorage.getItem('autoilty_user'));
    if (existingUser && existingUser.email === email && existingUser.confirmed) {
        currentUser = existingUser;
        localStorage.setItem('autoilty_user', JSON.stringify(currentUser));
        closeAuthModal();
        updateAuthButton();
        alert('Welcome back, ' + currentUser.username + '!');
        return;
    }
    
    currentUser = {
        id: 'user_' + Date.now(),
        username: username,
        email: email,
        joined: new Date().toISOString(),
        confirmed: false,
        confirmationCode: Math.random().toString(36).substring(2, 10).toUpperCase()
    };
    
    localStorage.setItem('autoilty_user', JSON.stringify(currentUser));
    closeAuthModal();
    showEmailConfirmation();
}

function showEmailConfirmation() {
    document.getElementById('confirmEmail').textContent = currentUser.email;
    document.getElementById('confirmCode').textContent = currentUser.confirmationCode;
    document.getElementById('emailConfirmModal').style.display = 'flex';
}

function confirmEmail() {
    currentUser.confirmed = true;
    localStorage.setItem('autoilty_user', JSON.stringify(currentUser));
    document.getElementById('emailConfirmModal').style.display = 'none';
    updateAuthButton();
    alert('✓ Email confirmed! Welcome, ' + currentUser.username + '! You can now ask questions and post answers.');
}

// Ask Question Modal
function showAskModal() {
    if (!currentUser) {
        alert('Please sign up or login to ask a question');
        showAuthModal();
        return;
    }
    
    if (!currentUser.confirmed) {
        alert('⚠️ Please confirm your email before asking questions.\n\nCheck your email for the confirmation link.');
        showEmailConfirmation();
        return;
    }
    
    document.getElementById('askModal').style.display = 'flex';
}

function closeAskModal() {
    document.getElementById('askModal').style.display = 'none';
}

function submitQuestion() {
    if (!currentUser || !currentUser.confirmed) {
        alert('Please login and confirm your email first');
        return;
    }
    
    const title = document.getElementById('questionTitle').value.trim();
    const category = document.getElementById('questionCategory').value;
    const details = document.getElementById('questionDetails').value.trim();
    const imageFile = document.getElementById('questionImage').files[0];
    
    if (!title) {
        alert('Please enter your question');
        return;
    }
    
    const question = {
        id: 'q_' + Date.now(),
        userId: currentUser.id,
        username: currentUser.username,
        question: title,
        details: details || '',
        category: category,
        image: null,
        created: new Date().toISOString(),
        views: 0,
        answers: 0,
        solved: false
    };
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            question.image = e.target.result;
            saveAndCloseQuestion(question);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveAndCloseQuestion(question);
    }
}

function saveAndCloseQuestion(question) {
    let questions = JSON.parse(localStorage.getItem('autoilty_questions') || '[]');
    questions.unshift(question);
    localStorage.setItem('autoilty_questions', JSON.stringify(questions));
    
    closeAskModal();
    document.getElementById('questionTitle').value = '';
    document.getElementById('questionDetails').value = '';
    document.getElementById('questionImage').value = '';
    
    alert('Question posted successfully!');
    loadQuestions();
}

// Load and Display Questions
function loadQuestions() {
    let questions = JSON.parse(localStorage.getItem('autoilty_questions') || '[]');
    
    // Add sample questions if empty
    if (questions.length === 0) {
        questions = [
            {id:'sample1',userId:'sample',username:'CarGuru2024',question:'Best winter tires for Ontario winters?',details:'Looking for recommendations for good winter tires. Budget around $800-1000 for a set. I have a 2020 Honda Civic.',category:'maintenance',image:null,created:new Date(Date.now()-3600000).toISOString(),views:234,answers:3,solved:true},
            {id:'sample2',userId:'sample',username:'TechMike',question:'Check engine light - P0420 code, what should I do?',details:'My check engine light came on yesterday. Scanned it and got P0420 code. Car is running fine. Is this serious?',category:'diagnostics',image:null,created:new Date(Date.now()-7200000).toISOString(),views:567,answers:5,solved:true},
            {id:'sample3',userId:'sample',username:'DIYer',question:'How to change brake pads on 2018 Toyota Camry?',details:'First time doing brakes myself. Need step-by-step guidance. What tools do I need?',category:'diy',image:null,created:new Date(Date.now()-10800000).toISOString(),views:892,answers:7,solved:true},
            {id:'sample4',userId:'sample',username:'BuyerJoe',question:'Honda Civic vs Toyota Corolla - Which is better?',details:'Looking to buy my first car. Both seem reliable. Which one would you recommend for Canadian winters?',category:'buying',image:null,created:new Date(Date.now()-14400000).toISOString(),views:1234,answers:12,solved:false},
            {id:'sample5',userId:'sample',username:'EVCurious',question:'Is Tesla Model 3 worth it in Canada?',details:'Considering buying a Tesla Model 3. How does it handle Canadian winters? Range impact?',category:'electric',image:null,created:new Date(Date.now()-18000000).toISOString(),views:1567,answers:9,solved:false}
        ];
        localStorage.setItem('autoilty_questions', JSON.stringify(questions));
        
        // Add sample answers
        addSampleAnswers();
    }
    
    // Apply filter
    if (currentFilter === 'solved') {
        questions = questions.filter(q => q.solved);
    } else if (currentFilter === 'unsolved') {
        questions = questions.filter(q => !q.solved);
    } else if (currentFilter === 'popular') {
        questions = [...questions].sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    
    renderQuestions(questions);
}

function renderQuestions(questions) {
    const container = document.getElementById('questionsList');
    if (!container) return;
    
    if (questions.length === 0) {
        container.innerHTML = '<p style="padding:3rem;text-align:center;color:#999;">No questions found.</p>';
        return;
    }
    
    const categoryColors = {
        maintenance: '#e67e22',
        buying: '#27ae60',
        diy: '#3498db',
        diagnostics: '#e74c3c',
        electric: '#9b59b6',
        general: '#95a5a6'
    };
    
    container.innerHTML = questions.map(q => `
        <div class="question-item" onclick="window.location.href='question.html?id=${q.id}'" style="cursor:pointer;transition:transform 0.3s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            <div class="question-header">
                <div class="question-title">${q.question}</div>
                ${q.solved ? '<span class="question-solved" style="background:#27ae60;color:#fff;padding:4px 12px;border-radius:12px;font-size:12px;white-space:nowrap;">✓ Solved</span>' : ''}
            </div>
            <div class="question-meta" style="margin:12px 0;color:#666;font-size:14px;">
                <span>Asked by <strong>${q.username}</strong></span>
                <span style="margin:0 12px;">•</span>
                <span>${formatTime(q.created)}</span>
                <span style="margin:0 12px;">•</span>
                <span style="background:${categoryColors[q.category]};color:#fff;padding:2px 10px;border-radius:8px;font-size:12px;">${q.category}</span>
            </div>
            ${q.details ? `<p style="color:#666;line-height:1.6;margin-bottom:12px;">${q.details.substring(0,150)}${q.details.length > 150 ? '...' : ''}</p>` : ''}
            <div class="question-footer" style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid #f0f0f0;">
                <div class="question-stats" style="display:flex;gap:16px;font-size:14px;color:#999;">
                    <span>💬 ${q.answers} answers</span>
                    <span>👁️ ${q.views} views</span>
                </div>
            </div>
        </div>
    `).join('');
}

function formatTime(timestamp) {
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
}

// Filter Functions
function filterQA(filter) {
    currentFilter = filter;
    
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
    
    let questions = JSON.parse(localStorage.getItem('autoilty_questions') || '[]');
    const filtered = questions.filter(q => 
        q.question.toLowerCase().includes(searchTerm) ||
        (q.details && q.details.toLowerCase().includes(searchTerm)) ||
        q.username.toLowerCase().includes(searchTerm) ||
        q.category.toLowerCase().includes(searchTerm)
    );
    
    if (filtered.length === 0) {
        container.innerHTML = '<p style="padding:3rem;text-align:center;color:#999;">No questions found. Try different keywords.</p>';
        return;
    }
    
    renderQuestions(filtered);
}

// Add sample answers for demo
function addSampleAnswers() {
    const answers = [
        {id:'ans1',questionId:'sample1',userId:'expert1',username:'WinterExpert',answer:'I highly recommend Michelin X-Ice Snow tires. They perform excellently in Ontario winters and last 5-6 seasons. For your budget, you can get a full set including installation.',created:new Date(Date.now()-3000000).toISOString(),upvotes:12,bestAnswer:true},
        {id:'ans2',questionId:'sample1',userId:'expert2',username:'TireTech',answer:'Bridgestone Blizzak WS90 are also great. Slightly more expensive but worth it for severe winters.',created:new Date(Date.now()-2800000).toISOString(),upvotes:8,bestAnswer:false},
        {id:'ans3',questionId:'sample1',userId:'expert3',username:'CanadianDriver',answer:'Nokian Hakkapeliitta tires if you want the absolute best for ice and snow. Finnish engineering!',created:new Date(Date.now()-2600000).toISOString(),upvotes:6,bestAnswer:false},
        
        {id:'ans4',questionId:'sample2',userId:'mech1',username:'MechanicMike',answer:'P0420 means your catalytic converter efficiency is below threshold. Usually the cat itself needs replacement, but could also be O2 sensors. Get it diagnosed at a shop.',created:new Date(Date.now()-6000000).toISOString(),upvotes:15,bestAnswer:true},
        {id:'ans5',questionId:'sample2',userId:'mech2',username:'DiagnosticPro',answer:'Before replacing the expensive cat, try replacing the downstream O2 sensor first. Costs $50-100 vs $800-1500 for a cat.',created:new Date(Date.now()-5800000).toISOString(),upvotes:10,bestAnswer:false},
        {id:'ans6',questionId:'sample2',userId:'mech3',username:'AutoExpert',answer:'Also check for exhaust leaks before the sensor. Sometimes a simple leak causes this code.',created:new Date(Date.now()-5600000).toISOString(),upvotes:7,bestAnswer:false},
        {id:'ans7',questionId:'sample2',userId:'mech4',username:'ToyotaTech',answer:'Run some catalytic converter cleaner through it first. Sometimes carbon buildup causes the code. Worth trying for $20 before expensive repairs.',created:new Date(Date.now()-5400000).toISOString(),upvotes:9,bestAnswer:false},
        {id:'ans8',questionId:'sample2',userId:'mech5',username:'ShopOwner',answer:'I would reset the code and see if it comes back. Sometimes it is a false positive.',created:new Date(Date.now()-5200000).toISOString(),upvotes:4,bestAnswer:false},
        
        {id:'ans9',questionId:'sample3',userId:'diy1',username:'DIYMaster',answer:'Tools needed: jack, jack stands, lug wrench, C-clamp, 14mm socket. Process: 1) Remove wheel 2) Remove caliper bolts 3) Remove old pads 4) Compress piston with C-clamp 5) Install new pads 6) Reassemble. Takes about 1 hour per side.',created:new Date(Date.now()-10000000).toISOString(),upvotes:20,bestAnswer:true},
        {id:'ans10',questionId:'sample3',userId:'diy2',username:'WrenchTurner',answer:'Make sure you get the right pads - ceramic are quieter. Also replace brake fluid while you are at it.',created:new Date(Date.now()-9800000).toISOString(),upvotes:8,bestAnswer:false},
        {id:'ans11',questionId:'sample3',userId:'diy3',username:'HomeGarage',answer:'YouTube has great video tutorials. Search for "2018 Camry brake pad replacement" - much easier to follow along with video.',created:new Date(Date.now()-9600000).toISOString(),upvotes:12,bestAnswer:false},
        {id:'ans12',questionId:'sample3',userId:'diy4',username:'SafetyFirst',answer:'Don not forget to pump the brakes a few times after installation to reseat the pads before driving!',created:new Date(Date.now()-9400000).toISOString(),upvotes:15,bestAnswer:false},
        {id:'ans13',questionId:'sample3',userId:'diy5',username:'MechanicStudent',answer:'Also inspect rotors for scoring or thickness. Might need resurfacing or replacement.',created:new Date(Date.now()-9200000).toISOString(),upvotes:6,bestAnswer:false},
        {id:'ans14',questionId:'sample3',userId:'diy6',username:'CarCareTips',answer:'Apply anti-seize compound on the back of pads to prevent squeaking.',created:new Date(Date.now()-9000000).toISOString(),upvotes:5,bestAnswer:false},
        {id:'ans15',questionId:'sample3',userId:'diy7',username:'ToyotaFan',answer:'OEM Toyota pads are best quality but pricier. Akebono ceramic pads are excellent aftermarket option.',created:new Date(Date.now()-8800000).toISOString(),upvotes:7,bestAnswer:false},
        
        {id:'ans16',questionId:'sample4',userId:'buyer1',username:'CarAdvisor',answer:'Both are excellent choices! Civic has sportier handling and better tech. Corolla is slightly more reliable (both are ultra-reliable though) and has better resale value. For winters, both handle well with winter tires. I would test drive both and see which you prefer.',created:new Date(Date.now()-14000000).toISOString(),upvotes:18,bestAnswer:false},
        {id:'ans17',questionId:'sample4',userId:'buyer2',username:'TorontoDriver',answer:'I own a Civic and love it. Great fuel economy, fun to drive. Honda Sensing safety features are top-notch.',created:new Date(Date.now()-13800000).toISOString(),upvotes:11,bestAnswer:false},
        {id:'ans18',questionId:'sample4',userId:'buyer3',username:'CorollaOwner',answer:'Corolla owner here - 5 years, zero issues. Cannot beat Toyota reliability. Hybrid version gets 50+ MPG.',created:new Date(Date.now()-13600000).toISOString(),upvotes:14,bestAnswer:false},
        {id:'ans19',questionId:'sample4',userId:'buyer4',username:'CarReviewer',answer:'Civic: Better performance, tech, styling. Corolla: Better reliability, resale, efficiency. You cannot go wrong with either!',created:new Date(Date.now()-13400000).toISOString(),upvotes:22,bestAnswer:false},
        {id:'ans20',questionId:'sample4',userId:'buyer5',username:'MontréalDriver',answer:'Both excellent in snow with proper winter tires. Ground clearance is similar. Consider the Civic hatchback for more cargo space.',created:new Date(Date.now()-13200000).toISOString(),upvotes:9,bestAnswer:false},
        
        {id:'ans21',questionId:'sample5',userId:'ev1',username:'TeslaOwner2022',answer:'I have owned a Model 3 for 2 winters in Alberta. Range drops about 30-40 percent in -20°C. Still totally worth it! Instant heat, great traction control, low maintenance. Charging at home is convenient.',created:new Date(Date.now()-17500000).toISOString(),upvotes:25,bestAnswer:false},
        {id:'ans22',questionId:'sample5',userId:'ev2',username:'EVEnthusiast',answer:'Absolutely worth it! Supercharger network in Canada is excellent and growing. Total cost of ownership is lower than gas cars.',created:new Date(Date.now()-17300000).toISOString(),upvotes:16,bestAnswer:false},
        {id:'ans23',questionId:'sample5',userId:'ev3',username:'VancouverEV',answer:'Winter range loss is real but manageable. Precondition while plugged in to minimize loss. The driving experience is incredible.',created:new Date(Date.now()-17100000).toISOString(),upvotes:19,bestAnswer:false},
        {id:'ans24',questionId:'sample5',userId:'ev4',username:'ElectricGarage',answer:'Make sure you have home charging! Public charging in winter can be slow. Otherwise fantastic car.',created:new Date(Date.now()-16900000).toISOString(),upvotes:12,bestAnswer:false},
        {id:'ans25',questionId:'sample5',userId:'ev5',username:'GreenDriver',answer:'Insurance can be pricey and wait times for service can be long. But the car is amazing and cheap to run.',created:new Date(Date.now()-16700000).toISOString(),upvotes:8,bestAnswer:false}
    ];
    
    localStorage.setItem('autoilty_answers', JSON.stringify(answers));
}

// Initialize
updateAuthButton();
loadQuestions();
