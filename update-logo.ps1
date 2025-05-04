$files = @("history.html", "saferoute.html", "profile.html")

foreach ($file in $files) {
    $filePath = "c:\Users\odiri\Downloads\MSAIskillshackathon-main\safeway-html\$file"
    $content = Get-Content -Path $filePath -Raw

    # Update header logo
    $content = $content -replace '<a href="index.html" class="app-title">\s*<span class="material-icons title-icon">shield</span>\s*SafeWayAI\s*</a>', '<a href="index.html" class="app-title">
                    <img src="images/safeway-logo-header.svg" alt="SafeWay Logo" class="header-logo">
                </a>'

    # Update side menu logo
    $content = $content -replace '<div class="menu-header">\s*<h2>\s*<span class="material-icons title-icon">shield</span>\s*SafeWayAI\s*</h2>', '<div class="menu-header">
                <div class="menu-logo">
                    <img src="images/safeway-logo-header.svg" alt="SafeWay Logo" class="side-menu-logo">
                </div>'

    # Update AI Assistant modal logo
    $content = $content -replace '<div class="ai-assistant-header">\s*<span class="material-icons ai-icon">smart_toy</span>\s*<h3>SafeWay AI Assistant</h3>\s*</div>', '<div class="ai-assistant-header">
                    <div class="ai-logo-container">
                        <img src="images/safeway-logo-header.svg" alt="SafeWay Logo" class="ai-modal-logo">
                    </div>
                    <h3>AI Assistant</h3>
                </div>'

    # Save the updated content
    Set-Content -Path $filePath -Value $content
}

Write-Host "Logo updates completed for all pages."
