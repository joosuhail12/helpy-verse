
(function() {
  const SCRIPT_ID = 'pullse-chat-widget-script';
  const WIDGET_ID = 'pullse-chat-widget';
  const CDN_URL = window.location.origin;
  const WIDGET_EVENTS = {
    INITIALIZE: 'chat-widget-initialize',
    OPEN: 'chat-widget-open',
    CLOSE: 'chat-widget-close',
    TOGGLE: 'chat-widget-toggle'
  };

  // Skip if already initialized
  if (document.getElementById(WIDGET_ID)) return;
  
  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = WIDGET_ID;
  document.body.appendChild(widgetContainer);
  
  // Add widget styles with preload
  const styleTag = document.createElement('link');
  styleTag.rel = 'stylesheet';
  styleTag.href = `${CDN_URL}/chat-widget.css`;
  document.head.appendChild(styleTag);
  
  // Add loading indicator while script loads
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'pullse-chat-loading';
  loadingIndicator.style.display = 'none';
  loadingIndicator.innerHTML = `
    <div style="
      position: fixed;
      bottom: 80px;
      right: 20px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      padding: 16px;
      z-index: 99999;
    ">
      <div style="
        width: 24px;
        height: 24px;
        border: 3px solid #f3f3f3;
        border-radius: 50%;
        border-top: 3px solid #9b87f5;
        animation: pullse-spin 1s linear infinite;
      "></div>
    </div>
    <style>
      @keyframes pullse-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  document.body.appendChild(loadingIndicator);
  
  // Try to get stored settings first
  let storedSettings = {};
  try {
    const savedSettings = localStorage.getItem('chatWidgetSettings');
    if (savedSettings) {
      storedSettings = JSON.parse(savedSettings);
    }
  } catch (e) {
    console.error('Failed to load stored settings:', e);
  }
  
  // Build configuration object from window variables or fallback to stored settings
  window.PULLSE_CHAT_CONFIG = {
    workspaceId: window.PULLSE_WORKSPACE_ID || '6c22b22f-7bdf-43db-b7c1-9c5884125c63',
    theme: {
      colors: window.PULLSE_THEME_COLORS || {
        primary: storedSettings.primaryColor || '#9b87f5'
      },
      position: window.PULLSE_POSITION || storedSettings.position || 'right',
      compact: window.PULLSE_COMPACT === true || storedSettings.compact === true,
    },
    labels: window.PULLSE_LABELS || {
      welcomeTitle: storedSettings.welcomeTitle || 'Hello there.',
      welcomeSubtitle: storedSettings.welcomeSubtitle || 'How can we help?'
    },
    features: {
      typingIndicator: window.PULLSE_FEATURES?.typingIndicator !== false && 
                       (storedSettings.enableTypingIndicator !== false),
      reactions: window.PULLSE_FEATURES?.reactions !== false && 
                 (storedSettings.enableReactions !== false),
      fileAttachments: window.PULLSE_FEATURES?.fileAttachments !== false && 
                       (storedSettings.enableFileAttachments !== false),
      readReceipts: window.PULLSE_FEATURES?.readReceipts !== false && 
                    (storedSettings.enableReadReceipts !== false)
    }
  };
  
  // Setup event listeners for controlling the widget
  window.addEventListener(WIDGET_EVENTS.OPEN, function() {
    // This will be handled by the widget internally
    console.log('Chat widget: open event received');
  });
  
  window.addEventListener(WIDGET_EVENTS.CLOSE, function() {
    // This will be handled by the widget internally
    console.log('Chat widget: close event received');
  });
  
  window.addEventListener(WIDGET_EVENTS.TOGGLE, function() {
    // This will be handled by the widget internally
    console.log('Chat widget: toggle event received');
  });
  
  // Load script with dynamic import technique
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = `${CDN_URL}/chat-widget-standalone.js`;
  script.async = true;
  script.defer = true;
  
  // Show loading indicator when loading widget
  script.onload = function() {
    // Hide loading indicator when script loads
    loadingIndicator.style.display = 'none';
    
    // Initialize widget with config
    if (window.PULLSE && window.PULLSE.initializeWidget) {
      window.PULLSE.initializeWidget(window.PULLSE_CHAT_CONFIG);
    }
  };
  
  document.body.appendChild(script);
})();
