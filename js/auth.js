// Centralized Authentication System for Autoilty

let currentUser = JSON.parse(localStorage.getItem('autoilty_user'));

// Simple password hashing (for demo purposes - use bcrypt in production)
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

// Initialize authentication state
function initAuth() {
    updateAuthButtons();
}

// Update authentication buttons across the site
function updateAuthButtons() {
    const authBtn = document.getElementById('authBtn');
    const loginBtn = document.getElementById('loginBtn');
    const profileBtn = document.getElementById('profileBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const heroSignup = document.getElementById('heroSignup');
    const heroLogin = document.getElementById('heroLogin');
    const heroForum = document.getElementById('heroForum');
    
    if (currentUser) {
        if (authBtn) authBtn.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'none';
        if (profileBtn) {
            profileBtn.style.display = 'block';
            profileBtn.textContent = currentUser.username;
        }
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (heroSignup) heroSignup.style.display = 'none';
        if (heroLogin) heroLogin.style.display = 'none';
        if (heroForum) heroForum.style.display = 'inline-block';
    } else {
        if (authBtn) authBtn.style.display = 'block';
        if (loginBtn) loginBtn.style.display = 'block';
        if (profileBtn) profileBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (heroSignup) heroSignup.style.display = 'inline-block';
        if (heroLogin) heroLogin.style.display = 'inline-block';
        if (heroForum) heroForum.style.display = 'none';
    }
}

// Show signup modal
function showSignupModal() {
    document.getElementById('signupModal').style.display = 'flex';
}

// Close signup modal
function closeSignupModal() {
    document.getElementById('signupModal').style.display = 'none';
    document.getElementById('signupUsername').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('signupConfirmPassword').value = '';
}

// Show login modal
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

// Close login modal
function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
}

// Handle signup
function handleSignup() {
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validate all fields
    if (!username || !email || !password || !confirmPassword) {
        alert('⚠️ Please fill in all fields');
        return;
    }
    
    // Validate username (alphanumeric, 3-20 chars)
    if (username.length < 3 || username.length > 20) {
        alert('⚠️ Username must be between 3 and 20 characters');
        return;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        alert('⚠️ Username can only contain letters, numbers, and underscores');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('⚠️ Please enter a valid email address');
        return;
    }
    
    // Validate password strength
    if (password.length < 6) {
        alert('⚠️ Password must be at least 6 characters long');
        return;
    }
    
    // Check password match
    if (password !== confirmPassword) {
        alert('⚠️ Passwords do not match');
        return;
    }
    
    // Check for existing users
    const allUsers = JSON.parse(localStorage.getItem('autoilty_users') || '[]');
    
    if (allUsers.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        alert('❌ This username is already taken. Please choose a different username.');
        return;
    }
    
    if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert('❌ This email is already registered. Please use a different email or login.');
        return;
    }
    
    // Create new user
    const newUser = {
        id: 'user_' + Date.now(),
        username: username,
        email: email,
        password: hashPassword(password),
        joined: new Date().toISOString(),
        confirmed: false,
        confirmationCode: Math.random().toString(36).substring(2, 10).toUpperCase()
    };
    
    allUsers.push(newUser);
    localStorage.setItem('autoilty_users', JSON.stringify(allUsers));
    
    currentUser = newUser;
    localStorage.setItem('autoilty_user', JSON.stringify(currentUser));
    
    closeSignupModal();
    alert(`✓ Account created successfully!\n\nWelcome, ${username}!`);
    updateAuthButtons();
    showEmailConfirmation();
}

// Handle login
function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        alert('⚠️ Please enter both username and password');
        return;
    }
    
    // Find user
    const allUsers = JSON.parse(localStorage.getItem('autoilty_users') || '[]');
    const user = allUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (!user) {
        alert('❌ Username not found. Please check your username or sign up.');
        return;
    }
    
    // Verify password
    if (user.password !== hashPassword(password)) {
        alert('❌ Incorrect password. Please try again.');
        return;
    }
    
    // Successful login
    currentUser = user;
    localStorage.setItem('autoilty_user', JSON.stringify(currentUser));
    closeLoginModal();
    updateAuthButtons();
    
    if (currentUser.confirmed) {
        alert(`✓ Welcome back, ${currentUser.username}!`);
    } else {
        alert(`Welcome back, ${currentUser.username}!\n\n⚠️ Please verify your email to unlock all features.`);
        showEmailConfirmation();
    }
}

// Show email confirmation modal
function showEmailConfirmation() {
    if (!currentUser) return;
    
    document.getElementById('confirmEmail').textContent = currentUser.email;
    document.getElementById('confirmCode').textContent = currentUser.confirmationCode;
    document.getElementById('emailConfirmModal').style.display = 'flex';
}

// Confirm email
function confirmEmail() {
    if (!currentUser) return;
    
    currentUser.confirmed = true;
    localStorage.setItem('autoilty_user', JSON.stringify(currentUser));
    
    // Update in users list
    const allUsers = JSON.parse(localStorage.getItem('autoilty_users') || '[]');
    const userIndex = allUsers.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        allUsers[userIndex].confirmed = true;
        localStorage.setItem('autoilty_users', JSON.stringify(allUsers));
    }
    
    document.getElementById('emailConfirmModal').style.display = 'none';
    updateAuthButtons();
    
    alert(`✓ Email verified successfully!\n\n🎉 Welcome to Autoilty, ${currentUser.username}!\n\nYou can now:\n• Create forum threads\n• Post marketplace listings\n• Ask questions\n• Contact sellers`);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('autoilty_user');
        currentUser = null;
        updateAuthButtons();
        
        // Close any open modals
        const modals = ['profileModal', 'threadModal', 'postModal', 'askModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) modal.style.display = 'none';
        });
        
        alert('✓ You have been logged out successfully.');
        
        // Reload page to reset state
        window.location.reload();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initAuth();
});

