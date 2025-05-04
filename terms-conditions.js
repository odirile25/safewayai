// Terms and Conditions JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user has already accepted terms
    const hasAcceptedTerms = localStorage.getItem('safeway_terms_accepted');
    const termsModal = document.getElementById('terms-modal');
    const acceptTermsBtn = document.getElementById('accept-terms-btn');
    const declineTermsBtn = document.getElementById('decline-terms-btn');
    const requiredCheckboxes = document.querySelectorAll('.consent-options input[required]');
    const allCheckboxes = document.querySelectorAll('.consent-options input[type="checkbox"]');
    
    // Show terms modal if user hasn't accepted yet
    if (!hasAcceptedTerms) {
        termsModal.classList.add('show');
        document.body.classList.add('modal-open');
    }
    
    // Handle checkbox changes to enable/disable accept button
    allCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            updateAcceptButton();
        });
    });
    
    // Function to check if all required checkboxes are checked
    function updateAcceptButton() {
        const allRequiredChecked = Array.from(requiredCheckboxes).every(checkbox => checkbox.checked);
        
        if (allRequiredChecked) {
            acceptTermsBtn.removeAttribute('disabled');
            acceptTermsBtn.classList.add('pulse-once');
        } else {
            acceptTermsBtn.setAttribute('disabled', 'disabled');
            acceptTermsBtn.classList.remove('pulse-once');
        }
    }
    
    // Handle accept button click
    if (acceptTermsBtn) {
        acceptTermsBtn.addEventListener('click', function() {
            // Save consent preferences
            const consentData = {
                personal: document.getElementById('consent-personal').checked,
                location: document.getElementById('consent-location').checked,
                voice: document.getElementById('consent-voice').checked,
                iot: document.getElementById('consent-iot').checked,
                marketing: document.getElementById('consent-marketing').checked,
                acceptedAt: new Date().toISOString()
            };
            
            // Store consent in localStorage
            localStorage.setItem('safeway_terms_accepted', 'true');
            localStorage.setItem('safeway_consent_data', JSON.stringify(consentData));
            
            // Close modal and show success message
            termsModal.classList.remove('show');
            document.body.classList.remove('modal-open');
            
            // Show welcome message
            showWelcomeMessage();
        });
    }
    
    // Handle decline button click
    if (declineTermsBtn) {
        declineTermsBtn.addEventListener('click', function() {
            // Show warning message
            if (confirm('You must accept the Terms and Conditions to use SafeWayAI. Are you sure you want to decline?')) {
                // Redirect to a page explaining why terms are necessary
                alert('You have declined the Terms and Conditions. The application cannot be used without accepting these terms.');
                // In a real app, we would redirect to an explanation page
            }
        });
    }
    
    // Function to show welcome message
    function showWelcomeMessage() {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.innerHTML = `
            <div class="welcome-content">
                <span class="material-icons welcome-icon">verified_user</span>
                <h3>Welcome to SafeWayAI!</h3>
                <p>Thank you for accepting our terms. Your safety is our priority.</p>
                <button class="primary-button" id="welcome-continue-btn">Continue</button>
            </div>
        `;
        
        document.body.appendChild(welcomeMessage);
        
        // Add animation class after a small delay
        setTimeout(() => {
            welcomeMessage.classList.add('show');
        }, 100);
        
        // Handle continue button
        const continueBtn = document.getElementById('welcome-continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', function() {
                welcomeMessage.classList.remove('show');
                setTimeout(() => {
                    welcomeMessage.remove();
                }, 500);
            });
        }
    }
    
    // Add CSS for welcome message
    const style = document.createElement('style');
    style.textContent = `
        .welcome-message {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        
        .welcome-message.show {
            opacity: 1;
            visibility: visible;
        }
        
        .welcome-content {
            background-color: #1a1a2e;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
            transform: translateY(20px);
            opacity: 0;
            transition: transform 0.5s ease, opacity 0.5s ease;
        }
        
        .welcome-message.show .welcome-content {
            transform: translateY(0);
            opacity: 1;
        }
        
        .welcome-icon {
            font-size: 48px;
            color: #4285F4;
            margin-bottom: 20px;
        }
        
        .welcome-content h3 {
            margin: 0 0 15px 0;
            color: white;
            font-size: 24px;
        }
        
        .welcome-content p {
            margin: 0 0 25px 0;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .pulse-once {
            animation: pulse-animation 2s ease-in-out;
        }
        
        @keyframes pulse-animation {
            0% {
                box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.7);
            }
            70% {
                box-shadow: 0 0 0 15px rgba(66, 133, 244, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(66, 133, 244, 0);
            }
        }
    `;
    document.head.appendChild(style);
});
