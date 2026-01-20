/**
 * Advanced Features for Inventory Page
 * Includes: Spec Comparisons, 360° Views, Find Dealers, Price History Charts,
 * AI Recommendations, User-Submitted Updates, Dynamic SEO
 */

// Store vehicles for quick access - use window.vehiclesCache from inventory.html
// This will be populated when vehicles are loaded
if (typeof window !== 'undefined' && !window.vehiclesCache) {
  window.vehiclesCache = [];
}
let vehiclesCache = window.vehiclesCache || [];

// ============================================
// SPEC COMPARISON FUNCTIONALITY
// ============================================
const comparisonVehicles = [];

function compareVehicle(vehicleId) {
  const vehicle = vehiclesCache.find(v => v.id === vehicleId);
  if (!vehicle) {
    console.error('Vehicle not found:', vehicleId);
    return;
  }

  // Add to comparison if not already there (max 3)
  if (!comparisonVehicles.find(v => v.id === vehicleId)) {
    if (comparisonVehicles.length >= 3) {
      alert('You can compare up to 3 vehicles at a time. Remove one to add another.');
      return;
    }
    comparisonVehicles.push(vehicle);
    updateComparisonUI();
  }

  // Open comparison modal
  openComparisonModal();
}

function removeFromComparison(vehicleId) {
  const index = comparisonVehicles.findIndex(v => v.id === vehicleId);
  if (index > -1) {
    comparisonVehicles.splice(index, 1);
    updateComparisonUI();
    if (comparisonVehicles.length === 0) {
      closeComparisonModal();
    } else {
      renderComparisonTable();
    }
  }
}

function updateComparisonUI() {
  const badge = document.getElementById('comparisonBadge');
  if (badge) {
    badge.textContent = comparisonVehicles.length;
    badge.style.display = comparisonVehicles.length > 0 ? 'flex' : 'none';
  }
  
  const compareBtn = document.getElementById('comparisonBtn');
  if (compareBtn) {
    compareBtn.disabled = comparisonVehicles.length === 0;
    if (comparisonVehicles.length === 0) {
      compareBtn.style.opacity = '0.6';
      compareBtn.style.cursor = 'not-allowed';
    } else {
      compareBtn.style.opacity = '1';
      compareBtn.style.cursor = 'pointer';
    }
  }
}

// Make comparisonVehicles and functions accessible globally
if (typeof window !== 'undefined') {
  window.comparisonVehicles = comparisonVehicles;
  window.updateComparisonUI = updateComparisonUI;
  window.openComparisonModal = openComparisonModal;
}

function openComparisonModal() {
  let modal = document.getElementById('comparisonModal');
  if (!modal) {
    modal = createComparisonModal();
    document.body.appendChild(modal);
  }
  
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  renderComparisonTable();
  
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

function closeComparisonModal() {
  const modal = document.getElementById('comparisonModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function createComparisonModal() {
  const modal = document.createElement('div');
  modal.id = 'comparisonModal';
  modal.className = 'modal-overlay';
  modal.style.cssText = 'display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; align-items: center; justify-content: center; padding: 2rem; overflow-y: auto;';
  
  modal.innerHTML = `
    <div class="modal-content" style="background: white; border-radius: 12px; max-width: 1200px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 2rem; position: relative;">
      <button onclick="closeComparisonModal();" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--color-text-light);" aria-label="Close">
        <i data-lucide="x"></i>
      </button>
      <h2 style="margin-bottom: 1.5rem; font-size: 1.75rem;">Compare Vehicles</h2>
      <div id="comparisonTableContainer"></div>
      <div style="margin-top: 1.5rem; text-align: center;">
        <button class="btn btn-primary" onclick="closeComparisonModal();">Close</button>
      </div>
    </div>
  `;
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeComparisonModal();
    }
  });
  
  return modal;
}

function renderComparisonTable() {
  const container = document.getElementById('comparisonTableContainer');
  if (!container || comparisonVehicles.length === 0) return;

  const specs = ['Make', 'Model', 'Variant', 'Year', 'Price', 'Engine', 'Power', 'Torque', 'Mileage', 'Fuel Type', 'Transmission', 'Body Type', 'Seats', 'Features'];
  
  let html = `
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
        <thead>
          <tr style="background: #f8f9fa;">
            <th style="padding: 0.75rem; text-align: left; border: 1px solid #e0e0e0; font-weight: 600;">Specification</th>
            ${comparisonVehicles.map(v => `
              <th style="padding: 0.75rem; text-align: center; border: 1px solid #e0e0e0; font-weight: 600; position: relative;">
                ${v.make} ${v.model}
                <button onclick="removeFromComparison('${v.id}');" style="position: absolute; top: 0.25rem; right: 0.25rem; background: #c53030; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-size: 0.75rem;" aria-label="Remove">
                  <i data-lucide="x" style="width: 12px; height: 12px;"></i>
                </button>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${specs.map(spec => `
            <tr>
              <td style="padding: 0.75rem; border: 1px solid #e0e0e0; font-weight: 500; background: #f8f9fa;">${spec}</td>
              ${comparisonVehicles.map(v => {
                let value = '';
                switch(spec) {
                  case 'Make': value = v.make; break;
                  case 'Model': value = v.model; break;
                  case 'Variant': value = v.variant || 'N/A'; break;
                  case 'Year': value = v.year; break;
                  case 'Price': value = v.price_range_min && v.price_range_max 
                    ? `₹${(v.price_range_min/100000).toFixed(1)}L - ₹${(v.price_range_max/100000).toFixed(1)}L` 
                    : 'Price on request'; break;
                  case 'Engine': value = v.engine || (v.specifications?.displacement) || 'N/A'; break;
                  case 'Power': value = v.power || (v.specifications?.max_power) || 'N/A'; break;
                  case 'Torque': value = v.torque || (v.specifications?.max_torque) || 'N/A'; break;
                  case 'Mileage': value = v.mileage || 'N/A'; break;
                  case 'Fuel Type': value = v.fuel_type; break;
                  case 'Transmission': value = v.transmission; break;
                  case 'Body Type': value = v.body_type || 'N/A'; break;
                  case 'Seats': value = v.seats || 'N/A'; break;
                  case 'Features': value = Array.isArray(v.features) ? v.features.slice(0, 3).join(', ') : 'N/A'; break;
                  default: value = v[spec.toLowerCase().replace(/\s+/g, '_')] || 'N/A';
                }
                return `<td style="padding: 0.75rem; border: 1px solid #e0e0e0; text-align: center;">${escapeHtml(value)}</td>`;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  
  container.innerHTML = html;
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

// ============================================
// 360° VIEW FUNCTIONALITY
// ============================================
function open360View(vehicleId) {
  const vehicle = vehiclesCache.find(v => v.id === vehicleId);
  if (!vehicle) return;

  let modal = document.getElementById('view360Modal');
  if (!modal) {
    modal = create360ViewModal();
    document.body.appendChild(modal);
  }

  // In production, use a 360° viewer library like PhotoSphere Viewer or ThreeSixty
  // For now, show placeholder
  const viewer = document.getElementById('view360Viewer');
  if (viewer) {
    viewer.innerHTML = `
      <div style="text-align: center; padding: 2rem; background: #f5f5f5; border-radius: 8px; min-height: 400px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 1rem;">
        <i data-lucide="rotate-3d" style="width: 64px; height: 64px; color: var(--color-text-light);"></i>
        <p style="color: var(--color-text-light);">360° View for ${vehicle.make} ${vehicle.model}</p>
        <p style="font-size: 0.875rem; color: var(--color-text-light);">360° viewer integration coming soon. In production, this would use PhotoSphere Viewer or ThreeSixty library.</p>
        <img src="${vehicle.image_url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'}" alt="${vehicle.make} ${vehicle.model}" style="max-width: 100%; border-radius: 8px;">
      </div>
    `;
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

function create360ViewModal() {
  const modal = document.createElement('div');
  modal.id = 'view360Modal';
  modal.className = 'modal-overlay';
  modal.style.cssText = 'display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 10000; align-items: center; justify-content: center; padding: 2rem;';
  
  modal.innerHTML = `
    <div class="modal-content" style="background: white; border-radius: 12px; max-width: 900px; width: 100%; padding: 2rem; position: relative;">
      <button onclick="close360View();" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--color-text-light); z-index: 10001;" aria-label="Close">
        <i data-lucide="x"></i>
      </button>
      <div id="view360Viewer"></div>
    </div>
  `;
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      close360View();
    }
  });
  
  return modal;
}

function close360View() {
  const modal = document.getElementById('view360Modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// ============================================
// FIND DEALERS (GOOGLE MAPS INTEGRATION)
// ============================================
async function findDealers(vehicleId) {
  // Prevent any default behavior and navigation - CRITICAL: Do not redirect
  try {
    if (typeof event !== 'undefined' && event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  } catch (e) {
    // Event might not be available in all contexts
  }
  
  // Prevent any navigation or redirect
  if (typeof window !== 'undefined') {
    window.history.pushState(null, '', window.location.href);
  }
  
  console.log('🔍 findDealers called with vehicleId:', vehicleId);
  
  // Find vehicle info (optional, for display purposes)
  let vehicle = null;
  if (vehicleId) {
    const card = document.querySelector(`[data-vehicle-id="${vehicleId}"]`);
    if (card && card.dataset.vehicleData) {
      try {
        const vehicleDataStr = card.dataset.vehicleData.replace(/&apos;/g, "'").replace(/&quot;/g, '"');
        vehicle = JSON.parse(vehicleDataStr);
      } catch (e) {
        console.error('Error parsing vehicle data:', e);
      }
    }
    if (!vehicle && typeof window !== 'undefined' && window.vehiclesCache) {
      vehicle = window.vehiclesCache.find(v => v && v.id === vehicleId);
    }
  }
  
  // Create or get modal
  let modal = document.getElementById('dealersModal');
  if (!modal) {
    modal = createDealersModal();
    if (modal) {
      document.body.appendChild(modal);
    } else {
      alert('Unable to open dealers modal. Please try again.');
      return false;
    }
  }

  // Show modal with loading state
  requestAnimationFrame(() => {
    if (!modal) {
      console.error('Modal not found or could not be created');
      alert('Unable to open dealers modal. Please refresh the page and try again.');
      return false;
    }
    
    if (!modal.parentNode) {
      document.body.appendChild(modal);
    }
    
    // Ensure modal is visible
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    document.body.style.overflow = 'hidden';
    
    const dealersList = document.getElementById('dealersList');
    const dealersMap = document.getElementById('dealersMap');
    
    // Show loading state
    if (dealersList) {
      dealersList.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center;">
          <div class="loading-spinner" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid var(--color-primary); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem;"></div>
          <p style="color: var(--color-text-light);">Requesting location permission...</p>
        </div>
      `;
    }
    
    if (dealersMap) {
      dealersMap.innerHTML = '<p style="color: var(--color-text-light); text-align: center; padding: 2rem;">Loading map...</p>';
    }
    
    // Re-initialize icons after setting innerHTML
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
    
    // Request location and find dealers
    requestLocationAndFindDealers(vehicle);
  });
  
  return false;
}

// Request location permission and find dealers
async function requestLocationAndFindDealers(vehicle) {
  const dealersList = document.getElementById('dealersList');
  const dealersMap = document.getElementById('dealersMap');
  
  try {
    // Request location permission
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by your browser. Please enter a city name instead.');
    }
    
    // Update loading state - requesting permission
    if (dealersList) {
      dealersList.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center;">
          <div class="loading-spinner" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid var(--color-primary); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem;"></div>
          <p style="color: var(--color-text-light); margin-bottom: 0.5rem; font-weight: 500;">Requesting location permission...</p>
          <p style="color: var(--color-text-light); font-size: 0.875rem;">Please allow location access in your browser</p>
        </div>
      `;
    }
    
    // Get user's location with explicit permission request
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve, 
        (error) => {
          // Handle different error types
          let errorMessage = 'Unable to get your location.';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please allow location access or enter a city name manually.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please try entering a city name.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again or enter a city name.';
              break;
            default:
              errorMessage = error.message || 'Unable to get your location. Please enter a city name.';
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // 15 seconds timeout
          maximumAge: 0 // Don't use cached location
        }
      );
    });
    
    const userLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    
    console.log('✅ Location obtained:', userLocation);
    
    // Update loading state - searching for dealers
    if (dealersList) {
      dealersList.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center;">
          <div class="loading-spinner" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid var(--color-primary); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem;"></div>
          <p style="color: var(--color-text-light);">Searching for local dealers...</p>
        </div>
      `;
    }
    
    // Load Google Places API if not already loaded
    try {
      await loadGooglePlacesAPI();
    } catch (apiError) {
      console.error('❌ Error loading Google Places API:', apiError);
      throw new Error('Failed to load Google Maps API. Please check your API key configuration.');
    }
    
    // Search for car dealers using Google Places API
    const dealers = await searchNearbyDealers(userLocation);
    
    // Display results
    displayDealers(dealers, userLocation, vehicle);
    
  } catch (error) {
    console.error('❌ Error getting location:', error);
    
    // Show error message with option to enter location manually
    if (dealersList) {
      const isPermissionDenied = error.message.includes('permission') || error.message.includes('denied');
      
      // Store vehicle data for button handlers
      if (vehicle && typeof window !== 'undefined') {
        window.currentDealerVehicle = vehicle;
      }
      
      dealersList.innerHTML = `
        <div style="padding: 2rem; text-align: center;">
          <i data-lucide="${isPermissionDenied ? 'map-pin-off' : 'alert-circle'}" style="width: 48px; height: 48px; color: var(--color-text-light); margin-bottom: 1rem; display: block;"></i>
          <h4 style="margin-bottom: 0.5rem; color: var(--color-text);">${isPermissionDenied ? 'Location Permission Required' : 'Location Error'}</h4>
          <p style="color: var(--color-text-light); margin-bottom: 1rem; font-size: 0.875rem; line-height: 1.5;">
            ${error.message || 'Unable to get your location. Please try again or enter a location manually.'}
          </p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center;">
            <button class="btn btn-primary btn-sm" id="retryLocationBtn" style="cursor: pointer;">
              <i data-lucide="refresh-cw" style="width: 14px; height: 14px; margin-right: 0.25rem;"></i>
              Try Again
            </button>
            <button class="btn btn-secondary btn-sm" id="enterCityBtn" style="cursor: pointer;">
              <i data-lucide="map-pin" style="width: 14px; height: 14px; margin-right: 0.25rem;"></i>
              Enter City
            </button>
          </div>
        </div>
      `;
      
      // Add event listeners for buttons
      const retryBtn = dealersList.querySelector('#retryLocationBtn');
      const cityBtn = dealersList.querySelector('#enterCityBtn');
      
      if (retryBtn) {
        retryBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          requestLocationAndFindDealers(vehicle);
          return false;
        });
      }
      
      if (cityBtn) {
        cityBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          searchDealersByCity(vehicle);
          return false;
        });
      }
      
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      }
    }
    
    if (dealersMap) {
      dealersMap.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 2rem; text-align: center;">
          <i data-lucide="map" style="width: 48px; height: 48px; color: var(--color-text-light); margin-bottom: 1rem;"></i>
          <p style="color: var(--color-text-light);">Map will appear after location is granted</p>
        </div>
      `;
      
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      }
    }
  }
}

// Load Google Places API script
function loadGooglePlacesAPI() {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
      resolve();
      return;
    }
    
    // Get API key from config.js or window variable
    const GOOGLE_MAPS_API_KEY = window.GOOGLE_MAPS_API_KEY || 
                                 (typeof getGoogleMapsApiKey === 'function' ? getGoogleMapsApiKey() : '') ||
                                 '';
    
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
      console.error('⚠️ Google Maps API key not configured');
      reject(new Error('Google Maps API key not configured. Please configure it in config.js'));
      return;
    }
    
    // Check if script is already being loaded
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`);
    if (existingScript) {
      // Wait for it to load
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      const checkLoaded = setInterval(() => {
        attempts++;
        if (typeof google !== 'undefined' && google.maps && google.maps.places) {
          clearInterval(checkLoaded);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkLoaded);
          reject(new Error('Google Maps API failed to load within timeout'));
        }
      }, 100);
      return;
    }
    
    // Load the script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMapsPlaces`;
    script.async = true;
    script.defer = true;
    
    // Set up callback
    window.initGoogleMapsPlaces = () => {
      if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        console.log('✅ Google Maps Places API loaded successfully');
        resolve();
      } else {
        reject(new Error('Google Maps API failed to initialize'));
      }
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Google Maps API script');
      reject(new Error('Failed to load Google Maps API'));
    };
    
    document.head.appendChild(script);
    
    // Timeout fallback
    setTimeout(() => {
      if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
        reject(new Error('Google Maps API loading timeout'));
      }
    }, 10000); // 10 second timeout
  });
}

// Search for nearby car dealers using Google Places API
async function searchNearbyDealers(userLocation) {
  return new Promise((resolve, reject) => {
    if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
      reject(new Error('Google Maps API not loaded'));
      return;
    }
    
    const map = new google.maps.Map(document.createElement('div'));
    const service = new google.maps.places.PlacesService(map);
    
    const request = {
      location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
      radius: 50000, // 50km radius
      type: 'car_dealer',
      keyword: 'car dealer automotive'
    };
    
    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        // Get detailed info for each place
        const dealersWithDetails = results.slice(0, 10).map(result => ({
          id: result.place_id,
          name: result.name,
          address: result.vicinity || result.formatted_address,
          location: {
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng()
          },
          rating: result.rating || null,
          user_ratings_total: result.user_ratings_total || 0,
          open_now: result.opening_hours ? result.opening_hours.open_now : null,
          icon: result.icon,
          photo: result.photos && result.photos[0] ? result.photos[0].getUrl({ maxWidth: 400 }) : null
        }));
        
        resolve(dealersWithDetails);
      } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resolve([]);
      } else {
        reject(new Error(`Places API error: ${status}`));
      }
    });
  });
}

// Display dealers in the modal
function displayDealers(dealers, userLocation, vehicle) {
  const dealersList = document.getElementById('dealersList');
  const dealersMap = document.getElementById('dealersMap');
  
  // Display dealer list
  if (dealersList) {
    if (dealers.length === 0) {
      dealersList.innerHTML = `
        <div style="padding: 2rem; text-align: center;">
          <i data-lucide="search-x" style="width: 48px; height: 48px; color: var(--color-text-light); margin-bottom: 1rem; display: block;"></i>
          <h4 style="margin-bottom: 0.5rem;">No Dealers Found</h4>
          <p style="color: var(--color-text-light); font-size: 0.875rem;">No car dealers found near your location. Try expanding the search radius or enter a city name.</p>
          <button class="btn btn-primary btn-sm" id="searchByCityBtn" style="margin-top: 1rem;">
            Search by City
          </button>
        </div>
      `;
      
      // Add event listener for search by city button
      const searchCityBtn = dealersList.querySelector('#searchByCityBtn');
      if (searchCityBtn) {
        searchCityBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          searchDealersByCity(vehicle);
          return false;
        });
      }
      
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      }
    } else {
      dealersList.innerHTML = dealers.map((dealer, index) => {
        const safeName = escapeHtml(dealer.name);
        const safeAddress = escapeHtml(dealer.address);
        const ratingStars = dealer.rating ? '★'.repeat(Math.round(dealer.rating)) : '';
        const openStatus = dealer.open_now === true ? '<span style="color: #22c55e; font-size: 0.75rem; font-weight: 600;">● Open Now</span>' : 
                          dealer.open_now === false ? '<span style="color: #ef4444; font-size: 0.75rem; font-weight: 600;">● Closed</span>' : '';
        
        return `
          <div class="dealer-item" style="padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 1rem; cursor: pointer; transition: background 0.2s;" 
               onmouseover="this.style.background='#f5f5f5'; highlightDealerOnMap('${dealer.id}');" 
               onmouseout="this.style.background='white';"
               onclick="showDealerOnMap('${dealer.id}', ${JSON.stringify(dealer).replace(/"/g, '&quot;')})">
            ${dealer.photo ? `<img src="${dealer.photo}" alt="${safeName}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px; margin-bottom: 0.75rem;">` : ''}
            <h4 style="margin: 0 0 0.5rem 0; font-size: 1.125rem; color: var(--color-text);">${safeName}</h4>
            <p style="margin: 0 0 0.5rem 0; color: var(--color-text-light); font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
              <i data-lucide="map-pin" style="width: 16px; height: 16px;"></i>
              ${safeAddress}
            </p>
            ${dealer.rating ? `
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-size: 0.875rem;">
                <span style="color: #fbbf24;">${ratingStars}</span>
                <span style="color: var(--color-text-light);">${dealer.rating.toFixed(1)} (${dealer.user_ratings_total} reviews)</span>
              </div>
            ` : ''}
            ${openStatus ? `<div style="margin-bottom: 0.5rem;">${openStatus}</div>` : ''}
            <button class="btn btn-primary btn-sm" style="margin-top: 0.5rem; width: 100%;" onclick="event.stopPropagation(); openDealerInMaps('${dealer.id}', '${safeName}');">
              View on Google Maps
            </button>
          </div>
        `;
      }).join('');
      
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      }
    }
  }
  
  // Display map with markers
  if (dealersMap && dealers.length > 0) {
    initializeDealersMap(dealers, userLocation);
  } else if (dealersMap) {
    dealersMap.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 2rem; text-align: center;">
        <i data-lucide="map" style="width: 48px; height: 48px; color: var(--color-text-light); margin-bottom: 1rem;"></i>
        <p style="color: var(--color-text-light);">Map will appear when dealers are found</p>
      </div>
    `;
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }
}

// Initialize map with dealer markers
function initializeDealersMap(dealers, userLocation) {
  const mapContainer = document.getElementById('dealersMap');
  if (!mapContainer) return;
  
  const GOOGLE_MAPS_API_KEY = window.GOOGLE_MAPS_API_KEY || '';
  
  if (typeof google === 'undefined' || !google.maps) {
    // Fallback to embed API
    if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY') {
      const firstDealer = dealers[0];
      const query = encodeURIComponent(`${firstDealer.location.lat},${firstDealer.location.lng}`);
      const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${query}&zoom=13`;
      
      mapContainer.innerHTML = `
        <iframe 
          width="100%" 
          height="100%" 
          style="border:0; border-radius: 8px;" 
          loading="lazy" 
          allowfullscreen
          src="${embedUrl}"
          referrerpolicy="no-referrer-when-downgrade"
          title="Dealer locations map">
        </iframe>
      `;
    }
    return;
  }
  
  // Use Google Maps JavaScript API
  const map = new google.maps.Map(mapContainer, {
    center: { lat: userLocation.lat, lng: userLocation.lng },
    zoom: 13,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  });
  
  // Store map and markers globally for highlighting
  window.dealersMapInstance = map;
  window.dealersMarkers = {};
  
  // Add user location marker
  new google.maps.Marker({
    position: userLocation,
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: '#4285F4',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2
    },
    title: 'Your Location'
  });
  
  // Add dealer markers
  dealers.forEach(dealer => {
    const marker = new google.maps.Marker({
      position: { lat: dealer.location.lat, lng: dealer.location.lng },
      map: map,
      title: dealer.name,
      animation: google.maps.Animation.DROP
    });
    
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 0.5rem;">
          <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">${escapeHtml(dealer.name)}</h4>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: #666;">${escapeHtml(dealer.address)}</p>
          ${dealer.rating ? `<p style="margin: 0; font-size: 0.875rem;">Rating: ${dealer.rating.toFixed(1)} ⭐</p>` : ''}
          <button onclick="openDealerInMaps('${dealer.id}', '${escapeHtml(dealer.name)}')" style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: var(--color-primary); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.875rem;">
            View on Google Maps
          </button>
        </div>
      `
    });
    
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
    
    window.dealersMarkers[dealer.id] = { marker, infoWindow };
  });
  
  // Fit bounds to show all markers
  if (dealers.length > 1) {
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(userLocation);
    dealers.forEach(dealer => {
      bounds.extend({ lat: dealer.location.lat, lng: dealer.location.lng });
    });
    map.fitBounds(bounds);
  }
}

// Helper functions
function highlightDealerOnMap(dealerId) {
  if (window.dealersMarkers && window.dealersMarkers[dealerId]) {
    const { marker, infoWindow } = window.dealersMarkers[dealerId];
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => marker.setAnimation(null), 750);
    infoWindow.open(window.dealersMapInstance, marker);
  }
}

function showDealerOnMap(dealerId, dealer) {
  if (window.dealersMarkers && window.dealersMarkers[dealerId]) {
    const { marker, infoWindow } = window.dealersMarkers[dealerId];
    window.dealersMapInstance.setCenter(marker.getPosition());
    window.dealersMapInstance.setZoom(16);
    infoWindow.open(window.dealersMapInstance, marker);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => marker.setAnimation(null), 1500);
  }
}

function openDealerInMaps(placeId, dealerName) {
  const url = `https://www.google.com/maps/place/?q=place_id:${placeId}`;
  window.open(url, '_blank');
}

async function searchDealersByCity(vehicle) {
  // Get vehicle from parameter or from window storage
  if (!vehicle && typeof window !== 'undefined' && window.currentDealerVehicle) {
    vehicle = window.currentDealerVehicle;
  }
  
  const city = prompt('Enter a city name to search for dealers:');
  if (!city) return;
  
  const dealersList = document.getElementById('dealersList');
  if (dealersList) {
    dealersList.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center;">
        <div class="loading-spinner" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid var(--color-primary); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem;"></div>
        <p style="color: var(--color-text-light);">Searching for dealers in ${city}...</p>
      </div>
    `;
  }
  
  try {
    await loadGooglePlacesAPI();
    
    // Geocode the city to get coordinates
    const geocoder = new google.maps.Geocoder();
    const geocodeResult = await new Promise((resolve, reject) => {
      geocoder.geocode({ address: city }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve(results[0].geometry.location);
        } else {
          reject(new Error('City not found'));
        }
      });
    });
    
    const cityLocation = {
      lat: geocodeResult.lat(),
      lng: geocodeResult.lng()
    };
    
    const dealers = await searchNearbyDealers(cityLocation);
    displayDealers(dealers, cityLocation, vehicle);
    
  } catch (error) {
    console.error('Error searching by city:', error);
    if (dealersList) {
      dealersList.innerHTML = `
        <div style="padding: 2rem; text-align: center;">
          <i data-lucide="alert-circle" style="width: 48px; height: 48px; color: #ef4444; margin-bottom: 1rem; display: block;"></i>
          <h4 style="margin-bottom: 0.5rem;">Error</h4>
          <p style="color: var(--color-text-light); font-size: 0.875rem;">${error.message || 'Unable to find dealers in that city. Please try again.'}</p>
          <button class="btn btn-primary btn-sm" id="tryAnotherCityBtn" style="margin-top: 1rem;">
            Try Another City
          </button>
        </div>
      `;
      
      // Add event listener for try another city button
      const tryAnotherBtn = dealersList.querySelector('#tryAnotherCityBtn');
      if (tryAnotherBtn) {
        tryAnotherBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          searchDealersByCity(vehicle || (typeof window !== 'undefined' ? window.currentDealerVehicle : null));
          return false;
        });
      }
      
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      }
    }
  }
}

function createDealersModal() {
  const modal = document.createElement('div');
  modal.id = 'dealersModal';
  modal.className = 'modal-overlay';
  modal.style.cssText = 'display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; align-items: center; justify-content: center; padding: 2rem; overflow-y: auto;';
  
  // Prevent any navigation when clicking on modal
  modal.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only close if clicking the overlay itself, not the content
    if (e.target === modal) {
      closeDealersModal();
    }
    return false;
  }, true); // Use capture phase
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.cssText = 'background: white; border-radius: 12px; max-width: 1000px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 2rem; position: relative;';
  
  // Prevent clicks on modal content from closing the modal
  modalContent.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  modalContent.innerHTML = `
      <button id="dealersModalClose" type="button" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--color-text-light); z-index: 10001; padding: 0.5rem; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;" aria-label="Close modal">
        <i data-lucide="x" style="pointer-events: none;"></i>
      </button>
      <h2 style="margin-bottom: 1.5rem; font-size: 1.75rem;">Find Local Dealers</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;" id="dealersModalContent">
        <div>
          <h3 style="margin-bottom: 1rem; font-size: 1.125rem;">Dealer Locations</h3>
          <div id="dealersList" style="max-height: 60vh; overflow-y: auto;"></div>
        </div>
        <div>
          <h3 style="margin-bottom: 1rem; font-size: 1.125rem;">Map</h3>
          <div id="dealersMap" style="height: 500px; background: #f5f5f5; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 1px solid #e0e0e0;">
            <p style="color: var(--color-text-light);">Loading map...</p>
          </div>
        </div>
      </div>
    `;
  
  // Make modal responsive on mobile
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      #dealersModalContent {
        grid-template-columns: 1fr !important;
        gap: 1.5rem !important;
      }
      #dealersMap {
        height: 300px !important;
      }
      #dealersList {
        max-height: 40vh !important;
      }
    }
  `;
  document.head.appendChild(style);
  
  modal.appendChild(modalContent);
  
  // Add click handler for close button - use event delegation and multiple methods
  const closeBtn = modalContent.querySelector('#dealersModalClose');
  if (closeBtn) {
    // Remove any existing listeners by cloning
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    
    // Add click handler
    newCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      closeDealersModal();
      return false;
    }, true); // Use capture phase
    
    // Also handle clicks on the icon inside
    const icon = newCloseBtn.querySelector('i');
    if (icon) {
      icon.style.pointerEvents = 'none'; // Let clicks pass through to button
    }
  }
  
  // Also use event delegation on the modal content for close button
  modalContent.addEventListener('click', (e) => {
    if (e.target.closest('#dealersModalClose') || e.target.id === 'dealersModalClose') {
      e.preventDefault();
      e.stopPropagation();
      closeDealersModal();
      return false;
    }
  }, true);
  
  // Prevent form submission or navigation
  modal.addEventListener('submit', (e) => {
    e.preventDefault();
    return false;
  }, true);
  
  // Close on ESC key
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      const dealersModal = document.getElementById('dealersModal');
      if (dealersModal && dealersModal.style.display === 'flex') {
        e.preventDefault();
        closeDealersModal();
        return false;
      }
    }
  };
  document.addEventListener('keydown', escHandler);
  
  // Store handler for cleanup if needed
  modal._escHandler = escHandler;
  
  return modal;
}

// Add CSS animation for loading spinner
if (!document.querySelector('#loadingSpinnerStyle')) {
  const style = document.createElement('style');
  style.id = 'loadingSpinnerStyle';
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .loading-spinner {
      animation: spin 1s linear infinite;
    }
  `;
  document.head.appendChild(style);
}

function showDealerOnMap(index, location) {
  // Highlight dealer on map
  console.log('Show dealer on map:', location);
}

function openGoogleMaps(location) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location + ', India')}`;
  window.open(url, '_blank');
}

function closeDealersModal(e) {
  // Prevent any navigation
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
    e.stopPropagation();
  } else if (typeof event !== 'undefined' && event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  const modal = document.getElementById('dealersModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    console.log('✅ Dealers modal closed');
    
    // Clean up vehicle reference
    if (typeof window !== 'undefined') {
      window.currentDealerVehicle = null;
    }
  }
  return false;
}

// ============================================
// PRICE HISTORY CHARTS
// ============================================
function showPriceHistory(vehicleId) {
  const vehicle = vehiclesCache.find(v => v.id === vehicleId);
  if (!vehicle || !vehicle.price_history || vehicle.price_history.length === 0) {
    alert('Price history not available for this vehicle.');
    return;
  }

  let modal = document.getElementById('priceHistoryModal');
  if (!modal) {
    modal = createPriceHistoryModal();
    document.body.appendChild(modal);
  }

  const chartContainer = document.getElementById('priceHistoryChart');
  if (chartContainer) {
    renderPriceChart(vehicle.price_history, chartContainer, vehicle);
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function createPriceHistoryModal() {
  const modal = document.createElement('div');
  modal.id = 'priceHistoryModal';
  modal.className = 'modal-overlay';
  modal.style.cssText = 'display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; align-items: center; justify-content: center; padding: 2rem;';
  
  modal.innerHTML = `
    <div class="modal-content" style="background: white; border-radius: 12px; max-width: 800px; width: 100%; padding: 2rem; position: relative;">
      <button onclick="closePriceHistoryModal();" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--color-text-light);" aria-label="Close">
        <i data-lucide="x"></i>
      </button>
      <h2 style="margin-bottom: 1.5rem; font-size: 1.75rem;">Price History</h2>
      <div id="priceHistoryChart" style="min-height: 400px;"></div>
      <div style="margin-top: 1.5rem; text-align: center;">
        <button class="btn btn-primary" onclick="closePriceHistoryModal();">Close</button>
      </div>
    </div>
  `;
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePriceHistoryModal();
    }
  });
  
  return modal;
}

function renderPriceChart(priceHistory, container, vehicle) {
  // Simple SVG-based chart (in production, use Chart.js, D3.js, or similar)
  const maxPrice = Math.max(...priceHistory.map(p => p.price));
  const minPrice = Math.min(...priceHistory.map(p => p.price));
  const range = maxPrice - minPrice || 1;
  const chartHeight = 300;
  const chartWidth = 700;
  const padding = 40;

  const points = priceHistory.map((point, index) => {
    const x = padding + (index / (priceHistory.length - 1)) * (chartWidth - 2 * padding);
    const y = padding + chartHeight - ((point.price - minPrice) / range) * (chartHeight - 2 * padding);
    return { x, y, ...point };
  });

  let pathData = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathData += ` L ${points[i].x} ${points[i].y}`;
  }

  container.innerHTML = `
    <div style="margin-bottom: 1rem;">
      <h3 style="font-size: 1.125rem; margin-bottom: 0.5rem;">${vehicle.make} ${vehicle.model} ${vehicle.variant || ''}</h3>
      <p style="color: var(--color-text-light); font-size: 0.875rem;">Price trend over time</p>
    </div>
    <svg width="100%" height="${chartHeight + 2 * padding}" viewBox="0 0 ${chartWidth} ${chartHeight + 2 * padding}" style="border: 1px solid #e0e0e0; border-radius: 8px; background: #fafafa;">
      <!-- Grid lines -->
      ${Array.from({ length: 5 }, (_, i) => {
        const y = padding + (i / 4) * (chartHeight - 2 * padding);
        const price = maxPrice - (i / 4) * range;
        return `
          <line x1="${padding}" y1="${y}" x2="${chartWidth - padding}" y2="${y}" stroke="#e0e0e0" stroke-width="1"/>
          <text x="${padding - 10}" y="${y + 4}" font-size="12" fill="#666" text-anchor="end">₹${(price/100000).toFixed(1)}L</text>
        `;
      }).join('')}
      <!-- Chart line -->
      <path d="${pathData}" stroke="var(--color-primary)" stroke-width="3" fill="none"/>
      <!-- Data points -->
      ${points.map(point => `
        <circle cx="${point.x}" cy="${point.y}" r="5" fill="var(--color-primary)"/>
        <text x="${point.x}" y="${point.y - 10}" font-size="10" fill="#666" text-anchor="middle">₹${(point.price/100000).toFixed(1)}L</text>
        <text x="${point.x}" y="${chartHeight + padding + 20}" font-size="10" fill="#666" text-anchor="middle">${point.date}</text>
      `).join('')}
      <!-- Axes -->
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${chartHeight + padding}" stroke="#333" stroke-width="2"/>
      <line x1="${padding}" y1="${chartHeight + padding}" x2="${chartWidth - padding}" y2="${chartHeight + padding}" stroke="#333" stroke-width="2"/>
    </svg>
  `;
}

function closePriceHistoryModal() {
  const modal = document.getElementById('priceHistoryModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// ============================================
// AI RECOMMENDATIONS (SIMILAR VEHICLES)
// ============================================
function showSimilarVehicles(vehicleId) {
  const vehicle = vehiclesCache.find(v => v.id === vehicleId);
  if (!vehicle) return;

  // Find similar vehicles based on make, model, body type, price range
  const similar = vehiclesCache.filter(v => 
    v.id !== vehicleId &&
    (
      v.make === vehicle.make ||
      v.body_type === vehicle.body_type ||
      (v.price_range_min && vehicle.price_range_min && 
       Math.abs(v.price_range_min - vehicle.price_range_min) < 200000)
    )
  ).slice(0, 6);

  if (similar.length === 0) {
    alert('No similar vehicles found.');
    return;
  }

  let modal = document.getElementById('similarVehiclesModal');
  if (!modal) {
    modal = createSimilarVehiclesModal();
    document.body.appendChild(modal);
  }

  const container = document.getElementById('similarVehiclesList');
  if (container) {
    container.innerHTML = `
      <div style="margin-bottom: 1rem; padding: 1rem; background: #f0f7ff; border-radius: 8px;">
        <p style="margin: 0; font-size: 0.875rem; color: var(--color-text);">
          <i data-lucide="sparkles" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle;"></i>
          <strong>AI Recommendations:</strong> Similar to ${vehicle.make} ${vehicle.model}
        </p>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
        ${similar.map(v => `
          <div class="similar-vehicle-card" onclick="window.location.href='#vehicle-${v.id}';" style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1rem; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
            <img src="${v.image_url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop'}" alt="${v.make} ${v.model}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 6px; margin-bottom: 0.75rem;">
            <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">${v.make} ${v.model}</h4>
            <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: var(--color-text-light);">${v.variant || ''}</p>
            <p style="margin: 0; font-size: 1rem; font-weight: 600; color: var(--color-primary);">
              ₹${v.price_range_min ? (v.price_range_min/100000).toFixed(1) + 'L' : 'N/A'}
            </p>
          </div>
        `).join('')}
      </div>
    `;
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

function createSimilarVehiclesModal() {
  const modal = document.createElement('div');
  modal.id = 'similarVehiclesModal';
  modal.className = 'modal-overlay';
  modal.style.cssText = 'display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; align-items: center; justify-content: center; padding: 2rem; overflow-y: auto;';
  
  modal.innerHTML = `
    <div class="modal-content" style="background: white; border-radius: 12px; max-width: 1000px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 2rem; position: relative;">
      <button onclick="closeSimilarVehiclesModal();" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--color-text-light);" aria-label="Close">
        <i data-lucide="x"></i>
      </button>
      <h2 style="margin-bottom: 1.5rem; font-size: 1.75rem;">Similar Vehicles</h2>
      <div id="similarVehiclesList"></div>
      <div style="margin-top: 1.5rem; text-align: center;">
        <button class="btn btn-primary" onclick="closeSimilarVehiclesModal();">Close</button>
      </div>
    </div>
  `;
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeSimilarVehiclesModal();
    }
  });
  
  return modal;
}

function closeSimilarVehiclesModal() {
  const modal = document.getElementById('similarVehiclesModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// ============================================
// USER-SUBMITTED UPDATES
// ============================================
function submitUpdate(vehicleId) {
  const vehicle = vehiclesCache.find(v => v.id === vehicleId);
  if (!vehicle) return;

  let modal = document.getElementById('submitUpdateModal');
  if (!modal) {
    modal = createSubmitUpdateModal();
    document.body.appendChild(modal);
  }

  const vehicleName = document.getElementById('updateVehicleName');
  if (vehicleName) {
    vehicleName.textContent = `${vehicle.make} ${vehicle.model} ${vehicle.variant || ''}`;
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

function createSubmitUpdateModal() {
  const modal = document.createElement('div');
  modal.id = 'submitUpdateModal';
  modal.className = 'modal-overlay';
  modal.style.cssText = 'display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; align-items: center; justify-content: center; padding: 2rem;';
  
  modal.innerHTML = `
    <div class="modal-content" style="background: white; border-radius: 12px; max-width: 600px; width: 100%; padding: 2rem; position: relative;">
      <button onclick="closeSubmitUpdateModal();" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--color-text-light);" aria-label="Close">
        <i data-lucide="x"></i>
      </button>
      <h2 style="margin-bottom: 1rem; font-size: 1.75rem;">Suggest Update</h2>
      <p style="color: var(--color-text-light); margin-bottom: 1.5rem;">Help us keep vehicle information accurate. Your updates will be reviewed by our team.</p>
      <form id="submitUpdateForm" onsubmit="handleUpdateSubmit(event);">
        <div style="margin-bottom: 1rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Vehicle</label>
          <p id="updateVehicleName" style="margin: 0; padding: 0.75rem; background: #f5f5f5; border-radius: 6px; color: var(--color-text-light);"></p>
        </div>
        <div style="margin-bottom: 1rem;">
          <label for="updateField" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Field to Update</label>
          <select id="updateField" class="form-select" required style="width: 100%; padding: 0.75rem; border: 1px solid #e0e0e0; border-radius: 6px;">
            <option value="">Select field...</option>
            <option value="price">Price</option>
            <option value="specifications">Specifications</option>
            <option value="features">Features</option>
            <option value="mileage">Mileage</option>
            <option value="dealer_locations">Dealer Locations</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div style="margin-bottom: 1rem;">
          <label for="updateValue" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Correct Value</label>
          <textarea id="updateValue" class="form-textarea" required rows="4" placeholder="Enter the correct information..." style="width: 100%; padding: 0.75rem; border: 1px solid #e0e0e0; border-radius: 6px; font-family: inherit;"></textarea>
        </div>
        <div style="margin-bottom: 1rem;">
          <label for="updateEmail" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Your Email (Optional)</label>
          <input type="email" id="updateEmail" class="form-input" placeholder="your@email.com" style="width: 100%; padding: 0.75rem; border: 1px solid #e0e0e0; border-radius: 6px;">
        </div>
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button type="button" class="btn btn-secondary" onclick="closeSubmitUpdateModal();">Cancel</button>
          <button type="submit" class="btn btn-primary">Submit Update</button>
        </div>
      </form>
    </div>
  `;
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeSubmitUpdateModal();
    }
  });
  
  return modal;
}

function handleUpdateSubmit(event) {
  event.preventDefault();
  
  const field = document.getElementById('updateField').value;
  const value = document.getElementById('updateValue').value;
  const email = document.getElementById('updateEmail').value;
  
  // In production, submit to backend API
  console.log('Update submitted:', { field, value, email });
  
  alert('Thank you! Your update has been submitted and will be reviewed by our team.');
  closeSubmitUpdateModal();
}

function closeSubmitUpdateModal() {
  const modal = document.getElementById('submitUpdateModal');
  if (modal) {
    const form = document.getElementById('submitUpdateForm');
    if (form) form.reset();
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// ============================================
// DYNAMIC SEO METAS
// ============================================
function updateSEOMeta(vehicle) {
  if (!vehicle || !vehicle.seo_meta) return;

  // Update page title
  if (vehicle.seo_meta.title) {
    document.title = vehicle.seo_meta.title;
  }

  // Update meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  if (vehicle.seo_meta.description) {
    metaDesc.content = vehicle.seo_meta.description;
  }

  // Update meta keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.name = 'keywords';
    document.head.appendChild(metaKeywords);
  }
  if (vehicle.seo_meta.keywords) {
    metaKeywords.content = vehicle.seo_meta.keywords;
  }

  // Update OG tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && vehicle.seo_meta.title) {
    ogTitle.content = vehicle.seo_meta.title;
  }

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && vehicle.seo_meta.description) {
    ogDesc.content = vehicle.seo_meta.description;
  }
}

// Helper function for escaping HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Make all functions globally available
if (typeof window !== 'undefined') {
  window.compareVehicle = compareVehicle;
  window.removeFromComparison = removeFromComparison;
  window.updateComparisonUI = updateComparisonUI;
  window.openComparisonModal = openComparisonModal;
  window.closeComparisonModal = closeComparisonModal;
  window.renderComparisonTable = renderComparisonTable;
  window.open360View = open360View;
  window.close360View = close360View;
  window.findDealers = findDealers;
  window.closeDealersModal = closeDealersModal;
  window.showDealerOnMap = showDealerOnMap;
  window.openGoogleMaps = openGoogleMaps;
  window.openDealerInMaps = openDealerInMaps;
  window.highlightDealerOnMap = highlightDealerOnMap;
  window.requestLocationAndFindDealers = requestLocationAndFindDealers;
  window.searchDealersByCity = searchDealersByCity;
  window.showPriceHistory = showPriceHistory;
  window.closePriceHistoryModal = closePriceHistoryModal;
  window.showSimilarVehicles = showSimilarVehicles;
  window.closeSimilarVehiclesModal = closeSimilarVehiclesModal;
  window.submitUpdate = submitUpdate;
  window.closeSubmitUpdateModal = closeSubmitUpdateModal;
  window.handleUpdateSubmit = handleUpdateSubmit;
  window.updateSEOMeta = updateSEOMeta;
  window.vehiclesCache = vehiclesCache;
  window.comparisonVehicles = comparisonVehicles;
}
