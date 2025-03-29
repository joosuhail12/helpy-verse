
/**
 * Chat Widget Loader Script
 * 
 * This script loads the standalone chat widget on any website.
 * Add this script to your website to embed the chat widget.
 */
(function() {
  // Configuration
  const SCRIPT_ID = 'pullse-chat-widget-script';
  const WIDGET_ID = 'pullse-chat-widget-container';
  const DEFAULT_WORKSPACE_ID = '6c22b22f-7bdf-43db-b7c1-9c5884125c63';
  
  // Skip if already loaded
  if (document.getElementById(SCRIPT_ID)) {
    console.log('[Chat Widget] Already loaded');
    return;
  }
  
  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = WIDGET_ID;
  document.body.appendChild(widgetContainer);
  
  // Build configuration object
  window.PULLSE_CHAT_CONFIG = {
    workspaceId: window.PULLSE_WORKSPACE_ID || DEFAULT_WORKSPACE_ID,
    theme: {
      colors: {
        primary: window.PULLSE_PRIMARY_COLOR || '#9b87f5'
      },
      position: window.PULLSE_POSITION || 'right',
      compact: window.PULLSE_COMPACT === true
    },
    settings: {
      appearance: {
        primaryColor: window.PULLSE_PRIMARY_COLOR || '#9b87f5',
        position: window.PULLSE_POSITION || 'right',
        compact: window.PULLSE_COMPACT === true
      },
      content: {
        welcomeTitle: window.PULLSE_WELCOME_TITLE || 'Hello there.',
        welcomeSubtitle: window.PULLSE_WELCOME_SUBTITLE || 'How can we help?'
      },
      features: {
        enableTypingIndicator: window.PULLSE_ENABLE_TYPING !== false,
        enableReactions: window.PULLSE_ENABLE_REACTIONS !== false,
        enableFileAttachments: window.PULLSE_ENABLE_ATTACHMENTS !== false,
        enableReadReceipts: window.PULLSE_ENABLE_READ_RECEIPTS !== false
      }
    }
  };
  
  // Load the widget
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = window.PULLSE_SCRIPT_URL || (window.location.origin + '/chat-widget-standalone.js');
  script.async = true;
  
  // Add the script to the page
  document.body.appendChild(script);
  
  console.log('[Chat Widget] Loaded with configuration:', window.PULLSE_CHAT_CONFIG);
})();
