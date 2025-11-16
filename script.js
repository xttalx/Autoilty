/**
 * Autoilty.com - Main JavaScript
 * Handles search functionality, smooth scrolling, and mobile menu
 */

(function() {
    'use strict';

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            // Animate hamburger icon
            const spans = mobileMenuToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // ============================================
    // Smooth Scrolling for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty hash or just '#'
            if (href === '#' || href === '') {
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const spans = mobileMenuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    });

    // ============================================
    // Search Functionality
    // ============================================
    const headerSearchInput = document.getElementById('header-search-input');
    const headerSearchBtn = document.getElementById('header-search-btn');
    const heroSearchInput = document.getElementById('hero-search-input');
    const heroSearchBtn = document.getElementById('hero-search-btn');
    const cards = document.querySelectorAll('.card');

    /**
     * Filter cards based on search query
     * @param {string} query - Search term
     */
    function filterCards(query) {
        const searchTerm = query.toLowerCase().trim();
        let hasResults = false;

        cards.forEach(card => {
            const searchTerms = card.getAttribute('data-search-terms') || '';
            const title = card.querySelector('.card-title')?.textContent || '';
            const description = card.querySelector('.card-description')?.textContent || '';
            
            const searchableText = (searchTerms + ' ' + title + ' ' + description).toLowerCase();

            if (searchTerm === '' || searchableText.includes(searchTerm)) {
                card.classList.remove('hidden');
                hasResults = true;
            } else {
                card.classList.add('hidden');
            }
        });

        // Show message if no results found
        showNoResultsMessage(searchTerm !== '' && !hasResults);
    }

    /**
     * Show/hide no results message
     * @param {boolean} show - Whether to show the message
     */
    function showNoResultsMessage(show) {
        let message = document.getElementById('no-results-message');
        
        if (show && !message) {
            message = document.createElement('div');
            message.id = 'no-results-message';
            message.className = 'no-results-message';
            message.textContent = 'No results found. Try a different search term.';
            message.style.cssText = `
                text-align: center;
                padding: 40px 20px;
                color: #666;
                font-size: 18px;
                background-color: #f8f9fa;
                border-radius: 10px;
                margin: 20px 0;
            `;
            
            const primaryContent = document.querySelector('.primary-content');
            if (primaryContent) {
                primaryContent.insertBefore(message, primaryContent.firstChild);
            }
        } else if (!show && message) {
            message.remove();
        }
    }

    /**
     * Handle search input
     * @param {Event} e - Input event
     */
    function handleSearch(e) {
        const query = e.target.value;
        filterCards(query);
    }

    /**
     * Handle search button click
     * @param {HTMLInputElement} input - Search input element
     */
    function handleSearchClick(input) {
        const query = input.value;
        filterCards(query);
        
        // Scroll to results if on hero section
        if (input === heroSearchInput) {
            const productsSection = document.getElementById('products');
            if (productsSection) {
                const headerOffset = 80;
                const elementPosition = productsSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

    // Header search functionality
    if (headerSearchInput) {
        headerSearchInput.addEventListener('input', handleSearch);
        headerSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchClick(headerSearchInput);
            }
        });
    }

    if (headerSearchBtn) {
        headerSearchBtn.addEventListener('click', function() {
            if (headerSearchInput) {
                handleSearchClick(headerSearchInput);
            }
        });
    }

    // Hero search functionality
    if (heroSearchInput) {
        heroSearchInput.addEventListener('input', handleSearch);
        heroSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchClick(heroSearchInput);
            }
        });
    }

    if (heroSearchBtn) {
        heroSearchBtn.addEventListener('click', function() {
            if (heroSearchInput) {
                handleSearchClick(heroSearchInput);
            }
        });
    }

    // Sync search inputs
    if (headerSearchInput && heroSearchInput) {
        headerSearchInput.addEventListener('input', function() {
            heroSearchInput.value = this.value;
        });
        
        heroSearchInput.addEventListener('input', function() {
            headerSearchInput.value = this.value;
        });
    }

    // ============================================
    // Newsletter Form Handling
    // ============================================
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Here you would typically send the email to your backend
                // For now, we'll just show a success message
                alert('Thank you for subscribing! You will receive updates at ' + email);
                emailInput.value = '';
            }
        });
    }

    // ============================================
    // Header Scroll Effect (Optional Enhancement)
    // ============================================
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }
        
        lastScroll = currentScroll;
    });

    // ============================================
    // Card Animation on Scroll (Optional Enhancement)
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Initialize card animations
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // ============================================
    // Clear Search on Page Load (Optional)
    // ============================================
    window.addEventListener('load', function() {
        if (headerSearchInput) headerSearchInput.value = '';
        if (heroSearchInput) heroSearchInput.value = '';
        filterCards('');
    });

})();

