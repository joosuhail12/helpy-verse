
(function() {
  const SCRIPT_ID = 'pullse-chat-widget-script';
  const WIDGET_ID = 'pullse-chat-widget';
  const CDN_URL = window.location.origin;

  // Skip if already initialized
  if (document.getElementById(WIDGET_ID)) return;
  
  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = WIDGET_ID;
  
  // Apply style isolation
  widgetContainer.style.isolation = 'isolate';
  widgetContainer.style.all = 'initial';
  widgetContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  
  document.body.appendChild(widgetContainer);
  
  // Add widget styles - use a separate stylesheet for isolation
  const styleTag = document.createElement('link');
  styleTag.rel = 'stylesheet';
  styleTag.href = `${CDN_URL}/chat-widget.css`;
  document.head.appendChild(styleTag);
  
  // Load the widget script
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = `${CDN_URL}/chat-widget-standalone.js`;
  script.async = true;
  script.defer = true;
  
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
  
  document.body.appendChild(script);
})();
