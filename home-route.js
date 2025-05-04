// Home Route Search Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let map;
    let directionsService;
    let directionsRenderer;
    let autocompleteStart;
    let autocompleteEnd;
    let currentRoute;
    let routeAlternatives = [];
    let selectedTravelMode = 'WALKING';
    
    // Get DOM elements
    const startLocationInput = document.getElementById('start-location');
    const endLocationInput = document.getElementById('end-location');
    const currentLocationBtn = document.getElementById('current-location-btn');
    const findRouteBtn = document.getElementById('find-route-btn');
    const routeResults = document.getElementById('route-results');
    const travelModeBtns = document.querySelectorAll('.travel-mode-btn');
    
    // Initialize Google Maps services
    function initMapServices() {
        // Initialize directions service and renderer
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: false,
            polylineOptions: {
                strokeColor: '#0D47A1',
                strokeWeight: 5,
                strokeOpacity: 0.7
            }
        });
        
        // Set up map (will be used for directions)
        map = new google.maps.Map(document.getElementById('map-background'), {
            center: { lat: -26.2041, lng: 28.0473 }, // Johannesburg
            zoom: 13,
            mapTypeControl: false,
            zoomControl: true,
            streetViewControl: false,
            fullscreenControl: false
        });
        
        // Attach directions renderer to map
        directionsRenderer.setMap(map);
        
        // Initialize autocomplete for location inputs
        autocompleteStart = new google.maps.places.Autocomplete(startLocationInput, {
            types: ['geocode']
        });
        
        autocompleteEnd = new google.maps.places.Autocomplete(endLocationInput, {
            types: ['geocode']
        });
    }
    
    // Initialize event listeners
    function initEventListeners() {
        // Current location button
        currentLocationBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                // Show loading state
                currentLocationBtn.innerHTML = '<span class="material-icons loading-spinner">sync</span>';
                
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        const pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        
                        // Use reverse geocoding to get address (simulated)
                        startLocationInput.value = 'Current Location';
                        
                        // Reset button
                        currentLocationBtn.innerHTML = '<span class="material-icons">my_location</span>';
                        
                        // Center map on current location
                        map.setCenter(pos);
                        
                        // Add marker for current location
                        new google.maps.Marker({
                            position: pos,
                            map: map,
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 10,
                                fillColor: "#4285F4",
                                fillOpacity: 1,
                                strokeColor: "#FFFFFF",
                                strokeWeight: 2
                            },
                            title: "Your Location"
                        });
                    },
                    function(error) {
                        console.error("Error getting location:", error);
                        alert("Could not get your location. Please enter it manually.");
                        currentLocationBtn.innerHTML = '<span class="material-icons">my_location</span>';
                    }
                );
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        });
        
        // Find route button
        findRouteBtn.addEventListener('click', function() {
            const startLocation = startLocationInput.value;
            const endLocation = endLocationInput.value;
            
            if (!startLocation || !endLocation) {
                alert("Please enter both starting point and destination.");
                return;
            }
            
            calculateRoute(startLocation, endLocation, selectedTravelMode);
        });
        
        // Travel mode buttons
        travelModeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                travelModeBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update selected travel mode
                selectedTravelMode = this.dataset.mode;
            });
        });
    }
    
    // Calculate route
    function calculateRoute(origin, destination, travelMode) {
        // Show loading state
        findRouteBtn.innerHTML = '<span class="loading-spinner"></span> Finding Routes...';
        findRouteBtn.disabled = true;
        
        // Create loading overlay if it doesn't exist
        let loadingOverlay = document.getElementById('route-loading-overlay');
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'route-loading-overlay';
            loadingOverlay.className = 'route-loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="loading-content">
                    <div class="loading-spinner large"></div>
                    <div class="loading-text">
                        <h3>Finding the Safest Route</h3>
                        <p>Analyzing safety factors and calculating optimal path...</p>
                    </div>
                </div>
            `;
            document.body.appendChild(loadingOverlay);
        }
        
        // Show loading overlay
        loadingOverlay.style.display = 'flex';
        
        // Request directions
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode[travelMode],
            provideRouteAlternatives: true,
            optimizeWaypoints: true
        }, function(response, status) {
            // Add a slight delay to make the loading more visible
            setTimeout(() => {
                // Reset button state
                findRouteBtn.textContent = "Find Safest Route";
                findRouteBtn.disabled = false;
                
                // Hide loading overlay
                loadingOverlay.style.display = 'none';
                
                if (status === 'OK') {
                    // Store routes
                    currentRoute = response.routes[0];
                    routeAlternatives = response.routes;
                    
                    // Display the route on the map
                    directionsRenderer.setDirections(response);
                    
                    // Create route results HTML
                    createRouteResults(routeAlternatives);
                    
                    // Show route results
                    routeResults.style.display = 'block';
                    routeResults.classList.add('fade-in');
                    
                    // Scroll to results
                    routeResults.scrollIntoView({ behavior: 'smooth' });
                    
                    // Show success message
                    showRouteMessage('success', 'Safe route found! We\'ve identified the safest path to your destination.');
                } else {
                    // Show error message
                    showRouteMessage('error', `Could not calculate route: ${status}. Please try again.`);
                }
            }, 1500);
        });
    }
    
    // Create route results HTML
    function createRouteResults(routes) {
        if (!routes || routes.length === 0) return;
        
        // Get the main route
        const mainRoute = routes[0];
        const distance = mainRoute.legs[0].distance.text;
        const duration = mainRoute.legs[0].duration.text;
        
        // Generate a safety score (in a real app, this would be calculated based on actual data)
        const safetyScore = Math.floor(Math.random() * 16) + 75; // Random score between 75-90
        
        // Create HTML for route results
        routeResults.innerHTML = `
            <div class="route-header">
                <div class="route-safety-score">
                    <div class="safety-score-circle">
                        <span id="safety-score">${safetyScore}</span>
                    </div>
                    <span>Safety Score</span>
                </div>
                <div class="route-info">
                    <div class="route-distance">
                        <span class="material-icons">straighten</span>
                        <span id="route-distance">${distance}</span>
                    </div>
                    <div class="route-time">
                        <span class="material-icons">schedule</span>
                        <span id="route-duration">${duration}</span>
                    </div>
                </div>
            </div>

            <div class="route-safety-factors">
                <h3>Safety Analysis</h3>
                <div class="safety-factors-grid">
                    <div class="safety-factor">
                        <div class="factor-icon crime">
                            <span class="material-icons">local_police</span>
                        </div>
                        <div class="factor-details">
                            <span class="factor-name">Crime Rate</span>
                            <div class="factor-bar-container">
                                <div id="crime-rate-bar" class="factor-bar" style="width: ${Math.min(safetyScore + 5, 100)}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="safety-factor">
                        <div class="factor-icon lighting">
                            <span class="material-icons">lightbulb</span>
                        </div>
                        <div class="factor-details">
                            <span class="factor-name">Lighting</span>
                            <div class="factor-bar-container">
                                <div id="lighting-bar" class="factor-bar" style="width: ${Math.min(safetyScore - 5, 100)}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="safety-factor">
                        <div class="factor-icon traffic">
                            <span class="material-icons">groups</span>
                        </div>
                        <div class="factor-details">
                            <span class="factor-name">Foot Traffic</span>
                            <div class="factor-bar-container">
                                <div id="foot-traffic-bar" class="factor-bar" style="width: ${Math.min(safetyScore + 10, 100)}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="safety-factor">
                        <div class="factor-icon police">
                            <span class="material-icons">local_police</span>
                        </div>
                        <div class="factor-details">
                            <span class="factor-name">Police Presence</span>
                            <div class="factor-bar-container">
                                <div id="police-bar" class="factor-bar" style="width: ${Math.min(safetyScore - 10, 100)}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="route-insights">
                <h3>Safety Insights</h3>
                <ul id="safety-insights" class="insights-list">
                    <li>This route generally avoids high-crime areas</li>
                    <li>Good lighting along most of the route</li>
                    <li>Moderate foot traffic provides additional safety</li>
                    <li>Route passes near a police station</li>
                </ul>
            </div>

            <div class="route-actions">
                <button id="start-navigation-btn" class="primary-button">Start Navigation</button>
                <button id="new-route-btn" class="secondary-button">New Route</button>
            </div>
        `;
        
        // Add event listeners to new buttons
        document.getElementById('start-navigation-btn').addEventListener('click', function() {
            alert('Navigation started! In a real app, this would launch turn-by-turn navigation.');
        });
        
        document.getElementById('new-route-btn').addEventListener('click', function() {
            routeResults.style.display = 'none';
            startLocationInput.focus();
        });
    }
    
    // Show route message
    function showRouteMessage(type, message) {
        // Create message element if it doesn't exist
        let messageElement = document.querySelector('.route-message');
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'route-message';
            document.querySelector('.route-form').appendChild(messageElement);
        }
        
        // Set message content and type
        messageElement.textContent = message;
        messageElement.className = `route-message ${type}`;
        
        // Show message
        messageElement.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => {
                messageElement.style.display = 'none';
                messageElement.classList.remove('fade-out');
            }, 500);
        }, 5000);
    }
    
    // Initialize map services
    initMapServices();
    
    // Initialize event listeners
    initEventListeners();
});
