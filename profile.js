// Profile functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    initMap();

    // Get modal elements
    const editProfileModal = document.getElementById('edit-profile-modal');
    const addContactModal = document.getElementById('add-contact-modal');
    const testAlertModal = document.getElementById('test-alert-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal-btn');

    // Get form elements
    const editProfileForm = document.getElementById('edit-profile-form');
    const addContactForm = document.getElementById('add-contact-form');

    // Get button elements
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const addContactBtn = document.getElementById('add-contact-btn');
    const testAlertBtn = document.getElementById('test-alert-btn');
    const confirmTestAlertBtn = document.getElementById('confirm-test-alert');

    // Sample user data (in a real app, this would come from a database)
    const userData = {
        name: "John Doe",
        email: "johndoe@example.com",
        age: 32,
        gender: "Male",
        phone: "+27 71 234 5678",
        address: "123 Main Street, Johannesburg, South Africa",
        medical: "None",
        emergencyContacts: [
            {
                name: "Sarah Doe",
                relation: "Spouse",
                phone: "+27 82 345 6789",
                email: "sarah@example.com"
            },
            {
                name: "Michael Doe",
                relation: "Brother",
                phone: "+27 83 456 7890",
                email: "michael@example.com"
            }
        ]
    };

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

    // Hide all modals
    function hideAllModals() {
        editProfileModal.classList.remove('show');
        addContactModal.classList.remove('show');
        testAlertModal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Edit profile button click handler
    editProfileBtn.addEventListener('click', function() {
        // Populate form with current user data
        document.getElementById('edit-full-name').value = userData.name;
        document.getElementById('edit-age').value = userData.age;
        document.getElementById('edit-gender').value = userData.gender;
        document.getElementById('edit-phone').value = userData.phone;
        document.getElementById('edit-email').value = userData.email;
        document.getElementById('edit-address').value = userData.address;
        document.getElementById('edit-medical').value = userData.medical;

        // Show modal
        showModal(editProfileModal);
    });

    // Add contact button click handler
    addContactBtn.addEventListener('click', function() {
        // Reset form
        addContactForm.reset();

        // Show modal
        showModal(addContactModal);
    });

    // Test alert button click handler
    testAlertBtn.addEventListener('click', function() {
        showModal(testAlertModal);
    });

    // Close modal buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            hideAllModals();
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === editProfileModal) {
            hideModal(editProfileModal);
        } else if (event.target === addContactModal) {
            hideModal(addContactModal);
        } else if (event.target === testAlertModal) {
            hideModal(testAlertModal);
        }
    });

    // Edit profile form submit handler
    editProfileForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Update user data
        userData.name = document.getElementById('edit-full-name').value;
        userData.age = document.getElementById('edit-age').value;
        userData.gender = document.getElementById('edit-gender').value;
        userData.phone = document.getElementById('edit-phone').value;
        userData.email = document.getElementById('edit-email').value;
        userData.address = document.getElementById('edit-address').value;
        userData.medical = document.getElementById('edit-medical').value;

        // Update UI
        document.getElementById('profile-name').textContent = userData.name;
        document.getElementById('profile-email').textContent = userData.email;
        document.getElementById('full-name').textContent = userData.name;
        document.getElementById('age').textContent = userData.age;
        document.getElementById('gender').textContent = userData.gender;
        document.getElementById('phone').textContent = userData.phone;
        document.getElementById('address').textContent = userData.address;
        document.getElementById('medical').textContent = userData.medical;

        // Hide modal
        hideModal(editProfileModal);

        // Show success message
        alert('Profile updated successfully!');
    });

    // Add contact form submit handler
    addContactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get form values
        const name = document.getElementById('contact-name').value;
        const relation = document.getElementById('contact-relation').value;
        const phone = document.getElementById('contact-phone').value;
        const email = document.getElementById('contact-email').value;

        // Add to user data
        userData.emergencyContacts.push({
            name: name,
            relation: relation,
            phone: phone,
            email: email
        });

        // Add to UI
        addContactToUI({
            name: name,
            relation: relation,
            phone: phone
        });

        // Hide modal
        hideModal(addContactModal);

        // Show success message
        alert('Emergency contact added successfully!');
    });

    // Confirm test alert button click handler
    confirmTestAlertBtn.addEventListener('click', function() {
        // In a real app, this would send actual alerts
        // For demo purposes, we'll just show a message

        // Hide modal
        hideModal(testAlertModal);

        // Show success message
        alert('Test alert sent to your emergency contacts!');
    });

    // Function to add a contact to the UI
    function addContactToUI(contact) {
        const contactsContainer = document.getElementById('emergency-contacts');

        const contactItem = document.createElement('div');
        contactItem.className = 'contact-item';

        contactItem.innerHTML = `
            <div class="contact-info">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-relation">${contact.relation}</div>
                <div class="contact-phone">${contact.phone}</div>
            </div>
            <div class="contact-actions">
                <button class="icon-button small">
                    <span class="material-icons">edit</span>
                </button>
                <button class="icon-button small">
                    <span class="material-icons">delete</span>
                </button>
            </div>
        `;

        // Add edit and delete functionality
        const editBtn = contactItem.querySelector('.icon-button:first-child');
        const deleteBtn = contactItem.querySelector('.icon-button:last-child');

        editBtn.addEventListener('click', function() {
            // Get contact data
            const contactItem = this.closest('.contact-item');
            const contactName = contactItem.querySelector('.contact-name').textContent;
            const contactRelation = contactItem.querySelector('.contact-relation').textContent;
            const contactPhone = contactItem.querySelector('.contact-phone').textContent;

            // Find the contact in userData
            const contactIndex = userData.emergencyContacts.findIndex(c => c.name === contactName);
            if (contactIndex === -1) return;

            const contact = userData.emergencyContacts[contactIndex];

            // Create edit contact modal if it doesn't exist
            if (!document.getElementById('edit-contact-modal')) {
                createEditContactModal();
            }

            // Populate form with contact data
            document.getElementById('edit-contact-name').value = contact.name;
            document.getElementById('edit-contact-relation').value = contact.relation;
            document.getElementById('edit-contact-phone').value = contact.phone;
            document.getElementById('edit-contact-email').value = contact.email || '';

            // Store contact index for later use
            document.getElementById('edit-contact-form').dataset.contactIndex = contactIndex;

            // Show modal
            showModal(document.getElementById('edit-contact-modal'));
        });

        deleteBtn.addEventListener('click', function() {
            // Remove from UI
            contactItem.remove();

            // In a real app, this would also remove from the database
            alert('Contact removed successfully!');
        });

        contactsContainer.appendChild(contactItem);
    }

    // Create edit contact modal
    function createEditContactModal() {
        const modal = document.createElement('div');
        modal.id = 'edit-contact-modal';
        modal.className = 'modal';

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Emergency Contact</h3>
                    <button class="close-modal-btn">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="edit-contact-form">
                        <div class="form-group">
                            <label for="edit-contact-name">Full Name</label>
                            <input type="text" id="edit-contact-name" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-contact-relation">Relationship</label>
                            <input type="text" id="edit-contact-relation" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-contact-phone">Phone Number</label>
                            <input type="tel" id="edit-contact-phone" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-contact-email">Email Address</label>
                            <input type="email" id="edit-contact-email">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="primary-button">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('.close-modal-btn').addEventListener('click', () => {
            hideModal(modal);
        });

        // Close when clicking outside
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                hideModal(modal);
            }
        });

        // Form submit handler
        document.getElementById('edit-contact-form').addEventListener('submit', function(event) {
            event.preventDefault();

            // Get form values
            const name = document.getElementById('edit-contact-name').value;
            const relation = document.getElementById('edit-contact-relation').value;
            const phone = document.getElementById('edit-contact-phone').value;
            const email = document.getElementById('edit-contact-email').value;

            // Get contact index
            const contactIndex = parseInt(this.dataset.contactIndex);

            // Update contact in userData
            userData.emergencyContacts[contactIndex] = {
                name: name,
                relation: relation,
                phone: phone,
                email: email
            };

            // Update UI
            const contactItems = document.querySelectorAll('.contact-item');
            const contactItem = contactItems[contactIndex];

            contactItem.querySelector('.contact-name').textContent = name;
            contactItem.querySelector('.contact-relation').textContent = relation;
            contactItem.querySelector('.contact-phone').textContent = phone;

            // Hide modal
            hideModal(modal);

            // Show success message
            alert('Emergency contact updated successfully!');
        });
    }

    // Initialize toggle switches
    const toggleSwitches = document.querySelectorAll('.switch input');
    toggleSwitches.forEach(toggle => {
        // Set voice detection to enabled by default
        if (toggle.id === 'voice-toggle' && localStorage.getItem('voiceDetectionEnabled') === null) {
            toggle.checked = true;
            localStorage.setItem('voiceDetectionEnabled', 'true');

            // Show voice indicator
            const voiceIndicator = document.getElementById('voice-indicator');
            if (voiceIndicator) {
                voiceIndicator.classList.add('active');
            }
        }

        toggle.addEventListener('change', function() {
            const settingName = this.id;
            const isEnabled = this.checked;

            // In a real app, this would update user settings in the database
            console.log(`Setting "${settingName}" ${isEnabled ? 'enabled' : 'disabled'}`);

            // Show feedback
            if (settingName === 'auto-alerts') {
                alert(`Automatic emergency alerts ${isEnabled ? 'enabled' : 'disabled'}`);
            }

            // Handle voice detection toggle
            if (settingName === 'voice-toggle') {
                if (isEnabled) {
                    // Show voice indicator
                    const voiceIndicator = document.getElementById('voice-indicator');
                    if (voiceIndicator) {
                        voiceIndicator.classList.add('active');
                    }
                    localStorage.setItem('voiceDetectionEnabled', 'true');

                    // Show confirmation message
                    const message = document.createElement('div');
                    message.className = 'settings-message success';
                    message.textContent = 'Voice emergency detection enabled. The app will listen for keywords like "help" or "emergency".';

                    // Add message to settings container
                    const settingsContainer = document.querySelector('.profile-card .card-content');
                    if (settingsContainer) {
                        // Remove any existing message
                        const existingMessage = document.querySelector('.settings-message');
                        if (existingMessage) {
                            existingMessage.remove();
                        }

                        settingsContainer.appendChild(message);

                        // Auto-hide message after 5 seconds
                        setTimeout(() => {
                            message.classList.add('fade-out');
                            setTimeout(() => {
                                message.remove();
                            }, 500);
                        }, 5000);
                    }
                } else {
                    // Hide voice indicator
                    const voiceIndicator = document.getElementById('voice-indicator');
                    if (voiceIndicator) {
                        voiceIndicator.classList.remove('active');
                    }
                    localStorage.setItem('voiceDetectionEnabled', 'false');

                    // Show warning message
                    const message = document.createElement('div');
                    message.className = 'settings-message warning';
                    message.textContent = 'Voice emergency detection disabled. The app will not respond to emergency keywords.';

                    // Add message to settings container
                    const settingsContainer = document.querySelector('.profile-card .card-content');
                    if (settingsContainer) {
                        // Remove any existing message
                        const existingMessage = document.querySelector('.settings-message');
                        if (existingMessage) {
                            existingMessage.remove();
                        }

                        settingsContainer.appendChild(message);

                        // Auto-hide message after 5 seconds
                        setTimeout(() => {
                            message.classList.add('fade-out');
                            setTimeout(() => {
                                message.remove();
                            }, 500);
                        }, 5000);
                    }
                }
            }
        });
    });
});
