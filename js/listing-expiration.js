// Automatic Listing Expiration System
// Deletes buying/selling posts after 90 days

class ListingExpirationManager {
    constructor() {
        this.EXPIRATION_DAYS = 90;
        this.EXPIRATION_MS = this.EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
        this.WARNING_DAYS = 7; // Warn 7 days before expiration
        this.WARNING_MS = this.WARNING_DAYS * 24 * 60 * 60 * 1000;
    }

    // Initialize expiration checking
    init() {
        this.cleanExpiredListings();
        this.setupAutoCleanup();
    }

    // Clean expired listings
    cleanExpiredListings() {
        const listings = this.getListings();
        const now = Date.now();
        let cleanedCount = 0;

        const activeListings = listings.filter(listing => {
            const createdDate = new Date(listing.created).getTime();
            const age = now - createdDate;
            
            // Check if expired
            if (age > this.EXPIRATION_MS) {
                console.log(`Removing expired listing: ${listing.title} (${this.EXPIRATION_DAYS} days old)`);
                cleanedCount++;
                return false; // Remove this listing
            }
            
            return true; // Keep this listing
        });

        // Update localStorage with active listings only
        if (cleanedCount > 0) {
            localStorage.setItem('autoilty_listings', JSON.stringify(activeListings));
            console.log(`✅ Cleaned ${cleanedCount} expired listing(s)`);
        }

        return cleanedCount;
    }

    // Get all listings
    getListings() {
        const listings = localStorage.getItem('autoilty_listings');
        return listings ? JSON.parse(listings) : [];
    }

    // Check if listing is expiring soon
    isExpiringSoon(listing) {
        const now = Date.now();
        const createdDate = new Date(listing.created).getTime();
        const age = now - createdDate;
        const timeUntilExpiration = this.EXPIRATION_MS - age;

        return timeUntilExpiration > 0 && timeUntilExpiration < this.WARNING_MS;
    }

    // Get days until expiration
    getDaysUntilExpiration(listing) {
        const now = Date.now();
        const createdDate = new Date(listing.created).getTime();
        const age = now - createdDate;
        const timeUntilExpiration = this.EXPIRATION_MS - age;
        
        return Math.ceil(timeUntilExpiration / (24 * 60 * 60 * 1000));
    }

    // Get listings expiring soon
    getExpiringSoonListings(userId) {
        const listings = this.getListings();
        return listings.filter(listing => {
            return listing.userId === userId && this.isExpiringSoon(listing);
        });
    }

    // Add expiration badge to listing
    addExpirationBadge(listing) {
        const daysLeft = this.getDaysUntilExpiration(listing);
        
        if (daysLeft <= 0) {
            return '<span class="expiration-badge expired">EXPIRED</span>';
        } else if (daysLeft <= this.WARNING_DAYS) {
            return `<span class="expiration-badge warning">Expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}</span>`;
        }
        
        return '';
    }

    // Get listing age in days
    getListingAge(listing) {
        const now = Date.now();
        const createdDate = new Date(listing.created).getTime();
        const age = now - createdDate;
        return Math.floor(age / (24 * 60 * 60 * 1000));
    }

    // Renew listing (reset creation date)
    renewListing(listingId) {
        const listings = this.getListings();
        const listing = listings.find(l => l.id === listingId);
        
        if (listing) {
            listing.created = new Date().toISOString();
            listing.renewed = true;
            listing.renewCount = (listing.renewCount || 0) + 1;
            
            localStorage.setItem('autoilty_listings', JSON.stringify(listings));
            
            console.log(`✅ Listing renewed: ${listing.title}`);
            return true;
        }
        
        return false;
    }

    // Setup automatic daily cleanup
    setupAutoCleanup() {
        // Run cleanup daily
        const ONE_DAY = 24 * 60 * 60 * 1000;
        
        // Run cleanup on page load
        this.cleanExpiredListings();
        
        // Check if we need to run cleanup (once per day)
        const lastCleanup = localStorage.getItem('autoilty_last_cleanup');
        const now = Date.now();
        
        if (!lastCleanup || (now - parseInt(lastCleanup)) > ONE_DAY) {
            this.cleanExpiredListings();
            localStorage.setItem('autoilty_last_cleanup', now.toString());
        }
    }

    // Get expiration stats
    getExpirationStats() {
        const listings = this.getListings();
        const now = Date.now();
        
        const stats = {
            total: listings.length,
            expiringSoon: 0,
            expiringThisWeek: 0,
            expiringThisMonth: 0,
            averageAge: 0
        };

        let totalAge = 0;

        listings.forEach(listing => {
            const age = this.getListingAge(listing);
            const daysLeft = this.getDaysUntilExpiration(listing);
            
            totalAge += age;
            
            if (daysLeft <= this.WARNING_DAYS && daysLeft > 0) {
                stats.expiringSoon++;
            }
            if (daysLeft <= 7 && daysLeft > 0) {
                stats.expiringThisWeek++;
            }
            if (daysLeft <= 30 && daysLeft > 0) {
                stats.expiringThisMonth++;
            }
        });

        if (listings.length > 0) {
            stats.averageAge = Math.round(totalAge / listings.length);
        }

        return stats;
    }

    // Show expiration notification to user
    showExpirationNotifications(userId) {
        const expiringSoon = this.getExpiringSoonListings(userId);
        
        if (expiringSoon.length > 0) {
            const container = document.getElementById('expirationNotifications');
            if (container) {
                const html = `
                    <div class="notification-banner warning" style="background:#fff3cd;border-left:4px solid #ffc107;padding:16px;margin:16px 0;border-radius:8px;">
                        <h4 style="margin:0 0 8px 0;color:#856404;">⚠️ Listings Expiring Soon</h4>
                        <p style="margin:0 0 12px 0;color:#856404;">You have ${expiringSoon.length} listing${expiringSoon.length !== 1 ? 's' : ''} expiring within ${this.WARNING_DAYS} days:</p>
                        <ul style="margin:0;padding-left:20px;color:#856404;">
                            ${expiringSoon.map(listing => `
                                <li>
                                    <strong>${listing.title}</strong> - 
                                    expires in ${this.getDaysUntilExpiration(listing)} day${this.getDaysUntilExpiration(listing) !== 1 ? 's' : ''}
                                    <button onclick="expirationManager.renewListing('${listing.id}')" 
                                            style="margin-left:8px;padding:4px 12px;background:#28a745;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;">
                                        Renew
                                    </button>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `;
                container.innerHTML = html;
            }
        }
    }

    // Export expired listings (for record keeping)
    exportExpiredListings() {
        const expiredListings = [];
        const listings = this.getListings();
        const now = Date.now();

        listings.forEach(listing => {
            const createdDate = new Date(listing.created).getTime();
            const age = now - createdDate;
            
            if (age > this.EXPIRATION_MS) {
                expiredListings.push({
                    ...listing,
                    expiredDate: new Date().toISOString(),
                    ageInDays: Math.floor(age / (24 * 60 * 60 * 1000))
                });
            }
        });

        return expiredListings;
    }

    // Archive expired listing before deletion
    archiveExpiredListings() {
        const expiredListings = this.exportExpiredListings();
        
        if (expiredListings.length > 0) {
            // Get existing archive
            const archive = localStorage.getItem('autoilty_listings_archive');
            const archivedListings = archive ? JSON.parse(archive) : [];
            
            // Add expired listings to archive
            expiredListings.forEach(listing => {
                archivedListings.push(listing);
            });
            
            // Keep only last 500 archived listings
            const recentArchive = archivedListings.slice(-500);
            
            // Save archive
            localStorage.setItem('autoilty_listings_archive', JSON.stringify(recentArchive));
            
            console.log(`📦 Archived ${expiredListings.length} expired listing(s)`);
        }
    }

    // Get archived listings
    getArchivedListings() {
        const archive = localStorage.getItem('autoilty_listings_archive');
        return archive ? JSON.parse(archive) : [];
    }

    // Full cleanup with archiving
    fullCleanup() {
        // Archive before deleting
        this.archiveExpiredListings();
        
        // Clean expired listings
        const count = this.cleanExpiredListings();
        
        return count;
    }
}

// Initialize expiration manager
const expirationManager = new ListingExpirationManager();

// Run cleanup on page load
document.addEventListener('DOMContentLoaded', function() {
    expirationManager.init();
    
    // Show notifications if user is logged in
    if (typeof currentUser !== 'undefined' && currentUser) {
        expirationManager.showExpirationNotifications(currentUser.id);
    }
});

// Make available globally
window.expirationManager = expirationManager;

// Log expiration stats (for debugging)
console.log('📊 Listing Expiration Stats:', expirationManager.getExpirationStats());

