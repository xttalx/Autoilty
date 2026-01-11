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
function findDealers(vehicleId) {
  // Prevent any default behavior and navigation
  try {
    if (typeof event !== 'undefined' && event) {
      event.preventDefault();
      event.stopPropagation();
    }
  } catch (e) {
    // Event might not be available in all contexts
  }
  
  console.log('🔍 findDealers called with vehicleId:', vehicleId);
  
  if (!vehicleId) {
    console.error('❌ Vehicle ID is required');
    alert('Error: Vehicle ID not found. Please try again.');
    return false;
  }
  
  // Try to find vehicle from DOM first (most reliable)
  const card = document.querySelector(`[data-vehicle-id="${vehicleId}"]`);
  let vehicle = null;
  
  if (card && card.dataset.vehicleData) {
    try {
      const vehicleDataStr = card.dataset.vehicleData.replace(/&apos;/g, "'").replace(/&quot;/g, '"');
      vehicle = JSON.parse(vehicleDataStr);
      console.log('✅ Found vehicle from DOM data:', vehicle.make, vehicle.model);
    } catch (e) {
      console.error('Error parsing vehicle data from DOM:', e);
    }
  }
  
  // Fallback: Try to find in window.vehiclesCache (from inventory page)
  if (!vehicle && typeof window !== 'undefined' && window.vehiclesCache) {
    vehicle = window.vehiclesCache.find(v => v && v.id === vehicleId);
    if (vehicle) {
      console.log('✅ Found vehicle from window.vehiclesCache:', vehicle.make, vehicle.model);
    }
  }
  
  // Fallback: Try local vehiclesCache variable
  if (!vehicle && typeof vehiclesCache !== 'undefined' && Array.isArray(vehiclesCache) && vehiclesCache.length > 0) {
    vehicle = vehiclesCache.find(v => v && v.id === vehicleId);
    if (vehicle) {
      console.log('✅ Found vehicle from local cache:', vehicle.make, vehicle.model);
    }
  }
  
  // Fallback: Check window.currentPostings (from marketplace)
  if (!vehicle && typeof window !== 'undefined' && window.currentPostings) {
    vehicle = window.currentPostings.find(v => v && v.id === vehicleId);
    if (vehicle) {
      console.log('✅ Found vehicle from currentPostings:', vehicle.make || vehicle.title);
    }
  }
  
  // If still not found, create a basic vehicle object from the ID
  if (!vehicle) {
    console.warn('Vehicle not found, using fallback data for vehicleId:', vehicleId);
    // Extract make and model from vehicle ID if possible (format: make-model-variant-id)
    const parts = vehicleId.split('-');
    vehicle = {
      id: vehicleId,
      make: parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1).replace(/([A-Z])/g, ' $1').trim() : 'Vehicle',
      model: parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1).replace(/([A-Z])/g, ' $1').trim() : 'Model',
      variant: parts[2] || '',
      dealer_locations: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata']
    };
  }

  let modal = document.getElementById('dealersModal');
  if (!modal) {
    modal = createDealersModal();
    if (modal) {
      document.body.appendChild(modal);
      console.log('✅ Dealers modal created and added to DOM');
    } else {
      console.error('❌ Failed to create dealers modal');
      alert('Unable to open dealers modal. Please try again.');
      return false;
    }
  }

  const locations = vehicle.dealer_locations || vehicle.dealerLocations || ['Mumbai', 'Delhi', 'Bangalore'];
  const mapContainer = document.getElementById('dealersMap');
  const dealersList = document.getElementById('dealersList');

  if (dealersList) {
    dealersList.innerHTML = locations.map((location, index) => {
      const safeLocation = escapeHtml(location);
      const vehicleMake = escapeHtml(vehicle.make || 'Vehicle');
      const vehicleModel = escapeHtml(vehicle.model || '');
      return `
        <div class="dealer-item" style="padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 1rem; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='white'" onclick="if(typeof showDealerOnMap === 'function') { event.stopPropagation(); event.preventDefault(); showDealerOnMap(${index}, '${safeLocation}'); return false; }">
          <h4 style="margin: 0 0 0.5rem 0; font-size: 1.125rem;">${vehicleMake} ${vehicleModel} - ${safeLocation}</h4>
          <p style="margin: 0; color: var(--color-text-light); font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="map-pin" style="width: 16px; height: 16px;"></i>
            ${safeLocation}, India
          </p>
          <button class="btn btn-primary btn-sm" style="margin-top: 0.5rem;" onclick="event.stopPropagation(); event.preventDefault(); if(typeof openGoogleMaps === 'function') { openGoogleMaps('${safeLocation}'); } return false;">
            View on Google Maps
          </button>
        </div>
      `;
    }).join('');
  }

  // Show modal first
  // Show modal - use requestAnimationFrame to ensure DOM is ready
  try {
    requestAnimationFrame(() => {
      if (!modal || !modal.parentNode) {
        console.error('❌ Modal not in DOM, appending...');
        document.body.appendChild(modal);
      }
      
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Prevent any clicks on modal from causing navigation
      modal.style.pointerEvents = 'auto';
      
      console.log('✅ Modal displayed');
      
      // Initialize Google Maps after modal is shown
      setTimeout(() => {
        try {
          initializeGoogleMap(locations);
        } catch (mapError) {
          console.error('❌ Error initializing map:', mapError);
          const mapContainer = document.getElementById('dealersMap');
          if (mapContainer) {
            mapContainer.innerHTML = `
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 2rem; text-align: center;">
                <i data-lucide="alert-circle" style="width: 48px; height: 48px; color: var(--color-text-light); margin-bottom: 1rem;"></i>
                <p style="color: var(--color-text-light);">Map could not be loaded</p>
                <button class="btn btn-primary btn-sm" onclick="if(typeof openGoogleMaps === 'function') { openGoogleMaps('${locations[0] || 'India'}'); } return false;" style="margin-top: 1rem;">
                  Open in Google Maps
                </button>
              </div>
            `;
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
              lucide.createIcons();
            }
          }
        }
      }, 200);
      
      // Re-initialize icons after content is added
      setTimeout(() => {
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
          lucide.createIcons();
        }
        
        // Re-attach close button handler
        const closeBtn = modal.querySelector('#dealersModalClose');
        if (closeBtn) {
          // Remove old listeners
          const newCloseBtn = closeBtn.cloneNode(true);
          closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
          
          newCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            closeDealersModal();
            return false;
          }, true);
        }
      }, 300);
    });
  } catch (error) {
    console.error('❌ Error showing dealers modal:', error);
    alert('Error opening Find Dealers. Please try again.');
    return false;
  }
  
  console.log('✅ Dealers modal opened for vehicle:', vehicle.make, vehicle.model);
  
  // Explicitly prevent navigation - return false
  return false;
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
      <button id="dealersModalClose" type="button" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--color-text-light); z-index: 10001; padding: 0.5rem; display: flex; align-items: center; justify-content: center;" aria-label="Close modal">
        <i data-lucide="x"></i>
      </button>
      <h2 style="margin-bottom: 1.5rem; font-size: 1.75rem;">Find Dealers</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div>
          <h3 style="margin-bottom: 1rem; font-size: 1.125rem;">Dealer Locations</h3>
          <div id="dealersList"></div>
        </div>
        <div>
          <h3 style="margin-bottom: 1rem; font-size: 1.125rem;">Map</h3>
          <div id="dealersMap" style="height: 500px; background: #f5f5f5; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 1px solid #e0e0e0;">
            <p style="color: var(--color-text-light);">Loading map...</p>
          </div>
        </div>
      </div>
    `;
  
  modal.appendChild(modalContent);
  
  // Add click handler for close button immediately
  const closeBtn = modalContent.querySelector('#dealersModalClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      closeDealersModal();
      return false;
    }, true); // Use capture phase
  }
  
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

function initializeGoogleMap(locations) {
  // Get API key from config.js file (public/config.js) or environment
  const GOOGLE_MAPS_API_KEY = window.GOOGLE_MAPS_API_KEY || '';
  
  console.log('🗺️  Initializing Google Map with API key:', GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing');
  console.log('📍 Locations:', locations);
  
  const mapContainer = document.getElementById('dealersMap');
  if (!mapContainer) {
    console.error('Map container not found');
    return;
  }
  
  // Option 1: Using Google Maps Embed API (simpler, no JavaScript SDK needed)
  // Check if API key is valid (starts with AIza and is long enough)
  const isValidApiKey = GOOGLE_MAPS_API_KEY && 
      GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY' && 
      GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY_HERE' &&
      GOOGLE_MAPS_API_KEY.length > 30 &&
      GOOGLE_MAPS_API_KEY.startsWith('AIza');
  
  // Option 2: Check if Google Maps JavaScript API is available
  const hasGoogleMapsJS = typeof google !== 'undefined' && google.maps;
  
  if (isValidApiKey) {
    // Use Embed API (simpler, works without JavaScript SDK)
    const firstLocation = locations[0] || 'India';
    const query = encodeURIComponent(firstLocation + ', India');
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${query}`;
    
    console.log('✅ Loading Google Maps embed for:', firstLocation);
    
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
  } else if (hasGoogleMapsJS) {
    // Use JavaScript API (more features, interactive maps with markers)
    console.log('✅ Using Google Maps JavaScript API');
    const map = new google.maps.Map(mapContainer, {
      center: { lat: 20.5937, lng: 78.9629 }, // Center of India
      zoom: 5,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });
    
    // Add markers for each dealer location
    const geocoder = new google.maps.Geocoder();
    locations.forEach(location => {
      geocoder.geocode({ address: location + ', India' }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            title: location
          });
          
          const infoWindow = new google.maps.InfoWindow({
            content: `<strong>${location}</strong><br>Dealer Location`
          });
          
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        }
      });
    });
  } else {
    // Fallback: Show placeholder with links to Google Maps
    console.warn('⚠️  Google Maps API key not configured or invalid. Showing fallback.');
    mapContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 2rem; text-align: center;">
        <i data-lucide="map-pin" style="width: 48px; height: 48px; color: var(--color-text-light); margin-bottom: 1rem;"></i>
        <p style="color: var(--color-text-light); margin-bottom: 0.5rem; font-weight: 500;">Google Maps</p>
        <p style="font-size: 0.875rem; color: var(--color-text-light); margin-bottom: 1rem;">Click below to view locations on Google Maps</p>
        ${locations.map((loc, idx) => `
          <button class="btn btn-primary btn-sm" onclick="if(typeof openGoogleMaps === 'function') { openGoogleMaps('${escapeHtml(loc)}'); } return false;" style="width: 100%; margin-bottom: 0.5rem;">
            View ${escapeHtml(loc)} on Maps
          </button>
        `).join('')}
      </div>
    `;
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }
}

function showDealerOnMap(index, location) {
  // Highlight dealer on map
  console.log('Show dealer on map:', location);
}

function openGoogleMaps(location) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location + ', India')}`;
  window.open(url, '_blank');
}

function closeDealersModal() {
  // Prevent any navigation
  if (typeof event !== 'undefined' && event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  const modal = document.getElementById('dealersModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    console.log('✅ Dealers modal closed');
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
