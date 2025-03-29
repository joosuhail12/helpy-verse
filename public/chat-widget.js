
(function() {
  const SCRIPT_ID = 'pullse-chat-widget-script';
  const WIDGET_ID = 'pullse-chat-widget';
  const CDN_URL = window.location.origin;

  // Skip if already initialized
  if (document.getElementById(WIDGET_ID)) return;
  
  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = WIDGET_ID;
  document.body.appendChild(widgetContainer);
  
  // Add widget styles with preload
  const styleTag = document.createElement('link');
  styleTag.rel = 'stylesheet';
  styleTag.href = `${CDN_URL}/widget.css`;
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
  
  // Add configuration, prioritizing window variables then falling back to stored settings
  window.PULLSE_CHAT_CONFIG = {
    workspaceId: window.PULLSE_WORKSPACE_ID || '6c22b22f-7bdf-43db-b7c1-9c5884125c63',
    theme: {
      colors: window.PULLSE_THEME_COLORS || {
        primary: storedSettings.primaryColor || '#9b87f5'
      },
      position: window.PULLSE_POSITION || storedSettings.position || 'right',
      compact: window.PULLSE_COMPACT === true || storedSettings.compact === true,
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
    }
  };
  
  // Set the widget URL
  window.PULLSE_WIDGET_URL = `${CDN_URL}/widget.js`;
  window.PULLSE_WIDGET_CSS = `${CDN_URL}/widget.css`;
  
  // Load script with dynamic import technique
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = `${CDN_URL}/chat-widget-standalone.js`;
  script.async = true;
  script.defer = true;
  
  document.body.appendChild(script);
})();
