// Centralized Authentication System for Autoilty

let currentUser = JSON.parse(localStorage.getItem('autoilty_user'));

// Initialize authentication state
function initAuth() {
    updateAuthButtons();
}

// Update authentication buttons across the site
function updateAuthButtons() {
    const authBtn = document.getElementById('authBtn');
    const profileBtn = document.getElementById('profileBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (currentUser) {
        if (authBtn) authBtn.style.display = 'none';
        if (profileBtn) {
            profileBtn.style.display = 'block';
            profileBtn.textContent = currentUser.username;
        }
        if (logoutBtn) logoutBtn.style.display = 'block';
    } else {
        if (authBtn) authBtn.style.display = 'block';
        if (profileBtn) profileBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

// Show authentication modal
function showAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
}

// Close authentication modal
function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('usernameInput').value = '';
    document.getElementById('emailInput').value = '';
}

// Handle authentication (signup/login)
function handleAuth() {
    const username = document.getElementById('usernameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    
    if (!username || !email) {
        alert('⚠️ Please enter both username and email');
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
    
    // Check for existing users
    const allUsers = JSON.parse(localStorage.getItem('autoilty_users') || '[]');
    const existingUser = allUsers.find(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
        // User exists - check if it's a login attempt
        if (existingUser.username.toLowerCase() === username.toLowerCase() && existingUser.email.toLowerCase() === email.toLowerCase()) {
            // Both match - successful login
            currentUser = existingUser;
            localStorage.setItem('autoilty_user', JSON.stringify(currentUser));
            closeAuthModal();
            updateAuthButtons();
            
            if (currentUser.confirmed) {
                alert(`✓ Welcome back, ${currentUser.username}!`);
            } else {
                alert(`Welcome back, ${currentUser.username}!\n\n⚠️ Please verify your email to unlock all features.`);
                showEmailConfirmation();
            }
            return;
        } else {
            // Partial match - account already exists
            if (allUsers.some(u => u.username.toLowerCase() === username.toLowerCase())) {
                alert('❌ This username is already taken. Please choose a different username or login with your existing account.');
            } else {
                alert('❌ This email is already registered. Please use a different email or login with your existing account.');
            }
            return;
        }
    }
    
    // Create new user
    const newUser = {
        id: 'user_' + Date.now(),
        username: username,
        email: email,
        joined: new Date().toISOString(),
        confirmed: false,
        confirmationCode: Math.random().toString(36).substring(2, 10).toUpperCase()
    };
    
    allUsers.push(newUser);
    localStorage.setItem('autoilty_users', JSON.stringify(allUsers));
    
    currentUser = newUser;
    localStorage.setItem('autoilty_user', JSON.stringify(currentUser));
    
    closeAuthModal();
    alert(`✓ Account created successfully!\n\nWelcome, ${username}!`);
    showEmailConfirmation();
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

