/**
 * AUTOILTY BUSINESS DIRECTORY
 * 
 * Search for local auto-related businesses
 */

// API Base URL - uses window.API_URL if set, otherwise defaults
const API_BASE_URL = (typeof window !== 'undefined' && window.API_URL) 
  ? window.API_URL 
  : 'https://autoilty-production.up.railway.app/api';
let userLocation = null;
let distanceUnit = typeof window !== 'undefined' && window.distanceUnit ? window.distanceUnit : 'miles'; // Default to miles

// Make distanceUnit global
if (typeof window !== 'undefined') {
  window.distanceUnit = distanceUnit;
}

/**
 * Get user's geolocation
 */
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        resolve(userLocation);
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

/**
 * Search for businesses
 */
async function searchBusinesses(searchParams) {
  try {
    const { keyword, location, category } = searchParams;
    
    // Try to get user location if not provided
    let userCoordinates = null;
    if (!location) {
      try {
        const coords = await getUserLocation();
        userCoordinates = coords;
      } catch (error) {
        console.warn('Could not get geolocation:', error);
      }
    }

    const requestBody = {
      keyword: keyword || '',
      location: location || '',
      category: category || '',
      unit: distanceUnit,
      ...(userCoordinates && {
        userLat: userCoordinates.lat,
        userLng: userCoordinates.lng
      })
    };

    const response = await fetch(`${API_BASE_URL}/directory/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || 'Failed to search businesses');
    }

    return await response.json();
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

/**
 * Get business details including website
 */
async function getBusinessDetails(placeId) {
  try {
    const response = await fetch(`${API_BASE_URL}/directory/business/${placeId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch business details');
    }

    return await response.json();
  } catch (error) {
    console.error('Business details error:', error);
    throw error;
  }
}

/**
 * Get Google Places photo URL
 */
function getPhotoUrl(photoReference, apiKey) {
  if (!photoReference || !apiKey) {
    return null;
  }
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
}

/**
 * Format distance
 */
function formatDistance(business, unit = null) {
  const currentUnit = unit || (typeof window !== 'undefined' && window.distanceUnit) || 'miles';
  const currentUnit = unit || (typeof window !== 'undefined' && window.distanceUnit) || 'miles';
  const distance = currentUnit === 'miles' ? business.distance_miles : business.distance_km;
  
  if (!distance) {
    return null;
  }

  const formatted = distance < 1 
    ? (distance * (currentUnit === 'miles' ? 5280 : 1000)).toFixed(0) + (currentUnit === 'miles' ? ' ft' : ' m')
    : distance.toFixed(1) + (currentUnit === 'miles' ? ' miles' : ' km');
  
  return formatted + ' away';
}

/**
 * Render star rating
 */
function renderRating(rating, totalRatings) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHtml = '';
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i data-lucide="star" class="star-icon filled"></i>';
  }
  if (hasHalfStar) {
    starsHtml += '<i data-lucide="star-half" class="star-icon filled"></i>';
  }
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i data-lucide="star" class="star-icon"></i>';
  }

  return `
    <div class="business-rating">
      ${starsHtml}
      <span class="rating-text">${rating.toFixed(1)}</span>
      ${totalRatings > 0 ? `<span class="rating-count">(${totalRatings})</span>` : ''}
    </div>
  `;
}

/**
 * Render business card
 */
function renderBusinessCard(business, photoApiKey = null) {
  const photoUrl = business.photo_reference && photoApiKey
    ? getPhotoUrl(business.photo_reference, photoApiKey)
    : 'https://via.placeholder.com/400x250?text=No+Image';
  
  const distance = formatDistance(business, distanceUnit);
  
  return `
    <div class="business-card" data-place-id="${business.id}">
      <div class="business-image">
        <img src="${photoUrl}" alt="${business.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x250?text=No+Image'">
      </div>
      <div class="business-info">
        <h3 class="business-name">${business.name}</h3>
        ${renderRating(business.rating || 0, business.user_ratings_total || 0)}
        ${distance ? `<p class="business-distance"><i data-lucide="map-pin"></i> ${distance}</p>` : ''}
        <p class="business-address">${business.address || 'Address not available'}</p>
        <div class="business-actions">
          <button class="btn btn-primary btn-visit-website" data-place-id="${business.id}">
            <i data-lucide="external-link" class="btn-icon"></i>
            Visit Website
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render business cards grid
 */
function renderBusinessGrid(businesses, container, photoApiKey = null) {
  if (!businesses || businesses.length === 0) {
    container.innerHTML = '<p class="empty-state">No businesses found. Try adjusting your search criteria.</p>';
    return;
  }

  container.innerHTML = businesses.map(business => renderBusinessCard(business, photoApiKey)).join('');
  
  // Re-initialize Lucide icons
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }

  // Add click handlers for website buttons
  container.querySelectorAll('.btn-visit-website').forEach(btn => {
    btn.addEventListener('click', async () => {
      const placeId = btn.dataset.placeId;
      try {
        const details = await getBusinessDetails(placeId);
        if (details.website) {
          window.open(details.website, '_blank', 'noopener,noreferrer');
        } else {
          alert('Website not available for this business');
        }
      } catch (error) {
        console.error('Error fetching website:', error);
        alert('Unable to load website. Please try again.');
      }
    });
  });
}

// Export functions
window.searchBusinesses = searchBusinesses;
window.getBusinessDetails = getBusinessDetails;
window.renderBusinessGrid = renderBusinessGrid;
window.getUserLocation = getUserLocation;
window.formatDistance = formatDistance;

