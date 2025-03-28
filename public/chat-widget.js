
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
  
  // Register service worker if supported
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(`${CDN_URL}/chat-worker.js`)
      .then(registration => {
        console.log('Chat widget service worker registered:', registration.scope);
      })
      .catch(error => {
        console.warn('Chat widget service worker registration failed:', error);
      });
  }
  
  // Preload critical assets
  const preloadCSS = () => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = `${CDN_URL}/chat-widget.css`;
    link.onload = () => {
      // Convert preload to stylesheet once loaded
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  };
  
  // Add widget styles with preloading
  preloadCSS();
  
  // Preload widget script
  const preloadScript = () => {
    const linkPreload = document.createElement('link');
    linkPreload.rel = 'preload';
    linkPreload.as = 'script';
    linkPreload.href = `${CDN_URL}/chat-widget-standalone.js`;
    document.head.appendChild(linkPreload);
  };
  
  preloadScript();
  
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
      labels: window.PULLSE_LABELS || {},
      features: {
        typingIndicator: window.PULLSE_FEATURES?.typingIndicator !== false,
        reactions: window.PULLSE_FEATURES?.reactions !== false,
        fileAttachments: window.PULLSE_FEATURES?.fileAttachments !== false,
        readReceipts: window.PULLSE_FEATURES?.readReceipts !== false
      }
    }
  };
  
  document.body.appendChild(script);
})();
