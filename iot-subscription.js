// IoT Devices and Subscription Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize IoT Device Modal
    const addDeviceBtn = document.getElementById('add-device-btn');
    const addDeviceAltBtn = document.getElementById('add-device-btn-alt');
    const addDeviceModal = document.getElementById('add-device-modal');
    const addDeviceForm = document.getElementById('add-device-form');
    const iotDevicesList = document.getElementById('iot-devices-list');
    const syncDevicesBtn = document.getElementById('sync-devices-btn');
    const viewAnalyticsBtn = document.getElementById('view-analytics-btn');

    // Initialize IoT Tabs
    const iotTabs = document.querySelectorAll('.iot-tab');
    const iotDeviceItems = document.querySelectorAll('.iot-device-item');

    // Initialize Modal Tabs
    const modalTabs = document.querySelectorAll('.modal-tab');

    // Initialize Subscription Management
    const upgradePlanBtn = document.getElementById('upgrade-plan-btn');
    const upgradePlanModal = document.getElementById('upgrade-plan-modal');
    const planSelectBtns = document.querySelectorAll('.plan-select-btn:not(.current)');

    // Initialize Emergency Contacts
    const addContactBtn = document.getElementById('add-contact-btn');
    const addContactAltBtn = document.getElementById('add-contact-btn-alt');
    const addContactModal = document.getElementById('add-contact-modal');
    const addContactForm = document.getElementById('add-contact-form');

    // Open Add Device Modal
    if (addDeviceBtn) {
        addDeviceBtn.addEventListener('click', function() {
            addDeviceModal.classList.add('show');
        });
    }

    // Open Add Device Modal (alternative button)
    if (addDeviceAltBtn) {
        addDeviceAltBtn.addEventListener('click', function() {
            addDeviceModal.classList.add('show');
        });
    }

    // Open Add Contact Modal
    if (addContactBtn) {
        addContactBtn.addEventListener('click', function() {
            addContactModal.classList.add('show');
        });
    }

    // Open Add Contact Modal (alternative button)
    if (addContactAltBtn) {
        addContactAltBtn.addEventListener('click', function() {
            addContactModal.classList.add('show');
        });
    }

    // Open Upgrade Plan Modal
    if (upgradePlanBtn) {
        upgradePlanBtn.addEventListener('click', function() {
            upgradePlanModal.classList.add('show');
        });
    }

    // Close modals when clicking close button
    document.querySelectorAll('.close-modal-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    });

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(function(modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        });
    });

    // Handle IoT Tabs
    if (iotTabs.length > 0) {
        iotTabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                iotTabs.forEach(t => t.classList.remove('active'));

                // Add active class to clicked tab
                this.classList.add('active');

                // Get tab type
                const tabType = this.getAttribute('data-tab');

                // Show/hide devices based on tab
                iotDeviceItems.forEach(function(device) {
                    if (tabType === 'all-devices') {
                        device.style.display = 'flex';
                    } else if (tabType === 'connected' && !device.classList.contains('disconnected')) {
                        device.style.display = 'flex';
                    } else if (tabType === 'disconnected' && device.classList.contains('disconnected')) {
                        device.style.display = 'flex';
                    } else {
                        device.style.display = 'none';
                    }
                });
            });
        });
    }

    // Handle Edit Contact Buttons
    const editContactBtns = document.querySelectorAll('.edit-contact-btn');
    const editContactModal = document.getElementById('edit-contact-modal');
    const editContactForm = document.getElementById('edit-contact-form');

    if (editContactBtns.length > 0) {
        editContactBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const contactId = this.getAttribute('data-contact-id');

                // In a real app, we would fetch contact data from the server
                // For this demo, we'll use hardcoded data based on the contact ID
                let contactData = {};

                if (contactId === '1') {
                    contactData = {
                        id: 1,
                        name: 'Sarah Doe',
                        relation: 'spouse',
                        priority: 'primary',
                        phone: '+27 82 345 6789',
                        email: 'sarah.doe@example.com',
                        notifications: ['emergency', 'location'],
                        notes: 'Primary emergency contact'
                    };
                } else if (contactId === '2') {
                    contactData = {
                        id: 2,
                        name: 'Michael Doe',
                        relation: 'sibling',
                        priority: 'secondary',
                        phone: '+27 83 456 7890',
                        email: 'michael.doe@example.com',
                        notifications: ['emergency'],
                        notes: ''
                    };
                }

                // Populate the edit form with contact data
                document.getElementById('edit-contact-id').value = contactData.id;
                document.getElementById('edit-contact-name').value = contactData.name;
                document.getElementById('edit-contact-relation').value = contactData.relation;
                document.getElementById('edit-contact-priority').value = contactData.priority;
                document.getElementById('edit-contact-phone').value = contactData.phone;
                document.getElementById('edit-contact-email').value = contactData.email || '';
                document.getElementById('edit-contact-notes').value = contactData.notes || '';

                // Set notification checkboxes
                document.querySelectorAll('input[name="edit-notification-settings"]').forEach(function(checkbox) {
                    checkbox.checked = contactData.notifications.includes(checkbox.value);
                });

                // Show the modal
                editContactModal.classList.add('show');
            });
        });
    }

    // Handle Edit Device Buttons
    const editDeviceBtns = document.querySelectorAll('.edit-device-btn');
    const editDeviceModal = document.getElementById('edit-device-modal');
    const editDeviceForm = document.getElementById('edit-device-form');

    if (editDeviceBtns.length > 0) {
        editDeviceBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const deviceId = this.getAttribute('data-device-id');
                const deviceType = this.getAttribute('data-device-type');

                // In a real app, we would fetch device data from the server
                // For this demo, we'll use hardcoded data based on the device ID
                let deviceData = {};

                if (deviceId === '1') {
                    deviceData = {
                        id: 1,
                        name: 'Smart Camera (Front Door)',
                        type: 'camera',
                        location: 'Front Door',
                        status: 'connected',
                        lastActivity: '5 minutes ago',
                        firmware: 'v2.3.1',
                        ip: '192.168.1.45',
                        mac: '00:1B:44:11:3A:B7',
                        connectionType: 'Direct to Azure IoT Hub',
                        security: ['encryption', 'alerts', 'auto-update'],
                        notes: 'Installed on January 15, 2023'
                    };
                } else if (deviceId === '2') {
                    deviceData = {
                        id: 2,
                        name: 'Motion Sensor (Backyard)',
                        type: 'motion',
                        location: 'Backyard',
                        status: 'connected',
                        lastActivity: '2 hours ago',
                        firmware: 'v1.8.5',
                        ip: '192.168.1.46',
                        mac: '00:1B:44:11:3A:C8',
                        connectionType: 'Direct to Azure IoT Hub',
                        security: ['encryption', 'alerts'],
                        notes: 'Installed on February 3, 2023'
                    };
                } else if (deviceId === '3') {
                    deviceData = {
                        id: 3,
                        name: 'Smart Door Lock',
                        type: 'door',
                        location: 'Front Door',
                        status: 'disconnected',
                        lastActivity: '2 days ago',
                        firmware: 'v1.5.2',
                        ip: '192.168.1.47',
                        mac: '00:1B:44:11:3A:D9',
                        connectionType: 'Direct to Azure IoT Hub',
                        security: ['encryption'],
                        notes: 'Battery needs replacement'
                    };
                }

                // Populate the edit form with device data
                document.getElementById('edit-device-id').value = deviceData.id;
                document.getElementById('edit-device-type-hidden').value = deviceData.type;
                document.getElementById('edit-device-name').value = deviceData.name;
                document.getElementById('edit-device-location').value = deviceData.location;
                document.getElementById('edit-device-firmware').value = deviceData.firmware;
                document.getElementById('edit-connection-type').textContent = deviceData.connectionType;
                document.getElementById('edit-device-ip').textContent = deviceData.ip;
                document.getElementById('edit-device-mac').textContent = deviceData.mac;
                document.getElementById('edit-device-notes').value = deviceData.notes || '';

                // Update status display
                const statusIcon = document.querySelector('.device-status-icon');
                const statusText = document.getElementById('edit-device-status-text');
                const lastActivity = document.getElementById('edit-device-last-activity');

                if (deviceData.status === 'connected') {
                    statusIcon.className = 'device-status-icon connected';
                    statusIcon.innerHTML = '<span class="material-icons">check_circle</span>';
                    statusText.textContent = 'Connected';
                } else {
                    statusIcon.className = 'device-status-icon disconnected';
                    statusIcon.innerHTML = '<span class="material-icons">error</span>';
                    statusText.textContent = 'Disconnected';
                }

                lastActivity.textContent = deviceData.lastActivity;

                // Set security checkboxes
                document.querySelectorAll('input[name="edit-security-settings"]').forEach(function(checkbox) {
                    checkbox.checked = deviceData.security.includes(checkbox.value);
                });

                // Show/hide device-specific settings based on device type
                document.querySelectorAll('.device-specific-settings').forEach(function(settings) {
                    settings.style.display = 'none';
                });

                const specificSettings = document.getElementById(`${deviceData.type}-settings`);
                if (specificSettings) {
                    specificSettings.style.display = 'block';
                }

                // Show the modal
                editDeviceModal.classList.add('show');
            });
        });
    }

    // Handle Modal Tabs
    if (modalTabs.length > 0) {
        modalTabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                modalTabs.forEach(t => t.classList.remove('active'));

                // Add active class to clicked tab
                this.classList.add('active');

                // In a real app, we would show/hide different form sections here
                // For this demo, we'll just show a notification
                const tabType = this.getAttribute('data-tab');
                if (tabType !== 'manual-setup') {
                    showNotification(`${tabType.replace('-', ' ')} feature coming soon`, 'info');
                }
            });
        });
    }

    // Handle Add Device Form Submission
    if (addDeviceForm) {
        addDeviceForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const deviceName = document.getElementById('device-name').value;
            const deviceType = document.getElementById('device-type').value;
            const deviceLocation = document.getElementById('device-location').value;
            const deviceId = document.getElementById('device-id').value;
            const deviceManufacturer = document.getElementById('device-manufacturer')?.value || '';

            // Validate form
            if (!deviceName || !deviceType || !deviceId || !deviceLocation) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            // Create new device element
            addNewDevice(deviceName, deviceType, deviceLocation, deviceManufacturer);

            // Reset form and close modal
            addDeviceForm.reset();
            addDeviceModal.classList.remove('show');

            // Show success message
            showNotification('Device added successfully and connected to Azure IoT Hub', 'success');
        });
    }

    // Handle Add Contact Form Submission
    if (addContactForm) {
        addContactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const contactName = document.getElementById('contact-name').value;
            const contactRelation = document.getElementById('contact-relation').value;
            const contactPhone = document.getElementById('contact-phone').value;
            const contactPriority = document.getElementById('contact-priority')?.value || 'secondary';

            // Validate form
            if (!contactName || !contactRelation || !contactPhone) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            // Create new contact element (in a real app, this would be more complex)
            // For this demo, we'll just show a notification
            showNotification(`Emergency contact ${contactName} added successfully`, 'success');

            // Reset form and close modal
            addContactForm.reset();
            addContactModal.classList.remove('show');

            // Reload page to show new contact (in a real app, we would update the DOM)
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        });
    }

    // Handle Edit Contact Form Submission
    if (editContactForm) {
        editContactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const contactId = document.getElementById('edit-contact-id').value;
            const contactName = document.getElementById('edit-contact-name').value;
            const contactRelation = document.getElementById('edit-contact-relation').value;
            const contactPhone = document.getElementById('edit-contact-phone').value;

            // Validate form
            if (!contactName || !contactRelation || !contactPhone) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            // Update contact (in a real app, this would be more complex)
            // For this demo, we'll just show a notification
            showNotification(`Emergency contact ${contactName} updated successfully`, 'success');

            // Close modal
            editContactModal.classList.remove('show');

            // Reload page to show updated contact (in a real app, we would update the DOM)
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        });
    }

    // Handle Edit Device Form Submission
    if (editDeviceForm) {
        editDeviceForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const deviceId = document.getElementById('edit-device-id').value;
            const deviceName = document.getElementById('edit-device-name').value;
            const deviceLocation = document.getElementById('edit-device-location').value;

            // Validate form
            if (!deviceName || !deviceLocation) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            // Update device (in a real app, this would be more complex)
            // For this demo, we'll just show a notification
            showNotification(`Device ${deviceName} updated successfully`, 'success');

            // Close modal
            editDeviceModal.classList.remove('show');

            // Reload page to show updated device (in a real app, we would update the DOM)
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        });
    }

    // Handle Delete Contact Buttons
    const deleteContactBtns = document.querySelectorAll('.delete-contact-btn');
    if (deleteContactBtns.length > 0) {
        deleteContactBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const contactId = this.getAttribute('data-contact-id');
                const contactItem = this.closest('.contact-item');
                const contactName = contactItem.querySelector('.contact-name').textContent;

                if (confirm(`Are you sure you want to remove ${contactName} from your emergency contacts?`)) {
                    // Remove contact (in a real app, this would be more complex)
                    contactItem.remove();
                    showNotification(`Emergency contact ${contactName} removed successfully`, 'success');

                    // Update contact count
                    updateContactCount();
                }
            });
        });
    }

    // Handle Delete Device Buttons
    const deleteDeviceBtns = document.querySelectorAll('.delete-device-btn');
    if (deleteDeviceBtns.length > 0) {
        deleteDeviceBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const deviceId = this.getAttribute('data-device-id');
                const deviceItem = this.closest('.iot-device-item');
                const deviceName = deviceItem.querySelector('.device-name').textContent;

                if (confirm(`Are you sure you want to remove ${deviceName} from your IoT devices?`)) {
                    // Remove device (in a real app, this would be more complex)
                    deviceItem.remove();
                    showNotification(`Device ${deviceName} removed successfully`, 'success');

                    // Update device count
                    updateDeviceCount();
                }
            });
        });
    }

    // Handle Test Alert Buttons
    const testAlertBtns = document.querySelectorAll('.test-alert-btn');
    if (testAlertBtns.length > 0) {
        testAlertBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const contactName = this.getAttribute('data-contact');

                // Show loading state
                this.disabled = true;
                const originalIcon = this.innerHTML;
                this.innerHTML = '<span class="material-icons" style="animation: spin 1s linear infinite;">sync</span>';

                // Simulate sending test alert
                setTimeout(() => {
                    this.disabled = false;
                    this.innerHTML = originalIcon;
                    showNotification(`Test alert sent to ${contactName}`, 'success');
                }, 1500);
            });
        });
    }

    // Handle View Live Feed Button
    const viewDeviceBtns = document.querySelectorAll('.view-device-btn');
    if (viewDeviceBtns.length > 0) {
        viewDeviceBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const deviceId = this.getAttribute('data-device-id');
                const deviceItem = this.closest('.iot-device-item');
                const deviceName = deviceItem.querySelector('.device-name').textContent;

                showNotification(`Connecting to live feed from ${deviceName}...`, 'info');

                // In a real app, this would open a video feed
                // For this demo, we'll just show a notification
                setTimeout(() => {
                    showNotification(`Live feed from ${deviceName} is not available in this demo`, 'info');
                }, 2000);
            });
        });
    }

    // Handle View Activity Button
    const viewActivityBtns = document.querySelectorAll('.view-activity-btn');
    if (viewActivityBtns.length > 0) {
        viewActivityBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const deviceId = this.getAttribute('data-device-id');
                const deviceItem = this.closest('.iot-device-item');
                const deviceName = deviceItem.querySelector('.device-name').textContent;

                showNotification(`Loading activity log for ${deviceName}...`, 'info');

                // In a real app, this would open an activity log
                // For this demo, we'll just show a notification
                setTimeout(() => {
                    showNotification(`Activity log for ${deviceName} is not available in this demo`, 'info');
                }, 2000);
            });
        });
    }

    // Handle Troubleshoot Button
    const troubleshootBtns = document.querySelectorAll('.troubleshoot-btn');
    if (troubleshootBtns.length > 0) {
        troubleshootBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const deviceId = this.getAttribute('data-device-id');
                const deviceItem = this.closest('.iot-device-item');
                const deviceName = deviceItem.querySelector('.device-name').textContent;

                showNotification(`Running diagnostics on ${deviceName}...`, 'info');

                // In a real app, this would run diagnostics
                // For this demo, we'll just show a notification
                setTimeout(() => {
                    showNotification(`Diagnostics complete. Issue detected: Battery low. Please replace battery.`, 'info');
                }, 2000);
            });
        });
    }

    // Handle Refresh Device Status Button
    const refreshDeviceStatusBtn = document.getElementById('refresh-device-status-btn');
    if (refreshDeviceStatusBtn) {
        refreshDeviceStatusBtn.addEventListener('click', function() {
            // Show loading state
            this.disabled = true;
            const originalIcon = this.innerHTML;
            this.innerHTML = '<span class="material-icons" style="animation: spin 1s linear infinite;">refresh</span> Refreshing...';

            // Simulate refreshing status
            setTimeout(() => {
                this.disabled = false;
                this.innerHTML = originalIcon;
                showNotification('Device status refreshed', 'success');

                // Update last activity
                document.getElementById('edit-device-last-activity').textContent = 'Just now';
            }, 1500);
        });
    }

    // Handle Update Firmware Button
    const updateFirmwareBtn = document.getElementById('update-firmware-btn');
    if (updateFirmwareBtn) {
        updateFirmwareBtn.addEventListener('click', function() {
            // Show loading state
            this.disabled = true;
            const originalIcon = this.innerHTML;
            this.innerHTML = '<span class="material-icons" style="animation: spin 1s linear infinite;">system_update</span> Updating...';

            // Simulate updating firmware
            setTimeout(() => {
                this.disabled = false;
                this.innerHTML = originalIcon;

                // Update firmware version
                const firmwareInput = document.getElementById('edit-device-firmware');
                const currentVersion = firmwareInput.value;
                const versionParts = currentVersion.split('.');
                versionParts[2] = parseInt(versionParts[2]) + 1;
                const newVersion = versionParts.join('.');
                firmwareInput.value = newVersion;

                showNotification(`Firmware updated to ${newVersion}`, 'success');
            }, 3000);
        });
    }

    // Function to update contact count
    function updateContactCount() {
        const contactCountElement = document.querySelector('.contact-count');
        if (contactCountElement) {
            const contactCount = document.querySelectorAll('.contact-item').length;
            contactCountElement.textContent = `${contactCount}/5 contacts`;
        }
    }

    // Handle Save Contacts Button
    const saveContactsBtn = document.getElementById('save-contacts-btn');
    if (saveContactsBtn) {
        saveContactsBtn.addEventListener('click', function() {
            // Show loading state
            this.disabled = true;
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="material-icons" style="animation: spin 1s linear infinite;">sync</span> Saving...';

            // Simulate saving contacts to server
            setTimeout(() => {
                this.disabled = false;
                this.innerHTML = originalText;
                showNotification('Emergency contacts saved successfully', 'success');
            }, 1500);
        });
    }

    // Handle Save Devices Button
    const saveDevicesBtn = document.getElementById('save-devices-btn');
    if (saveDevicesBtn) {
        saveDevicesBtn.addEventListener('click', function() {
            // Show loading state
            this.disabled = true;
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="material-icons" style="animation: spin 1s linear infinite;">sync</span> Saving...';

            // Simulate saving devices to Azure IoT Hub
            setTimeout(() => {
                this.disabled = false;
                this.innerHTML = originalText;
                showNotification('IoT devices synchronized with Azure IoT Hub', 'success');
            }, 2000);
        });
    }

    // Handle Plan Selection
    planSelectBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const planType = this.getAttribute('data-plan');

            // Simulate plan change
            showNotification(`Subscription changed to ${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan`, 'success');

            // Close modal
            upgradePlanModal.classList.remove('show');

            // Update UI to reflect new plan (in a real app, this would be more complex)
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        });
    });

    // Sync Devices Button
    if (syncDevicesBtn) {
        syncDevicesBtn.addEventListener('click', function() {
            // Show loading state
            this.disabled = true;
            this.innerHTML = '<span class="material-icons" style="animation: spin 1s linear infinite;">sync</span> Syncing...';

            // Simulate syncing
            setTimeout(() => {
                this.disabled = false;
                this.innerHTML = '<span class="material-icons">sync</span> Sync Devices';
                showNotification('Devices synchronized with Azure IoT Hub', 'success');
            }, 2000);
        });
    }

    // View Analytics Button
    if (viewAnalyticsBtn) {
        viewAnalyticsBtn.addEventListener('click', function() {
            showNotification('IoT Analytics dashboard coming soon', 'info');
        });
    }

    // Function to add a new device to the list
    function addNewDevice(name, type, location, manufacturer = '') {
        // Get icon based on device type
        let icon;
        switch(type) {
            case 'camera':
                icon = 'videocam';
                break;
            case 'motion':
                icon = 'sensors';
                break;
            case 'door':
                icon = 'door_front';
                break;
            case 'window':
                icon = 'window';
                break;
            case 'alarm':
                icon = 'notifications_active';
                break;
            case 'doorbell':
                icon = 'doorbell';
                break;
            case 'smoke':
                icon = 'detector_smoke';
                break;
            case 'water':
                icon = 'water_drop';
                break;
            default:
                icon = 'devices_other';
        }

        // Get capabilities based on device type
        let capabilities = [];
        switch(type) {
            case 'camera':
                capabilities = ['Motion Detection', 'Night Vision'];
                break;
            case 'motion':
                capabilities = ['Motion Detection', 'Weather Resistant'];
                break;
            case 'door':
                capabilities = ['Remote Access', 'Auto-Lock'];
                break;
            case 'window':
                capabilities = ['Tamper Detection', 'Battery Powered'];
                break;
            case 'alarm':
                capabilities = ['Loud Siren', 'Battery Backup'];
                break;
            case 'doorbell':
                capabilities = ['Video Recording', 'Two-way Audio'];
                break;
            case 'smoke':
                capabilities = ['Smoke Detection', 'CO Detection'];
                break;
            case 'water':
                capabilities = ['Water Detection', 'Temperature Sensing'];
                break;
            default:
                capabilities = ['IoT Enabled', 'Azure Connected'];
        }

        // Create capabilities HTML
        const capabilitiesHTML = capabilities.map(cap =>
            `<span class="capability-badge">${cap}</span>`
        ).join('');

        // Create device element
        const deviceElement = document.createElement('div');
        deviceElement.className = 'iot-device-item';
        deviceElement.innerHTML = `
            <div class="device-icon">
                <span class="material-icons">${icon}</span>
            </div>
            <div class="device-info">
                <div class="device-name">${name}</div>
                <div class="device-status connected">Connected</div>
                <div class="device-details">Location: ${location || 'Not specified'}</div>
                <div class="device-capabilities">
                    ${capabilitiesHTML}
                </div>
            </div>
            <div class="device-actions">
                <button class="icon-button small" title="Configure Device">
                    <span class="material-icons">settings</span>
                </button>
                <button class="icon-button small device-delete-btn" title="Remove Device">
                    <span class="material-icons">delete</span>
                </button>
            </div>
        `;

        // Add delete functionality
        const deleteBtn = deviceElement.querySelector('.device-delete-btn');
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to remove this device?')) {
                deviceElement.remove();
                showNotification('Device removed successfully', 'success');
            }
        });

        // Add to the list
        iotDevicesList.prepend(deviceElement);

        // Update device count
        updateDeviceCount();
    }

    // Function to update device count
    function updateDeviceCount() {
        const deviceCountElement = document.querySelector('.device-count');
        if (deviceCountElement) {
            const deviceCount = document.querySelectorAll('.iot-device-item').length;
            deviceCountElement.innerHTML = `${deviceCount}/3 devices <span class="upgrade-note">Upgrade for more</span>`;
        }
    }

    // Function to show notification
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `settings-message ${type}`;
        notification.textContent = message;

        // Add to the page
        document.querySelector('.profile-section').appendChild(notification);

        // Remove after delay
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    // Initialize tooltips for all action buttons
    document.querySelectorAll('.icon-button.small').forEach(function(btn) {
        if (!btn.getAttribute('title')) {
            const icon = btn.querySelector('.material-icons')?.textContent;
            let tooltipText;

            switch(icon) {
                case 'settings':
                    tooltipText = 'Configure';
                    break;
                case 'delete':
                    tooltipText = 'Remove';
                    break;
                case 'edit':
                    tooltipText = 'Edit';
                    break;
                case 'send':
                    tooltipText = 'Test Alert';
                    break;
                case 'visibility':
                    tooltipText = 'View Live';
                    break;
                case 'timeline':
                    tooltipText = 'View Activity';
                    break;
                case 'build':
                    tooltipText = 'Troubleshoot';
                    break;
                default:
                    tooltipText = 'Action';
            }

            btn.setAttribute('title', tooltipText);
        }
    });

    // Add CSS animation for spin
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});
