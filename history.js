// History functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    initMap();
    
    // Get filter elements
    const filterType = document.getElementById('filter-type');
    const filterDate = document.getElementById('filter-date');
    
    // Get timeline elements
    const timelineSections = document.querySelectorAll('.timeline-section');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Get modal elements
    const alertDetailsModal = document.getElementById('alert-details-modal');
    const alertDetailsContent = document.getElementById('alert-details-content');
    const closeModalBtns = document.querySelectorAll('.close-modal-btn');
    
    // Get load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    // Sample alert data (in a real app, this would come from a database)
    const alertData = [
        {
            id: 'ALT-2023-05-15-001',
            type: 'emergency',
            title: 'Emergency Button Pressed',
            description: 'Emergency alert triggered manually. Alerts sent to 3 emergency contacts.',
            date: '2023-05-15',
            time: '10:45 AM',
            location: 'Central Park, Johannesburg',
            coordinates: { lat: -26.1975, lng: 28.0568 },
            contacts: ['Sarah Doe', 'Michael Doe', 'Emergency Services'],
            status: 'Resolved',
            resolution: 'False alarm confirmed by user at 10:52 AM',
            details: 'Button pressed during app demonstration. No actual emergency.'
        },
        {
            id: 'ALT-2023-05-15-002',
            type: 'system',
            title: 'Safety Check Completed',
            description: 'Routine safety check completed. No issues detected.',
            date: '2023-05-15',
            time: '9:30 AM',
            status: 'Completed',
            details: 'Automatic safety check performed. All systems functioning normally.'
        },
        {
            id: 'ALT-2023-05-14-001',
            type: 'danger',
            title: 'Danger Detected',
            description: 'Unusual activity detected in your vicinity. Safety alert triggered.',
            date: '2023-05-14',
            time: '8:15 PM',
            location: 'Main Street & 5th Avenue',
            coordinates: { lat: -26.2041, lng: 28.0473 },
            status: 'Resolved',
            resolution: 'User marked as safe at 8:30 PM',
            details: 'AI detected unusual movement patterns consistent with potential confrontation. Alert automatically triggered.'
        },
        // More sample data would be here in a real app
    ];
    
    // Initialize Google Maps
    function initMap() {
        // Default to Johannesburg if location not available
        const defaultLocation = { lat: -26.2041, lng: 28.0473 };
        
        // Create the map
        const map = new google.maps.Map(document.getElementById('map-background'), {
            center: defaultLocation,
            zoom: 14,
            mapTypeControl: false,
            zoomControl: false,
            streetViewControl: false,
            fullscreenControl: false
        });
        
        // Get current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // Success callback
                (position) => {
                    const currentPosition = {
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
                },
                // Error callback
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    }
    
    // Filter timeline items
    function filterTimelineItems() {
        const typeFilter = filterType.value;
        const dateFilter = filterDate.value;
        
        // Show all sections initially
        timelineSections.forEach(section => {
            section.style.display = 'block';
        });
        
        // Filter items by type
        timelineItems.forEach(item => {
            let showItem = true;
            
            // Apply type filter
            if (typeFilter !== 'all' && !item.classList.contains(typeFilter)) {
                showItem = false;
            }
            
            // Apply date filter (in a real app, this would be more sophisticated)
            if (dateFilter !== 'all') {
                const sectionTitle = item.closest('.timeline-section').querySelector('h3').textContent.toLowerCase();
                
                if (dateFilter === 'today' && sectionTitle !== 'today') {
                    showItem = false;
                } else if (dateFilter === 'week' && (sectionTitle !== 'today' && sectionTitle !== 'yesterday' && sectionTitle !== 'this week')) {
                    showItem = false;
                } else if (dateFilter === 'month' && sectionTitle === 'last month') {
                    // This is simplified - in a real app we'd check actual dates
                    showItem = false;
                }
            }
            
            // Show or hide the item
            item.style.display = showItem ? 'flex' : 'none';
        });
        
        // Hide empty sections
        timelineSections.forEach(section => {
            const visibleItems = section.querySelectorAll('.timeline-item[style="display: flex;"]');
            if (visibleItems.length === 0) {
                section.style.display = 'none';
            }
        });
    }
    
    // Show alert details
    function showAlertDetails(alertId) {
        // In a real app, we would fetch the alert details from a database
        // For demo purposes, we'll use our sample data
        const alert = alertData.find(a => a.id === alertId) || alertData[0];
        
        // Build the alert details HTML
        let detailsHtml = `
            <div class="alert-detail-row">
                <div class="alert-detail-label">Alert ID</div>
                <div class="alert-detail-value">${alert.id}</div>
            </div>
            <div class="alert-detail-row">
                <div class="alert-detail-label">Type</div>
                <div class="alert-detail-value">${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</div>
            </div>
            <div class="alert-detail-row">
                <div class="alert-detail-label">Date & Time</div>
                <div class="alert-detail-value">${alert.date} at ${alert.time}</div>
            </div>
            <div class="alert-detail-row">
                <div class="alert-detail-label">Description</div>
                <div class="alert-detail-value">${alert.description}</div>
            </div>
        `;
        
        // Add location if available
        if (alert.location) {
            detailsHtml += `
                <div class="alert-detail-row">
                    <div class="alert-detail-label">Location</div>
                    <div class="alert-detail-value">${alert.location}</div>
                </div>
            `;
        }
        
        // Add status and resolution
        detailsHtml += `
            <div class="alert-detail-row">
                <div class="alert-detail-label">Status</div>
                <div class="alert-detail-value">${alert.status}</div>
            </div>
        `;
        
        if (alert.resolution) {
            detailsHtml += `
                <div class="alert-detail-row">
                    <div class="alert-detail-label">Resolution</div>
                    <div class="alert-detail-value">${alert.resolution}</div>
                </div>
            `;
        }
        
        // Add additional details
        if (alert.details) {
            detailsHtml += `
                <div class="alert-detail-row">
                    <div class="alert-detail-label">Additional Details</div>
                    <div class="alert-detail-value">${alert.details}</div>
                </div>
            `;
        }
        
        // Add contacts if available
        if (alert.contacts && alert.contacts.length > 0) {
            detailsHtml += `
                <div class="alert-detail-row">
                    <div class="alert-detail-label">Contacts Notified</div>
                    <div class="alert-detail-value">${alert.contacts.join(', ')}</div>
                </div>
            `;
        }
        
        // Add map if coordinates are available
        if (alert.coordinates) {
            detailsHtml += `
                <div class="alert-detail-row">
                    <div class="alert-detail-label">Alert Location</div>
                    <div id="alert-map" class="alert-map"></div>
                </div>
            `;
        }
        
        // Set the content and show the modal
        alertDetailsContent.innerHTML = detailsHtml;
        alertDetailsModal.classList.add('show');
        
        // Initialize map if coordinates are available
        if (alert.coordinates) {
            setTimeout(() => {
                const alertMap = new google.maps.Map(document.getElementById('alert-map'), {
                    center: alert.coordinates,
                    zoom: 15,
                    mapTypeControl: false,
                    zoomControl: true,
                    streetViewControl: false,
                    fullscreenControl: false
                });
                
                // Add a marker for the alert location
                new google.maps.Marker({
                    position: alert.coordinates,
                    map: alertMap,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: "#f44336",
                        fillOpacity: 1,
                        strokeColor: "#FFFFFF",
                        strokeWeight: 2
                    },
                    title: alert.title
                });
            }, 300);
        }
    }
    
    // Show modal function
    function showModal(modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Hide modal function
    function hideModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Filter change event handlers
    filterType.addEventListener('change', filterTimelineItems);
    filterDate.addEventListener('change', filterTimelineItems);
    
    // View details button click handlers
    document.querySelectorAll('.action-button').forEach(button => {
        button.addEventListener('click', function() {
            // In a real app, we would get the alert ID from a data attribute
            // For demo purposes, we'll just use the first alert
            showAlertDetails(alertData[0].id);
        });
    });
    
    // Close modal buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            hideModal(alertDetailsModal);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === alertDetailsModal) {
            hideModal(alertDetailsModal);
        }
    });
    
    // Load more button
    loadMoreBtn.addEventListener('click', function() {
        // In a real app, this would load more history items from the server
        // For demo purposes, we'll just show a message
        alert('In a real app, this would load more history items.');
    });
});
