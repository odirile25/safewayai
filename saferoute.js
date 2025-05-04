// Safe Route functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize map and route elements
    const routeMap = document.getElementById('route-map');
    const startLocationInput = document.getElementById('start-location');
    const endLocationInput = document.getElementById('end-location');
    const currentLocationBtn = document.getElementById('current-location-btn');
    const travelModeBtns = document.querySelectorAll('.travel-mode-btn');
    const findRouteBtn = document.getElementById('find-route-btn');
    const routeResults = document.getElementById('route-results');
    const safetyScore = document.getElementById('safety-score');
    const routeDistance = document.getElementById('route-distance');
    const routeDuration = document.getElementById('route-duration');
    const safetyInsights = document.getElementById('safety-insights');
    const cautionAreas = document.getElementById('caution-areas');
    const routeOptionBtns = document.querySelectorAll('.route-option-btn');
    const startNavigationBtn = document.getElementById('start-navigation-btn');
    const newRouteBtn = document.getElementById('new-route-btn');

    // Safety factor bars
    const crimeRateBar = document.getElementById('crime-rate-bar');
    const lightingBar = document.getElementById('lighting-bar');
    const footTrafficBar = document.getElementById('foot-traffic-bar');
    const policeBar = document.getElementById('police-bar');

    // Map variables
    let map;
    let directionsService;
    let directionsRenderer;
    let currentPosition;
    let selectedTravelMode = 'WALKING';
    let currentRoute = null;
    let routeAlternatives = [];

    // Safety factors and their weights (based on project documentation)
    const safetyFactors = {
        "crime_rate": 0.30,
        "lighting": 0.15,
        "foot_traffic": 0.15,
        "police_presence": 0.10,
        "time_of_day": 0.10,
        "surveillance": 0.10,
        "road_quality": 0.05,
        "emergency_services": 0.05
    };

    // Initialize Google Maps
    function initMap() {
        // Default to Johannesburg if location not available
        const defaultLocation = { lat: -26.2041, lng: 28.0473 };

        // Create the map
        map = new google.maps.Map(routeMap, {
            center: defaultLocation,
            zoom: 14,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP
            },
            scaleControl: true,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP
            },
            fullscreenControl: true
        });

        // Initialize the directions service and renderer
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: false,
            polylineOptions: {
                strokeColor: '#2196F3',
                strokeWeight: 5,
                strokeOpacity: 0.7
            }
        });

        // Initialize Places Autocomplete for inputs
        const startAutocomplete = new google.maps.places.Autocomplete(startLocationInput);
        const endAutocomplete = new google.maps.places.Autocomplete(endLocationInput);

        // Get current location
        getCurrentLocation();
    }

    // Get current location
    function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // Success callback
                (position) => {
                    currentPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    // Center map on current location
                    map.setCenter(currentPosition);

                    // Add a marker for current location
                    new google.maps.Marker({
                        position: currentPosition,
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

                    console.log("Location obtained successfully");
                },
                // Error callback
                (error) => {
                    console.error("Error getting location:", error);
                },
                // Options
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser");
        }
    }

    // Set current location as starting point
    currentLocationBtn.addEventListener('click', function() {
        if (currentPosition) {
            // Reverse geocode to get address
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: currentPosition }, function(results, status) {
                if (status === 'OK' && results[0]) {
                    startLocationInput.value = results[0].formatted_address;
                } else {
                    startLocationInput.value = `Current Location (${currentPosition.lat.toFixed(6)}, ${currentPosition.lng.toFixed(6)})`;
                }
            });
        } else {
            alert("Unable to determine your current location. Please try again or enter manually.");
        }
    });

    // Handle travel mode selection
    travelModeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            travelModeBtns.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Update selected travel mode
            selectedTravelMode = this.getAttribute('data-mode');
        });
    });

    // Find route button click handler
    findRouteBtn.addEventListener('click', function() {
        // Validate inputs
        if (!startLocationInput.value.trim()) {
            alert("Please enter a starting location");
            return;
        }

        if (!endLocationInput.value.trim()) {
            alert("Please enter a destination");
            return;
        }

        // Calculate route
        calculateRoute(startLocationInput.value, endLocationInput.value, selectedTravelMode);
    });

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

                    // Analyze safety for all routes
                    analyzeRouteSafety(routeAlternatives);

                    // Show route results with animation
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

    // Analyze route safety using AI algorithms
    function analyzeRouteSafety(routes) {
        // Show AI analysis indicator
        showAiAnalysisIndicator();

        // In a real app, this would use actual AI models to analyze crime data, lighting, etc.
        // For demo purposes, we'll simulate AI analysis with a delay and more sophisticated factors

        setTimeout(() => {
            // Hide AI analysis indicator
            hideAiAnalysisIndicator();

            // Get current time of day
            const hour = new Date().getHours();
            let timeOfDay;
            if (hour >= 6 && hour < 9) timeOfDay = "morning_rush";
            else if (hour >= 9 && hour < 17) timeOfDay = "daytime";
            else if (hour >= 17 && hour < 20) timeOfDay = "evening_rush";
            else if (hour >= 20 && hour < 23) timeOfDay = "evening";
            else timeOfDay = "night";

            // Process each route with "AI" analysis
            routes.forEach((route, index) => {
                // Generate safety scores for each factor
                const factorScores = generateSafetyFactorScores(route, timeOfDay);

                // Calculate overall safety score with AI weighting
                let overallScore = 0;
                const aiWeights = {
                    "crime_rate": 0.35,
                    "lighting": 0.20,
                    "foot_traffic": 0.15,
                    "police_presence": 0.10,
                    "time_of_day": 0.10,
                    "surveillance": 0.05,
                    "road_quality": 0.03,
                    "emergency_services": 0.02
                };

                for (const [factor, score] of Object.entries(factorScores)) {
                    overallScore += score * (aiWeights[factor] || 0);
                }

                // Round to nearest integer
                overallScore = Math.round(overallScore);

                // Store safety data with the route
                route.safetyData = {
                    overallScore: overallScore,
                    factorScores: factorScores,
                    insights: generateSafetyInsights(factorScores, timeOfDay),
                    cautionAreas: generateCautionAreas(route),
                    aiAnalysis: true
                };
            });

            // Sort routes by safety score (highest first)
            routes.sort((a, b) => b.safetyData.overallScore - a.safetyData.overallScore);

            // Update UI with the safest route
            updateRouteUI(routes[0]);

            // Update route options
            updateRouteOptions(routes);

            // Show AI badge to indicate AI-powered analysis
            showAiBadge();
        }, 2500);
    }

    // Show AI analysis indicator
    function showAiAnalysisIndicator() {
        // Create indicator if it doesn't exist
        if (!document.getElementById('ai-analysis-indicator')) {
            const indicator = document.createElement('div');
            indicator.id = 'ai-analysis-indicator';
            indicator.className = 'ai-analysis-indicator';
            indicator.innerHTML = `
                <div class="ai-analysis-content">
                    <div class="ai-analysis-icon">
                        <span class="material-icons">smart_toy</span>
                    </div>
                    <div class="ai-analysis-text">
                        <h4>AI Safety Analysis</h4>
                        <p>Analyzing multiple safety factors...</p>
                    </div>
                    <div class="ai-analysis-progress">
                        <div class="analysis-progress-bar"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(indicator);
        }

        // Show indicator
        document.getElementById('ai-analysis-indicator').style.display = 'flex';
    }

    // Hide AI analysis indicator
    function hideAiAnalysisIndicator() {
        const indicator = document.getElementById('ai-analysis-indicator');
        if (indicator) {
            indicator.classList.add('fade-out');
            setTimeout(() => {
                indicator.style.display = 'none';
                indicator.classList.remove('fade-out');
            }, 500);
        }
    }

    // Show AI badge
    function showAiBadge() {
        // Add AI badge to safety score
        const safetyScoreElement = document.querySelector('.route-safety-score');
        if (safetyScoreElement && !document.querySelector('.ai-powered-badge')) {
            const aiBadge = document.createElement('div');
            aiBadge.className = 'ai-powered-badge';
            aiBadge.innerHTML = `
                <span class="material-icons">smart_toy</span>
                <span>AI Powered</span>
            `;
            safetyScoreElement.appendChild(aiBadge);

            // Add animation
            setTimeout(() => {
                aiBadge.classList.add('show');
            }, 100);
        }
    }

    // Generate safety factor scores
    function generateSafetyFactorScores(route, timeOfDay) {
        // In a real app, these would be calculated based on real data
        // For demo purposes, we'll generate simulated scores

        // Base scores
        const baseScores = {
            "crime_rate": 75,
            "lighting": 80,
            "foot_traffic": 70,
            "police_presence": 65,
            "time_of_day": 90,
            "surveillance": 60,
            "road_quality": 85,
            "emergency_services": 75
        };

        // Adjust based on time of day
        const timeFactors = {
            "morning_rush": { "foot_traffic": 1.2, "crime_rate": 1.1, "time_of_day": 1.1 },
            "daytime": { "foot_traffic": 1.0, "crime_rate": 1.2, "time_of_day": 1.2 },
            "evening_rush": { "foot_traffic": 1.2, "crime_rate": 0.9, "time_of_day": 1.0 },
            "evening": { "foot_traffic": 0.8, "crime_rate": 0.8, "lighting": 0.9, "time_of_day": 0.8 },
            "night": { "foot_traffic": 0.5, "crime_rate": 0.6, "lighting": 0.7, "time_of_day": 0.6 }
        };

        // Apply time of day adjustments
        const adjustedScores = { ...baseScores };
        for (const [factor, adjustment] of Object.entries(timeFactors[timeOfDay] || {})) {
            adjustedScores[factor] = Math.min(100, Math.max(0, Math.round(adjustedScores[factor] * adjustment)));
        }

        // Adjust based on route characteristics
        // In a real app, this would analyze the actual route
        // For demo purposes, we'll use the route's distance and duration
        const distance = route.legs[0].distance.value; // in meters
        const duration = route.legs[0].duration.value; // in seconds

        // Longer routes might go through more varied areas
        if (distance > 5000) {
            adjustedScores.crime_rate = Math.max(0, adjustedScores.crime_rate - 5);
            adjustedScores.police_presence = Math.max(0, adjustedScores.police_presence - 5);
        }

        // Routes with many steps might be more complex and potentially less safe
        if (route.legs[0].steps.length > 10) {
            adjustedScores.foot_traffic = Math.max(0, adjustedScores.foot_traffic - 5);
        }

        // Add some randomness to simulate different routes
        for (const factor in adjustedScores) {
            const randomAdjustment = Math.floor(Math.random() * 10) - 5; // -5 to +5
            adjustedScores[factor] = Math.min(100, Math.max(0, adjustedScores[factor] + randomAdjustment));
        }

        return adjustedScores;
    }

    // Generate safety insights
    function generateSafetyInsights(factorScores, timeOfDay) {
        const insights = [];

        // Crime rate insights
        if (factorScores.crime_rate >= 85) {
            insights.push("This route passes through areas with very low crime rates");
        } else if (factorScores.crime_rate >= 70) {
            insights.push("This route generally avoids high-crime areas");
        } else if (factorScores.crime_rate >= 50) {
            insights.push("Some areas along this route have moderate crime rates");
        } else {
            insights.push("Exercise caution - some areas have higher crime rates");
        }

        // Lighting insights
        if (timeOfDay === "night" || timeOfDay === "evening") {
            if (factorScores.lighting >= 80) {
                insights.push("Well-lit route even during evening/night hours");
            } else if (factorScores.lighting >= 60) {
                insights.push("Moderate lighting along most of the route");
            } else {
                insights.push("Limited lighting in some areas - extra caution advised at night");
            }
        }

        // Foot traffic insights
        if (factorScores.foot_traffic >= 80) {
            insights.push("High foot traffic provides additional safety");
        } else if (factorScores.foot_traffic >= 60) {
            insights.push("Moderate foot traffic along most of the route");
        } else {
            insights.push("Some sections have limited foot traffic");
        }

        // Police presence
        if (factorScores.police_presence >= 80) {
            insights.push("Good police presence in the area");
        } else if (factorScores.police_presence >= 60) {
            insights.push("Route passes near a police station");
        }

        // Time-specific advice
        if (timeOfDay === "night") {
            insights.push("Take extra precautions when traveling at night");
        }

        return insights;
    }

    // Generate caution areas
    function generateCautionAreas(route) {
        // In a real app, this would use actual report data from the Whistle Blower feature
        // For demo purposes, we'll generate simulated caution areas

        const cautionTypes = [
            {
                title: "Recent suspicious activity reported",
                description: "Multiple reports of suspicious individuals in this area"
            },
            {
                title: "Poor lighting conditions",
                description: "Street lights reported to be non-functional in this section"
            },
            {
                title: "Road hazard reported",
                description: "Pothole or obstruction reported in the last 24 hours"
            },
            {
                title: "Recent incident reported",
                description: "Minor theft reported in this area within the last week"
            }
        ];

        // Randomly decide if this route has caution areas
        const hasCautionAreas = Math.random() > 0.5;

        if (!hasCautionAreas) {
            return [];
        }

        // Generate 1-2 caution areas
        const numCautions = Math.floor(Math.random() * 2) + 1;
        const cautions = [];

        for (let i = 0; i < numCautions; i++) {
            // Get a random step from the route
            const steps = route.legs[0].steps;
            const randomStep = steps[Math.floor(Math.random() * steps.length)];

            // Get a random caution type
            const cautionType = cautionTypes[Math.floor(Math.random() * cautionTypes.length)];

            // Create a caution area
            cautions.push({
                location: randomStep.instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
                title: cautionType.title,
                description: cautionType.description
            });
        }

        return cautions;
    }

    // Update route UI
    function updateRouteUI(route) {
        // Update safety score
        const score = route.safetyData.overallScore;
        safetyScore.textContent = score;

        // Update safety score color
        const scoreCircle = document.querySelector('.safety-score-circle');
        if (score >= 80) {
            scoreCircle.style.backgroundColor = '#4caf50'; // Green
        } else if (score >= 60) {
            scoreCircle.style.backgroundColor = '#ff9800'; // Orange
        } else {
            scoreCircle.style.backgroundColor = '#f44336'; // Red
        }

        // Update route info
        routeDistance.textContent = route.legs[0].distance.text;
        routeDuration.textContent = route.legs[0].duration.text;

        // Update safety factor bars
        const factors = route.safetyData.factorScores;
        crimeRateBar.style.width = `${factors.crime_rate}%`;
        lightingBar.style.width = `${factors.lighting}%`;
        footTrafficBar.style.width = `${factors.foot_traffic}%`;
        policeBar.style.width = `${factors.police_presence}%`;

        // Update safety insights
        safetyInsights.innerHTML = '';
        route.safetyData.insights.forEach(insight => {
            const li = document.createElement('li');
            li.textContent = insight;
            safetyInsights.appendChild(li);
        });

        // Update caution areas
        cautionAreas.innerHTML = '';
        if (route.safetyData.cautionAreas.length === 0) {
            cautionAreas.innerHTML = '<p class="no-cautions">No caution areas identified along this route</p>';
        } else {
            route.safetyData.cautionAreas.forEach(caution => {
                const cautionItem = document.createElement('div');
                cautionItem.className = 'caution-item';
                cautionItem.innerHTML = `
                    <div class="caution-icon">
                        <span class="material-icons">warning</span>
                    </div>
                    <div class="caution-details">
                        <h4>${caution.title}</h4>
                        <p>${caution.description} near ${caution.location}</p>
                    </div>
                `;
                cautionAreas.appendChild(cautionItem);
            });
        }
    }

    // Update route options
    function updateRouteOptions(routes) {
        // We'll show up to 3 route options
        const numOptions = Math.min(3, routes.length);

        // Update each option button
        for (let i = 0; i < numOptions; i++) {
            const route = routes[i];
            const button = routeOptionBtns[i];

            // Update safety score
            button.querySelector('.option-safety span:last-child').textContent = `${route.safetyData.overallScore}%`;

            // Update duration
            button.querySelector('.option-time span:last-child').textContent = route.legs[0].duration.text;

            // Add click handler
            button.onclick = function() {
                // Remove active class from all buttons
                routeOptionBtns.forEach(btn => btn.classList.remove('active'));

                // Add active class to clicked button
                this.classList.add('active');

                // Update the displayed route
                directionsRenderer.setRouteIndex(i);

                // Update UI with the selected route
                updateRouteUI(route);
            };
        }
    }

    // Start navigation button
    startNavigationBtn.addEventListener('click', function() {
        // In a real app, this would launch turn-by-turn navigation
        // For demo purposes, we'll just show an alert
        alert("Navigation started! In a real app, this would launch turn-by-turn navigation.");

        // Open Google Maps with the route (as a demonstration)
        const start = encodeURIComponent(startLocationInput.value);
        const end = encodeURIComponent(endLocationInput.value);
        const mode = selectedTravelMode.toLowerCase();

        window.open(`https://www.google.com/maps/dir/?api=1&origin=${start}&destination=${end}&travelmode=${mode}`, '_blank');
    });

    // New route button
    newRouteBtn.addEventListener('click', function() {
        // Hide results and scroll back to form
        routeResults.style.display = 'none';
        document.querySelector('.route-form').scrollIntoView({ behavior: 'smooth' });
    });

    // Initialize the map
    initMap();
});
