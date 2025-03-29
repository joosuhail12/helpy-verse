
// This loads the chat widget component into the container
(function() {
  console.log('Loading isolated chat widget with config:', window.PULLSE_CHAT_CONFIG);
  
  // Store the config globally so the widget can access it
  const config = window.PULLSE_CHAT_CONFIG || {};
  
  // Create widget script element
  const script = document.createElement('script');
  script.type = 'module';
  script.src = window.PULLSE_WIDGET_URL || '/widget.js';
  
  // Create widget styles
  const styles = document.createElement('link');
  styles.rel = 'stylesheet';
  styles.href = window.PULLSE_WIDGET_CSS || '/widget.css';
  
  // Create widget container
  const container = document.createElement('div');
  container.id = 'chat-widget-root';
  document.body.appendChild(container);
  
  // Add resources to the document
  document.head.appendChild(styles);
  document.body.appendChild(script);
  
  // Initialize external API
  window.PULLSE_CHAT = {
    open: function() {
      const event = new CustomEvent('pullse-chat-toggle', { detail: { open: true } });
      window.dispatchEvent(event);
    },
    close: function() {
      const event = new CustomEvent('pullse-chat-toggle', { detail: { open: false } });
      window.dispatchEvent(event);
    },
    toggle: function() {
      const event = new CustomEvent('pullse-chat-toggle', { detail: { toggle: true } });
      window.dispatchEvent(event);
    }
  };
  
  console.log('Standalone chat widget initialized for workspace:', config.workspaceId);
})();
