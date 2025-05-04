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
