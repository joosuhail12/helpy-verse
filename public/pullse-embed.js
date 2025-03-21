
/**
 * Lightweight Pullse Chat Widget Embed Script
 * Version: 1.0.0
 */

(function() {
  // Configuration
  const DEFAULT_WORKSPACE_ID = '6c22b22f-7bdf-43db-b7c1-9c5884125c63';
  
  // State variables
  let widgetOpen = false;
  let widgetContainer = null;
  let widgetIframe = null;
  let launcherButton = null;
  
  // Create the launcher button
  function createLauncher() {
    launcherButton = document.createElement('button');
    launcherButton.id = 'pullse-chat-launcher';
    launcherButton.setAttribute('aria-label', 'Chat with us');
    launcherButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;
    
    // Style the button
    launcherButton.style.position = 'fixed';
    launcherButton.style.bottom = '20px';
    launcherButton.style.right = '20px';
    launcherButton.style.zIndex = '9999';
    launcherButton.style.width = '48px';
    launcherButton.style.height = '48px';
    launcherButton.style.borderRadius = '50%';
    launcherButton.style.backgroundColor = '#5DCFCF';
    launcherButton.style.color = 'white';
    launcherButton.style.border = 'none';
    launcherButton.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.15)';
    launcherButton.style.cursor = 'pointer';
    launcherButton.style.display = 'flex';
    launcherButton.style.alignItems = 'center';
    launcherButton.style.justifyContent = 'center';
    
    // Add event listener
    launcherButton.addEventListener('click', toggleWidget);
    
    // Add to the DOM
    document.body.appendChild(launcherButton);
  }
  
  // Create the chat widget
  function createWidget() {
    // Create container
    widgetContainer = document.createElement('div');
    widgetContainer.id = 'pullse-chat-container';
    
    // Style the container
    widgetContainer.style.position = 'fixed';
    widgetContainer.style.bottom = '20px';
    widgetContainer.style.right = '20px';
    widgetContainer.style.width = '340px';
    widgetContainer.style.height = '520px';
    widgetContainer.style.zIndex = '9998';
    widgetContainer.style.overflow = 'hidden';
    widgetContainer.style.borderRadius = '12px';
    widgetContainer.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    widgetContainer.style.display = 'none';
    widgetContainer.style.transition = 'all 0.3s ease';
    
    // Create iframe
    widgetIframe = document.createElement('iframe');
    widgetIframe.id = 'pullse-chat-iframe';
    widgetIframe.src = `/widget/chat?workspace=${DEFAULT_WORKSPACE_ID}`;
    widgetIframe.style.width = '100%';
    widgetIframe.style.height = '100%';
    widgetIframe.style.border = 'none';
    
    // Add iframe to container
    widgetContainer.appendChild(widgetIframe);
    
    // Add to the DOM
    document.body.appendChild(widgetContainer);
  }
  
  // Toggle the widget open/closed
  function toggleWidget() {
    widgetOpen = !widgetOpen;
    
    if (widgetOpen) {
      // Update launcher position and icon
      launcherButton.style.bottom = '550px';
      launcherButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
      
      // Show widget
      widgetContainer.style.display = 'block';
      
      // Animate in
      setTimeout(() => {
        widgetContainer.style.opacity = '1';
        widgetContainer.style.transform = 'translateY(0)';
      }, 50);
    } else {
      // Update launcher position and icon
      launcherButton.style.bottom = '20px';
      launcherButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      `;
      
      // Animate out
      widgetContainer.style.opacity = '0';
      widgetContainer.style.transform = 'translateY(10px)';
      
      // Hide widget after animation
      setTimeout(() => {
        widgetContainer.style.display = 'none';
      }, 300);
    }
  }
  
  // Initialize the chat widget
  function init() {
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #pullse-chat-launcher {
        transition: all 0.3s ease;
      }
      #pullse-chat-launcher:hover {
        transform: scale(1.05);
      }
      #pullse-chat-container {
        opacity: 0;
        transform: translateY(10px);
      }
    `;
    document.head.appendChild(style);
    
    // Create elements
    createLauncher();
    createWidget();
  }
  
  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
