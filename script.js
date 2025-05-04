// Initialize Google Maps with current location
let map;
let userMarker;
const defaultLocation = { lat: -26.2041, lng: 28.0473 }; // Default to Johannesburg if location not available

// Function to initialize the map
function initMap(position) {
    // Get user's location or use default
    const userLocation = position ?
        { lat: position.coords.latitude, lng: position.coords.longitude } :
        defaultLocation;

    // Custom map style for better visibility
    const mapStyles = [
        {
            "featureType": "poi",
            "stylers": [{ "visibility": "off" }] // Hide points of interest
        },
        {
            "featureType": "transit",
            "stylers": [{ "visibility": "off" }] // Hide transit
        }
    ];

    // Create the map
    map = new google.maps.Map(document.getElementById("map-background"), {
        center: userLocation,
        zoom: 15,
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
        fullscreenControl: true,
        styles: mapStyles
    });

    // Add a marker for the user's location
    userMarker = new google.maps.Marker({
        position: userLocation,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#ff3333",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3
        },
        title: "Your Location"
    });

    // Add a circle around the user's location
    const circle = new google.maps.Circle({
        strokeColor: "#2196F3",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#2196F3",
        fillOpacity: 0.1,
        map: map,
        center: userLocation,
        radius: 500, // 500 meters
        clickable: false
    });

    // Add a pulsing effect to make the marker more visible
    const pulseMarker = new google.maps.Marker({
        position: userLocation,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 20,
            fillColor: "#ff3333",
            fillOpacity: 0,
            strokeColor: "#ff3333",
            strokeWeight: 2,
            strokeOpacity: 0.3
        },
        zIndex: 1
    });

    // Animate the pulse marker
    let direction = 1;
    let scale = 20;
    setInterval(() => {
        scale += direction;
        if (scale > 30) direction = -1;
        if (scale < 20) direction = 1;

        pulseMarker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: scale,
            fillColor: "#ff3333",
            fillOpacity: 0,
            strokeColor: "#ff3333",
            strokeWeight: 2,
            strokeOpacity: 0.3
        });
    }, 50);
}

// Get user's current location
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
                initMap(position);
                console.log("Location obtained successfully");
            },
            // Error callback
            (error) => {
                console.error("Error getting location:", error);
                initMap(null); // Use default location
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
        initMap(null); // Use default location
    }
}

// Initialize the map when the page loads
window.addEventListener('load', getCurrentLocation);

// Side menu functionality
const menuToggle = document.getElementById('menu-toggle');
const closeMenu = document.getElementById('close-menu');
const sideMenu = document.getElementById('side-menu');
const appContainer = document.querySelector('.app-container');

// Create overlay element
const overlay = document.createElement('div');
overlay.className = 'menu-overlay';
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.right = '0';
overlay.style.bottom = '0';
overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
overlay.style.zIndex = '999';
overlay.style.opacity = '0';
overlay.style.visibility = 'hidden';
overlay.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
document.body.appendChild(overlay);

// Toggle menu function
function toggleMenu(open) {
    if (open) {
        sideMenu.classList.add('open');
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    } else {
        sideMenu.classList.remove('open');
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        document.body.style.overflow = ''; // Restore scrolling
    }
}

menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu(true);
});

closeMenu.addEventListener('click', () => {
    toggleMenu(false);
});

// Close menu when clicking on overlay
overlay.addEventListener('click', () => {
    toggleMenu(false);
});

// Close menu when pressing Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && sideMenu.classList.contains('open')) {
        toggleMenu(false);
    }
});

// Navigation functionality
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(navItem => navItem.classList.remove('active'));
        item.classList.add('active');
    });
});

// Menu items functionality
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(menuItem => menuItem.classList.remove('active'));
        item.classList.add('active');
        sideMenu.classList.remove('open');
    });
});

// Emergency button functionality
const emergencyButton = document.querySelector('.emergency-button button');
emergencyButton.addEventListener('click', () => {
    // Create emergency modal if it doesn't exist
    if (!document.getElementById('emergency-modal')) {
        createEmergencyModal();
    }

    // Show the emergency modal
    const emergencyModal = document.getElementById('emergency-modal');
    emergencyModal.classList.add('show');

    // Start the emergency process
    startEmergencyProcess();
});

// Create emergency modal
function createEmergencyModal() {
    const modal = document.createElement('div');
    modal.id = 'emergency-modal';
    modal.className = 'modal';

    modal.innerHTML = `
        <div class="modal-content emergency-content">
            <div class="modal-header emergency-header">
                <h3>EMERGENCY ALERT ACTIVATED</h3>
            </div>
            <div class="modal-body">
                <div class="emergency-icon">
                    <span class="material-icons">emergency</span>
                </div>
                <p class="emergency-text">Emergency services and your contacts are being notified of your situation.</p>

                <div class="emergency-status">
                    <div class="status-message">
                        <span class="material-icons">priority_high</span>
                        <span>EMERGENCY RESPONSE INITIATED</span>
                    </div>
                    <p class="status-description">Help is on the way. Stay on the line if possible.</p>
                </div>

                <div class="emergency-contacts">
                    <div class="contact-status">
                        <div class="contact-name">Emergency Services</div>
                        <div class="contact-indicator sending">Sending...</div>
                    </div>
                    <div class="contact-status">
                        <div class="contact-name">Sarah Doe (Spouse)</div>
                        <div class="contact-indicator sending">Sending...</div>
                    </div>
                    <div class="contact-status">
                        <div class="contact-name">Michael Doe (Brother)</div>
                        <div class="contact-indicator sending">Sending...</div>
                    </div>
                </div>

                <div class="location-sharing">
                    <div class="location-status">
                        <span class="material-icons">location_on</span>
                        <span>Sharing your current location</span>
                    </div>
                    <div id="emergency-map" class="emergency-map"></div>
                </div>

                <div class="emergency-actions">
                    <button id="cancel-emergency-btn" class="secondary-button">Cancel Alert (False Alarm)</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add event listener to cancel button
    document.getElementById('cancel-emergency-btn').addEventListener('click', cancelEmergency);
}

// Start emergency process
function startEmergencyProcess() {
    // Make emergency button pulse
    emergencyButton.classList.add('pulsing');

    // Add pulsing animation style if not already added
    if (!document.querySelector('.emergency-pulse-style')) {
        const style = document.createElement('style');
        style.className = 'emergency-pulse-style';
        style.textContent = `
            @keyframes emergency-pulse {
                0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7); }
                70% { transform: scale(1.1); box-shadow: 0 0 0 15px rgba(244, 67, 54, 0); }
                100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
            }
            .icon-button.emergency.pulsing {
                animation: emergency-pulse 1s infinite;
                background-color: #f44336;
            }
        `;
        document.head.appendChild(style);
    }

    // Update contact statuses
    const contactIndicators = document.querySelectorAll('.contact-indicator');
    contactIndicators.forEach((indicator, index) => {
        setTimeout(() => {
            indicator.className = 'contact-indicator sent';
            indicator.textContent = 'Alert Sent';
        }, (index + 1) * 1000); // Stagger the updates
    });

    // Initialize emergency map
    setTimeout(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const emergencyLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    // Create emergency map
                    const emergencyMap = new google.maps.Map(document.getElementById('emergency-map'), {
                        center: emergencyLocation,
                        zoom: 15,
                        mapTypeControl: false,
                        zoomControl: true,
                        streetViewControl: false,
                        fullscreenControl: false
                    });

                    // Add a marker for the emergency location
                    new google.maps.Marker({
                        position: emergencyLocation,
                        map: emergencyMap,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: "#f44336",
                            fillOpacity: 1,
                            strokeColor: "#FFFFFF",
                            strokeWeight: 2
                        },
                        title: "Emergency Location"
                    });
                },
                (error) => {
                    console.error("Error getting location for emergency:", error);
                    document.querySelector('.location-sharing').innerHTML = `
                        <div class="location-status error">
                            <span class="material-icons">error</span>
                            <span>Unable to share location. Emergency services will use your last known location.</span>
                        </div>
                    `;
                }
            );
        }
    }, 500);

    // Play emergency sound
    playEmergencySound();
}

// Cancel emergency
function cancelEmergency() {
    // Stop the emergency button pulsing
    emergencyButton.classList.remove('pulsing');

    // Hide modal
    document.getElementById('emergency-modal').classList.remove('show');

    // Show cancellation message
    alert('Emergency alert canceled. Your contacts have been notified that this was a false alarm.');
}

// Play emergency sound
function playEmergencySound() {
    // Create audio element
    const audio = new Audio();
    audio.src = 'https://www.soundjay.com/buttons/sounds/button-42.mp3'; // Replace with actual emergency sound
    audio.volume = 0.8;

    // Play the sound
    audio.play().catch(e => {
        console.error('Error playing emergency sound:', e);
    });
}

// Status icon button functionality
const statusButton = document.querySelector('.status-icon-button button');
statusButton.addEventListener('click', () => {
    // Create status modal if it doesn't exist
    if (!document.getElementById('status-modal')) {
        createStatusModal();
    }

    // Show the status modal
    const statusModal = document.getElementById('status-modal');
    statusModal.classList.add('show');
});

// Create status modal
function createStatusModal() {
    const modal = document.createElement('div');
    modal.id = 'status-modal';
    modal.className = 'modal';

    modal.innerHTML = `
        <div class="modal-content status-content">
            <div class="modal-header">
                <h3>Safety Status</h3>
                <button class="close-modal-btn">
                    <span class="material-icons">close</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="status-summary">
                    <div class="status-icon">
                        <span class="material-icons">check_circle</span>
                    </div>
                    <div class="status-text">
                        <h4>You're Safe</h4>
                        <p>Your current safety status is normal</p>
                    </div>
                </div>

                <div class="status-details">
                    <div class="status-detail-item">
                        <div class="detail-label">
                            <span class="material-icons">location_on</span>
                            <span>Current Location</span>
                        </div>
                        <div class="detail-value" id="status-location">Loading...</div>
                    </div>

                    <div class="status-detail-item">
                        <div class="detail-label">
                            <span class="material-icons">access_time</span>
                            <span>Last Updated</span>
                        </div>
                        <div class="detail-value" id="status-time">Just now</div>
                    </div>

                    <div class="status-detail-item">
                        <div class="detail-label">
                            <span class="material-icons">security</span>
                            <span>Area Safety</span>
                        </div>
                        <div class="detail-value">
                            <div class="safety-rating">
                                <div class="rating-stars">
                                    <span class="material-icons">star</span>
                                    <span class="material-icons">star</span>
                                    <span class="material-icons">star</span>
                                    <span class="material-icons">star</span>
                                    <span class="material-icons">star_half</span>
                                </div>
                                <span>4.5/5</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="status-actions">
                    <button id="check-in-btn" class="primary-button">Check In as Safe</button>
                    <button id="share-status-btn" class="secondary-button">Share Status with Contacts</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    modal.querySelector('.close-modal-btn').addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // Close when clicking outside
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Check in button
    document.getElementById('check-in-btn').addEventListener('click', () => {
        document.getElementById('status-time').textContent = 'Just now';
        alert('You have checked in as safe. Your emergency contacts have been notified.');
    });

    // Share status button
    document.getElementById('share-status-btn').addEventListener('click', () => {
        alert('Your safety status has been shared with your emergency contacts.');
    });

    // Get current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // In a real app, we would use reverse geocoding to get the address
                // For demo purposes, we'll just show the coordinates
                const lat = position.coords.latitude.toFixed(6);
                const lng = position.coords.longitude.toFixed(6);

                // Use reverse geocoding to get address (simulated)
                setTimeout(() => {
                    document.getElementById('status-location').textContent = 'Johannesburg, South Africa';
                }, 1000);
            },
            (error) => {
                document.getElementById('status-location').textContent = 'Location unavailable';
                console.error("Geolocation error:", error);
            }
        );
    } else {
        document.getElementById('status-location').textContent = 'Location unavailable';
    }
}

// Profile icon functionality
const profileButton = document.querySelector('.user-avatar');
profileButton.addEventListener('click', () => {
    window.location.href = 'profile.html';
});

// Notifications System
let notificationCount = 0;
let notificationQueue = [];

// Sample notifications data
const sampleNotifications = [
    {
        id: 1,
        type: 'alert',
        title: 'High Risk Area Alert',
        message: 'You are entering an area with recent safety incidents. Stay vigilant.',
        time: '2 minutes ago',
        icon: 'warning'
    },
    {
        id: 2,
        type: 'info',
        title: 'Route Update',
        message: 'A safer alternative route is now available for your journey.',
        time: 'Just now',
        icon: 'route'
    },
    {
        id: 3,
        type: 'emergency',
        title: 'Emergency Alert',
        message: 'Multiple reports of suspicious activity near your location.',
        time: '5 minutes ago',
        icon: 'notifications_active'
    },
    {
        id: 4,
        type: 'safety',
        title: 'Safety Tip',
        message: 'It\'s getting dark. Remember to stay in well-lit areas when walking.',
        time: '1 minute ago',
        icon: 'lightbulb'
    }
];

// Create notifications container if it doesn't exist
function createNotificationsSystem() {
    if (document.getElementById('notifications-container')) return;

    // Create notifications container
    const notificationsContainer = document.createElement('div');
    notificationsContainer.id = 'notifications-container';
    notificationsContainer.className = 'notifications-container';
    document.body.appendChild(notificationsContainer);

    // Create notification bell icon
    const notificationBell = document.createElement('div');
    notificationBell.className = 'notification-bell';
    notificationBell.innerHTML = `
        <button class="notification-bell-btn">
            <span class="material-icons">notifications</span>
            <span class="notification-badge" id="notification-badge">0</span>
        </button>
    `;
    document.body.appendChild(notificationBell);

    // Add event listener to notification bell
    notificationBell.querySelector('.notification-bell-btn').addEventListener('click', toggleNotificationsPanel);

    // Create notifications panel
    const notificationsPanel = document.createElement('div');
    notificationsPanel.id = 'notifications-panel';
    notificationsPanel.className = 'notifications-panel';
    notificationsPanel.innerHTML = `
        <div class="notifications-header">
            <h3>Notifications</h3>
            <button class="clear-all-btn">Clear All</button>
        </div>
        <div class="notifications-list" id="notifications-list">
            <div class="empty-notifications">
                <span class="material-icons">notifications_off</span>
                <p>No notifications yet</p>
            </div>
        </div>
    `;
    document.body.appendChild(notificationsPanel);

    // Add event listener to clear all button
    notificationsPanel.querySelector('.clear-all-btn').addEventListener('click', clearAllNotifications);

    // Close panel when clicking outside
    document.addEventListener('click', function(event) {
        const panel = document.getElementById('notifications-panel');
        const bell = document.querySelector('.notification-bell');

        if (panel.classList.contains('show') &&
            !panel.contains(event.target) &&
            !bell.contains(event.target)) {
            panel.classList.remove('show');
        }
    });
}

// Toggle notifications panel
function toggleNotificationsPanel() {
    const panel = document.getElementById('notifications-panel');
    panel.classList.toggle('show');

    // Mark all as read when opening panel
    if (panel.classList.contains('show')) {
        markAllNotificationsAsRead();
    }
}

// Add notification
function addNotification(notification) {
    // Update notification count
    notificationCount++;
    updateNotificationBadge();

    // Add to queue
    notificationQueue.push(notification);

    // Update notifications list
    updateNotificationsList();

    // Show toast notification
    showNotificationToast(notification);
}

// Show notification toast
function showNotificationToast(notification) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `notification-toast ${notification.type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <span class="material-icons">${notification.icon}</span>
        </div>
        <div class="toast-content">
            <div class="toast-title">${notification.title}</div>
            <div class="toast-message">${notification.message}</div>
        </div>
        <button class="toast-close">
            <span class="material-icons">close</span>
        </button>
    `;

    // Add to container
    const container = document.getElementById('notifications-container');
    container.appendChild(toast);

    // Add event listener to close button
    toast.querySelector('.toast-close').addEventListener('click', function() {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    });

    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.add('hiding');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 5000);

    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
}

// Update notifications list
function updateNotificationsList() {
    const listElement = document.getElementById('notifications-list');
    const emptyElement = listElement.querySelector('.empty-notifications');

    // Show/hide empty state
    if (notificationQueue.length === 0) {
        if (!emptyElement) {
            listElement.innerHTML = `
                <div class="empty-notifications">
                    <span class="material-icons">notifications_off</span>
                    <p>No notifications yet</p>
                </div>
            `;
        }
        return;
    } else if (emptyElement) {
        emptyElement.remove();
    }

    // Clear list and add all notifications
    listElement.innerHTML = '';

    // Add notifications in reverse order (newest first)
    for (let i = notificationQueue.length - 1; i >= 0; i--) {
        const notification = notificationQueue[i];
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification-item ${notification.type}`;
        notificationElement.dataset.id = notification.id;
        notificationElement.innerHTML = `
            <div class="notification-icon">
                <span class="material-icons">${notification.icon}</span>
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${notification.time}</div>
            </div>
            <button class="notification-dismiss">
                <span class="material-icons">close</span>
            </button>
        `;

        // Add event listener to dismiss button
        notificationElement.querySelector('.notification-dismiss').addEventListener('click', function(event) {
            event.stopPropagation();
            dismissNotification(notification.id);
        });

        // Add to list
        listElement.appendChild(notificationElement);
    }
}

// Dismiss notification
function dismissNotification(id) {
    // Find notification index
    const index = notificationQueue.findIndex(n => n.id === id);
    if (index === -1) return;

    // Remove from queue
    notificationQueue.splice(index, 1);

    // Update list
    updateNotificationsList();

    // Update badge
    notificationCount = Math.max(0, notificationCount - 1);
    updateNotificationBadge();
}

// Clear all notifications
function clearAllNotifications() {
    // Clear queue
    notificationQueue = [];

    // Update list
    updateNotificationsList();

    // Reset count
    notificationCount = 0;
    updateNotificationBadge();

    // Hide panel
    document.getElementById('notifications-panel').classList.remove('show');
}

// Mark all notifications as read
function markAllNotificationsAsRead() {
    // Reset count
    notificationCount = 0;
    updateNotificationBadge();
}

// Update notification badge
function updateNotificationBadge() {
    const badge = document.getElementById('notification-badge');
    if (!badge) return;

    badge.textContent = notificationCount;
    badge.style.display = notificationCount > 0 ? 'flex' : 'none';
}

// Simulate incoming notifications
function simulateIncomingNotifications() {
    // Initialize notifications system
    createNotificationsSystem();

    // Schedule first notification after 30 seconds
    setTimeout(() => {
        // Add first notification
        addNotification(sampleNotifications[0]);

        // Schedule second notification after 15 more seconds
        setTimeout(() => {
            addNotification(sampleNotifications[1]);

            // Schedule third notification after 20 more seconds
            setTimeout(() => {
                addNotification(sampleNotifications[2]);

                // Schedule fourth notification after 25 more seconds
                setTimeout(() => {
                    addNotification(sampleNotifications[3]);
                }, 25000);
            }, 20000);
        }, 15000);
    }, 30000);
}

// Initialize notifications system
createNotificationsSystem();

// Start simulating notifications
simulateIncomingNotifications();

// Modal functionality
function showModal(modal) {
    modal.classList.add('show');
}

function hideModal(modal) {
    modal.classList.remove('show');
}

// Initialize modals
document.addEventListener('DOMContentLoaded', function() {
    // Get all modals
    const modals = document.querySelectorAll('.modal');

    // Add event listeners to close buttons
    modals.forEach(modal => {
        const closeButtons = modal.querySelectorAll('.close-modal-btn');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                hideModal(modal);
            });
        });

        // Close when clicking outside
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                hideModal(modal);
            }
        });
    });

    // Close when pressing Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('show')) {
                    hideModal(modal);
                }
            });
        }
    });
});
