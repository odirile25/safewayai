// Whistle Blower functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form elements
    const reportTypeSelect = document.getElementById('report-type');
    const reportDescription = document.getElementById('report-description');
    const reportLocation = document.getElementById('report-location');
    const locationBtn = document.querySelector('.location-btn');
    const submitReportBtn = document.getElementById('submit-report');
    const filterReports = document.getElementById('filter-reports');
    const logEntries = document.querySelector('.log-entries');

    // Sample data for demonstration
    const sampleReports = [
        {
            type: 'suspicious',
            icon: 'visibility',
            title: 'Suspicious Activity',
            description: 'Group of individuals loitering near the park entrance, acting suspiciously.',
            location: 'Central Park, East Entrance',
            time: '10 min ago'
        },
        {
            type: 'hazard',
            icon: 'warning',
            title: 'Road Hazard',
            description: 'Large pothole in the middle of the road causing vehicles to swerve dangerously.',
            location: 'Main Street & 5th Avenue',
            time: '25 min ago'
        },
        {
            type: 'crime',
            icon: 'local_police',
            title: 'Crime in Progress',
            description: 'Witnessed attempted break-in at the convenience store. Police have been notified.',
            location: '123 Oak Street',
            time: '45 min ago'
        },
        {
            type: 'infrastructure',
            icon: 'construction',
            title: 'Infrastructure Issue',
            description: 'Street light out at busy intersection creating dangerous conditions at night.',
            location: 'Elm Street & Maple Avenue',
            time: '1 hour ago'
        }
    ];

    // Get current location button
    locationBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            reportLocation.value = "Getting location...";

            navigator.geolocation.getCurrentPosition(
                function(position) {
                    // In a real app, we would use reverse geocoding to get the address
                    // For demo purposes, we'll just show the coordinates
                    const lat = position.coords.latitude.toFixed(6);
                    const lng = position.coords.longitude.toFixed(6);
                    reportLocation.value = `Current Location (${lat}, ${lng})`;
                },
                function(error) {
                    reportLocation.value = "";
                    alert("Unable to retrieve your location. Please enter it manually.");
                    console.error("Geolocation error:", error);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser. Please enter your location manually.");
        }
    });

    // Submit report
    submitReportBtn.addEventListener('click', function() {
        // Validate form
        if (!reportTypeSelect.value) {
            alert("Please select a type of concern.");
            return;
        }

        if (!reportDescription.value.trim()) {
            alert("Please provide a description of the situation.");
            return;
        }

        if (!reportLocation.value.trim()) {
            alert("Please provide a location.");
            return;
        }

        // In a real app, we would send this data to a server
        // For demo purposes, we'll just add it to the UI

        // Get icon and title based on type
        let icon, title;
        switch(reportTypeSelect.value) {
            case 'suspicious':
                icon = 'visibility';
                title = 'Suspicious Activity';
                break;
            case 'hazard':
                icon = 'warning';
                title = 'Road Hazard';
                break;
            case 'crime':
                icon = 'local_police';
                title = 'Crime in Progress';
                break;
            case 'infrastructure':
                icon = 'construction';
                title = 'Infrastructure Issue';
                break;
            case 'other':
                icon = 'info';
                title = 'Other Concern';
                break;
        }

        // Create new report entry
        const newReport = {
            type: reportTypeSelect.value,
            icon: icon,
            title: title,
            description: reportDescription.value.trim(),
            location: reportLocation.value.trim(),
            time: 'Just now'
        };

        // Add to UI
        addReportToUI(newReport);

        // Reset form
        reportTypeSelect.value = '';
        reportDescription.value = '';
        reportLocation.value = '';

        // Show confirmation
        alert("Thank you for your report. Safety officials have been notified.");
    });

    // Filter reports
    filterReports.addEventListener('change', function() {
        const filterValue = this.value;
        const logEntryElements = document.querySelectorAll('.log-entry');

        if (filterValue === 'all') {
            // Show all reports
            logEntryElements.forEach(entry => {
                entry.style.display = 'flex';
            });
        } else {
            // Filter by type
            logEntryElements.forEach(entry => {
                const entryType = entry.querySelector('.entry-icon').classList[1];
                if (entryType === filterValue) {
                    entry.style.display = 'flex';
                } else {
                    entry.style.display = 'none';
                }
            });
        }

        // Show message about filter
        const filterName = this.options[this.selectedIndex].text;
        const filterMessage = document.createElement('div');
        filterMessage.className = 'filter-message';
        filterMessage.textContent = `Showing ${filterName} reports`;

        // Remove any existing filter message
        const existingMessage = document.querySelector('.filter-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Add the message
        const logHeader = document.querySelector('.log-header');
        logHeader.appendChild(filterMessage);

        // Auto-hide the message after 3 seconds
        setTimeout(() => {
            filterMessage.classList.add('fade-out');
            setTimeout(() => {
                filterMessage.remove();
            }, 500);
        }, 3000);
    });

    // Function to add a report to the UI
    function addReportToUI(report) {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'log-entry';

        entryDiv.innerHTML = `
            <div class="entry-icon ${report.type}">
                <span class="material-icons">${report.icon}</span>
            </div>
            <div class="entry-content">
                <div class="entry-header">
                    <h4>${report.title}</h4>
                    <span class="entry-time">${report.time}</span>
                </div>
                <p>${report.description}</p>
                <div class="entry-location">
                    <span class="material-icons">location_on</span>
                    <span>${report.location}</span>
                </div>
            </div>
        `;

        // Add to the top of the list
        logEntries.insertBefore(entryDiv, logEntries.firstChild);
    }
});
