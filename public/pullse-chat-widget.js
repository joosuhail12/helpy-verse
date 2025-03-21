
/**
 * Pullse Chat Widget Embed Script
 * Version: 1.0.0
 * 
 * Usage:
 * <script src="https://cdn.pullse.ai/pullse-chat-widget.js"></script>
 * <script>
 *   Pullse.init({
 *     workspaceId: 'YOUR_WORKSPACE_ID',
 *     primaryColor: '#8B5CF6'
 *   });
 * </script>
 */

(function() {
  // Define default options
  const defaultOptions = {
    workspaceId: '',
    primaryColor: '#9b87f5',
    position: 'right',
    welcomeMessage: 'How can we help you today?',
    agentName: 'Support Team',
    hideOnPaths: [],
  };

  let isInitialized = false;
  let widgetOptions = { ...defaultOptions };
  let widgetIframe = null;
  let widgetContainer = null;
  let widgetOpen = false;
  
  // Create global Pullse object
  window.Pullse = {
    init: function(options) {
      if (isInitialized) {
        console.warn('Pullse Chat Widget is already initialized.');
        return;
      }
      
      if (!options.workspaceId) {
        console.error('Pullse Chat Widget: workspaceId is required for initialization.');
        return;
      }
      
      // Merge options with defaults
      widgetOptions = Object.assign({}, defaultOptions, options);
      
      // Check if widget should be hidden on current path
      const currentPath = window.location.pathname;
      if (widgetOptions.hideOnPaths && 
          widgetOptions.hideOnPaths.some(path => currentPath.includes(path))) {
        console.log(`Pullse Chat Widget: Hidden on path ${currentPath}`);
        return;
      }
      
      // Add required CSS to the document
      addStyles();
      
      // Create widget container
      createWidgetContainer();
      
      // Create launcher button
      createLauncherButton();
      
      // Mark as initialized
      isInitialized = true;
      console.log('Pullse Chat Widget initialized successfully.');
    },
    
    open: function() {
      if (!isInitialized) {
        console.error('Pullse Chat Widget is not initialized. Call init() first.');
        return;
      }
      
      openWidget();
    },
    
    close: function() {
      if (!isInitialized) return;
      closeWidget();
    },
    
    toggle: function() {
      if (!isInitialized) {
        console.error('Pullse Chat Widget is not initialized. Call init() first.');
        return;
      }
      
      if (widgetOpen) {
        closeWidget();
      } else {
        openWidget();
      }
    }
  };
  
  // Helper function to add required styles
  function addStyles() {
    const styleElement = document.createElement('style');
    styleElement.id = 'pullse-chat-styles';
    styleElement.textContent = `
      #pullse-chat-launcher {
        background-color: ${widgetOptions.primaryColor};
        color: white;
        border: none;
        border-radius: 50%;
        width: 56px;
        height: 56px;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      #pullse-chat-launcher:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
      }
      
      #pullse-chat-iframe {
        border: none;
        width: 350px;
        height: 500px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        background-color: white;
        transition: opacity 0.3s ease, transform 0.3s ease;
        opacity: 0;
        transform: translateY(10px);
        display: none;
      }
      
      #pullse-chat-iframe.open {
        opacity: 1;
        transform: translateY(0);
        display: block;
      }
      
      @media (max-width: 480px) {
        #pullse-chat-iframe {
          width: calc(100vw - 40px);
          max-width: 350px;
        }
      }
    `;
    
    document.head.appendChild(styleElement);
  }
  
  // Helper function to create widget container
  function createWidgetContainer() {
    widgetContainer = document.createElement('div');
    widgetContainer.id = 'pullse-chat-widget-container';
    widgetContainer.style.position = 'fixed';
    widgetContainer.style.bottom = '20px';
    widgetContainer.style[widgetOptions.position || 'right'] = '20px';
    widgetContainer.style.zIndex = '999999';
    
    document.body.appendChild(widgetContainer);
  }
  
  // Helper function to create launcher button
  function createLauncherButton() {
    const launcherButton = document.createElement('button');
    launcherButton.id = 'pullse-chat-launcher';
    launcherButton.setAttribute('aria-label', 'Open chat widget');
    
    launcherButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;
    
    launcherButton.addEventListener('click', function() {
      window.Pullse.toggle();
    });
    
    widgetContainer.appendChild(launcherButton);
  }
  
  // Helper function to open widget
  function openWidget() {
    const launcherButton = document.getElementById('pullse-chat-launcher');
    if (launcherButton) {
      launcherButton.style.display = 'none';
    }
    
    if (!widgetIframe) {
      widgetIframe = document.createElement('iframe');
      widgetIframe.id = 'pullse-chat-iframe';
      widgetIframe.src = `https://widget.pullse.ai/chat/${widgetOptions.workspaceId}`;
      
      // For development/testing, we can load from localhost
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        widgetIframe.src = `${window.location.origin}/widget/chat`;
      }
      
      // Add messaging to pass options to iframe
      widgetIframe.onload = function() {
        if (widgetIframe && widgetIframe.contentWindow) {
          widgetIframe.contentWindow.postMessage({
            type: 'PULLSE_CHAT_OPTIONS',
            options: widgetOptions
          }, '*');
        }
      };
      
      widgetContainer.appendChild(widgetIframe);
    }
    
    // Show iframe with animation
    setTimeout(function() {
      if (widgetIframe) {
        widgetIframe.style.display = 'block';
        setTimeout(function() {
          widgetIframe.classList.add('open');
        }, 10);
      }
    }, 50);
    
    widgetOpen = true;
  }
  
  // Helper function to close widget
  function closeWidget() {
    if (widgetIframe) {
      widgetIframe.classList.remove('open');
      
      // Wait for animation to complete
      setTimeout(function() {
        if (widgetIframe) {
          widgetIframe.style.display = 'none';
        }
        
        // Show launcher button
        const launcherButton = document.getElementById('pullse-chat-launcher');
        if (launcherButton) {
          launcherButton.style.display = 'flex';
        }
      }, 300);
    }
    
    widgetOpen = false;
  }
  
  // Listen for messages from the iframe
  window.addEventListener('message', function(event) {
    // Validate message origin for security
    if (event.origin !== 'https://widget.pullse.ai' && 
        event.origin !== window.location.origin) {
      return;
    }
    
    if (!event.data || typeof event.data !== 'object') return;
    
    // Handle close widget request
    if (event.data.type === 'PULLSE_CLOSE_WIDGET') {
      window.Pullse.close();
    }
  });
})();
