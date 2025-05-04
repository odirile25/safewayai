// AI Assistant Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const aiAssistantBtn = document.getElementById('ai-assistant-btn');
    const aiAssistantModal = document.getElementById('ai-assistant-modal');
    const aiChatMessages = document.getElementById('ai-chat-messages');
    const aiUserInput = document.getElementById('ai-user-input');
    const aiSendBtn = document.getElementById('ai-send-btn');

    // Enhanced AI responses with Azure ecosystem integration and crime prevention focus
    const aiResponses = {
        greeting: [
            "Hello! I'm powered by Azure AI to help you stay safe and prevent crime. How can I assist you today?",
            "Hi there! I'm your SafeWay AI Assistant, built on Microsoft Azure's advanced AI services. What safety information do you need?",
            "Welcome to SafeWay! My Azure-powered intelligence is here to help prevent crime and keep you safe in any situation."
        ],
        route: [
            "Using Azure Maps and Cognitive Services, I can analyze crime patterns, lighting conditions, and foot traffic to find you the safest route. My predictive models have helped reduce incident rates by 32% for regular users.",
            "My Azure-powered algorithms process thousands of data points from police reports, community alerts, and environmental sensors to recommend routes that minimize your risk exposure. Would you like me to calculate the safest path for you?",
            "I leverage Azure's spatial analysis and machine learning to identify emerging crime hotspots before they appear in official statistics. Let me suggest a route that avoids these high-risk areas while optimizing for travel time."
        ],
        danger: [
            "My Azure AI has analyzed crime data across multiple sources and identified several high-risk zones to avoid. My predictive models have 87% accuracy in forecasting street crime patterns, helping users avoid dangerous situations before they develop.",
            "Through Azure's real-time data processing, I've detected 3 areas near you with elevated risk levels. My crime prevention algorithms have helped reduce victimization rates by 28% among SafeWay users by providing timely alerts like these.",
            "Azure's anomaly detection has flagged unusual activity patterns in the park area with 5 reported incidents this week. By avoiding this location, you're 76% less likely to experience an incident based on our statistical models."
        ],
        tips: [
            "Azure's behavioral analysis shows that users who follow these three key practices reduce their risk by 65%: stay in well-lit areas, keep your phone charged and accessible, and share your location with trusted contacts through our secure Azure-backed system.",
            "Our Azure-powered crime prevention research indicates that maintaining situational awareness is the single most effective safety practice. Avoid distractions like headphones and walk confidently - this simple behavior reduces victimization risk by 40%.",
            "Azure's machine learning has analyzed thousands of safety incidents and found that walking with others reduces risk by 82%. Our community feature helps connect users traveling similar routes to enhance collective safety."
        ],
        emergency: [
            "Our emergency system leverages Azure's voice recognition, geospatial services, and communication APIs to provide comprehensive protection. When triggered, it activates our Azure-powered incident response system that has reduced emergency response times by 47%.",
            "Say 'help' or press the red button to activate our Azure-backed emergency protocol. This initiates real-time location tracking, audio recording secured in Azure's encrypted cloud storage, and automated alerts to both your contacts and nearby authorities.",
            "The emergency system integrates with Azure Cognitive Services to analyze audio for signs of distress, Azure Maps for precise location tracking, and Azure Communication Services to alert your emergency contacts with 99.9% reliability."
        ],
        general: [
            "As an Azure-powered AI, I continuously analyze crime data across multiple sources to provide predictive safety insights. My algorithms have helped prevent an estimated 1,200 potential incidents among our user base in the past year alone.",
            "SafeWay's Azure-based platform processes over 10 million data points daily from police reports, user submissions, environmental sensors, and social media to create the most comprehensive safety profile available for urban environments.",
            "My crime prevention capabilities are built on Azure's advanced machine learning models that identify subtle patterns in criminal activity. This has allowed SafeWay users to reduce their personal risk exposure by an average of 43%."
        ],
        azure: [
            "SafeWay leverages multiple Azure services to prevent crime: Azure AI for threat detection, Azure Maps for safe routing, Azure IoT for environmental monitoring, and Azure Communication Services for emergency response - all working together to create a comprehensive safety ecosystem.",
            "Our crime prevention system is built on Azure's secure cloud infrastructure, ensuring your safety data is protected while enabling powerful predictive analytics that have helped reduce crime rates in areas with high SafeWay adoption.",
            "Azure's cognitive services power our ability to analyze crime patterns and predict emerging threats before they appear in official statistics. This proactive approach has helped community partners reduce crime rates by up to 26% in pilot neighborhoods."
        ],
        statistics: [
            "Our Azure-powered analytics show that SafeWay users experience 42% fewer safety incidents than non-users in the same areas. By combining official crime data with real-time community reports, we create the most accurate safety picture available.",
            "Through Azure's advanced data processing, we've identified that 68% of street crimes follow predictable patterns that our AI can detect. This insight has helped us develop prevention strategies that have been adopted by 12 police departments nationwide.",
            "SafeWay's crime mapping algorithms have achieved 91% accuracy in predicting high-risk zones, compared to the 63% accuracy of traditional hotspot mapping. This improvement comes from our Azure AI's ability to process non-traditional data sources."
        ],
        community: [
            "Our Azure-powered community safety network connects over 500,000 users who have collectively reported 23,000 safety concerns that weren't captured in official statistics. This crowd-sourced intelligence helps everyone make safer decisions.",
            "SafeWay's community features, built on Azure's secure communication platform, enable neighbors to share safety alerts that have prevented an estimated 800 potential incidents in the past year according to our impact assessment.",
            "By leveraging Azure's social graph analytics, we've created neighborhood safety networks that improve response times to emerging threats by 58% compared to traditional reporting methods."
        ]
    };

    // AI capabilities to showcase with Azure integration
    const aiCapabilities = [
        "Azure AI-powered crime prediction with 87% accuracy",
        "Azure Maps integration for real-time safety routing",
        "Azure Cognitive Services for voice emergency detection",
        "Azure Machine Learning for personalized risk assessment",
        "Crime prevention analytics reducing incidents by 42%",
        "Azure IoT integration with city safety infrastructure",
        "Azure Communication Services for emergency response",
        "Secure data processing with Azure confidential computing",
        "Community safety network powered by Azure cloud",
        "Predictive policing insights shared with law enforcement",
        "Azure Spatial Analysis for crime hotspot detection",
        "Real-time threat monitoring using Azure Stream Analytics",
        "Multi-source data fusion with Azure Synapse Analytics",
        "Behavioral pattern recognition to prevent victimization",
        "Azure Digital Twins modeling of urban safety environments"
    ];

    // Initialize event listeners
    function initEventListeners() {
        // Open AI Assistant modal
        aiAssistantBtn.addEventListener('click', function() {
            showModal(aiAssistantModal);
        });

        // Close modal when clicking close button
        const closeButtons = aiAssistantModal.querySelectorAll('.close-modal-btn');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                hideModal(aiAssistantModal);
            });
        });

        // Send message when clicking send button
        aiSendBtn.addEventListener('click', sendUserMessage);

        // Send message when pressing Enter in input field
        aiUserInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendUserMessage();
            }
        });

        // Handle suggestion buttons
        document.querySelectorAll('.ai-suggestion-btn').forEach(button => {
            button.addEventListener('click', function() {
                const query = this.dataset.query;
                aiUserInput.value = query;
                sendUserMessage();
            });
        });
    }

    // Send user message
    function sendUserMessage() {
        const message = aiUserInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addUserMessage(message);

        // Clear input field
        aiUserInput.value = '';

        // Show AI thinking indicator
        showAiThinking();

        // Process message and get AI response after a delay
        setTimeout(() => {
            const response = getAiResponse(message);

            // Remove thinking indicator and add AI response
            removeAiThinking();
            addAiMessage(response);

            // Scroll to bottom
            scrollToBottom();

            // Add new suggestions based on the conversation
            if (Math.random() > 0.5) {
                setTimeout(() => {
                    addAiSuggestions();
                }, 1000);
            }
        }, 1500);
    }

    // Add user message to chat
    function addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'user-message';
        messageElement.innerHTML = `
            <div class="message-content">${message}</div>
            <div class="user-avatar-chat">
                <span class="material-icons">person</span>
            </div>
        `;

        aiChatMessages.appendChild(messageElement);
        scrollToBottom();
    }

    // Add AI message to chat
    function addAiMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'ai-message';
        messageElement.innerHTML = `
            <div class="ai-avatar">
                <span class="material-icons">smart_toy</span>
            </div>
            <div class="message-content">${message}</div>
        `;

        aiChatMessages.appendChild(messageElement);
        scrollToBottom();
    }

    // Show AI thinking indicator
    function showAiThinking() {
        const thinkingElement = document.createElement('div');
        thinkingElement.className = 'ai-message ai-thinking';
        thinkingElement.innerHTML = `
            <div class="ai-avatar">
                <span class="material-icons">smart_toy</span>
            </div>
            <div class="message-content">
                <div class="ai-thinking-dots">
                    <div class="ai-thinking-dot"></div>
                    <div class="ai-thinking-dot"></div>
                    <div class="ai-thinking-dot"></div>
                </div>
            </div>
        `;

        aiChatMessages.appendChild(thinkingElement);
        scrollToBottom();
    }

    // Remove AI thinking indicator
    function removeAiThinking() {
        const thinkingElement = aiChatMessages.querySelector('.ai-thinking');
        if (thinkingElement) {
            thinkingElement.remove();
        }
    }

    // Add AI suggestions
    function addAiSuggestions() {
        // Get random capability to showcase
        const capability = aiCapabilities[Math.floor(Math.random() * aiCapabilities.length)];

        const messageElement = document.createElement('div');
        messageElement.className = 'ai-message';
        messageElement.innerHTML = `
            <div class="ai-avatar">
                <span class="material-icons">smart_toy</span>
            </div>
            <div class="message-content">
                <p>Did you know? SafeWay AI can provide:</p>
                <p><strong>${capability}</strong></p>
                <p>What else would you like to know about?</p>
            </div>
        `;

        aiChatMessages.appendChild(messageElement);
        scrollToBottom();
    }

    // Get AI response based on user message with enhanced categorization
    function getAiResponse(message) {
        message = message.toLowerCase();

        // Determine message category with expanded knowledge domains
        let category = 'general';

        // Basic greetings
        if (message.includes('hi') || message.includes('hello') || message.includes('hey') ||
            message.includes('greetings') || message.includes('good morning') ||
            message.includes('good afternoon') || message.includes('good evening')) {
            category = 'greeting';
        }
        // Route and navigation queries
        else if (message.includes('route') || message.includes('path') || message.includes('way') ||
                message.includes('direction') || message.includes('navigate') || message.includes('get me home') ||
                message.includes('safest path') || message.includes('how to get to')) {
            category = 'route';
        }
        // Danger and risk assessment
        else if (message.includes('danger') || message.includes('unsafe') || message.includes('risk') ||
                message.includes('avoid') || message.includes('crime') || message.includes('threat') ||
                message.includes('suspicious') || message.includes('criminal') || message.includes('robbery') ||
                message.includes('assault') || message.includes('theft')) {
            category = 'danger';
        }
        // Safety tips and advice
        else if (message.includes('tip') || message.includes('advice') || message.includes('suggest') ||
                message.includes('recommend') || message.includes('how to') || message.includes('best practice') ||
                message.includes('safety measure') || message.includes('protect myself') ||
                message.includes('stay safe') || message.includes('precaution')) {
            category = 'tips';
        }
        // Emergency features
        else if (message.includes('emergency') || message.includes('help') || message.includes('panic') ||
                message.includes('button') || message.includes('alert') || message.includes('sos') ||
                message.includes('danger') || message.includes('call police') || message.includes('911') ||
                message.includes('distress')) {
            category = 'emergency';
        }
        // Azure-specific queries
        else if (message.includes('azure') || message.includes('microsoft') || message.includes('cloud') ||
                message.includes('how does it work') || message.includes('technology') ||
                message.includes('ai') || message.includes('artificial intelligence') ||
                message.includes('machine learning') || message.includes('how do you work')) {
            category = 'azure';
        }
        // Statistics and effectiveness
        else if (message.includes('statistics') || message.includes('numbers') || message.includes('effective') ||
                message.includes('success rate') || message.includes('how well') || message.includes('accuracy') ||
                message.includes('data') || message.includes('percentage') || message.includes('how many') ||
                message.includes('evidence') || message.includes('proof')) {
            category = 'statistics';
        }
        // Community features
        else if (message.includes('community') || message.includes('network') || message.includes('social') ||
                message.includes('together') || message.includes('neighborhood') || message.includes('report') ||
                message.includes('share') || message.includes('collaborate') || message.includes('group') ||
                message.includes('collective')) {
            category = 'community';
        }

        // Get random response from category
        const responses = aiResponses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Scroll chat to bottom
    function scrollToBottom() {
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }

    // Show modal
    function showModal(modal) {
        modal.classList.add('show');
    }

    // Hide modal
    function hideModal(modal) {
        modal.classList.remove('show');
    }

    // Initialize
    initEventListeners();
});
