
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
  
  // Add widget styles
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
  
  // Add configuration
  window.PULLSE_CHAT_CONFIG = {
    workspaceId: window.PULLSE_WORKSPACE_ID || '6c22b22f-7bdf-43db-b7c1-9c5884125c63',
    theme: {
      colors: window.PULLSE_THEME_COLORS || {},
      position: window.PULLSE_POSITION || 'right',
      compact: window.PULLSE_COMPACT === true,
      labels: window.PULLSE_LABELS || {}
    }
  };
  
  document.body.appendChild(script);
})();
