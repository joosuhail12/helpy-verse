
// This loads the chat widget component into the container
(function() {
  console.log('Chat widget initialized with config:', window.PULLSE_CHAT_CONFIG);
  
  // Create container for the widget with proper styling
  const container = document.createElement('div');
  container.id = 'pullse-chat-widget-root';
  document.getElementById('pullse-chat-widget').appendChild(container);
  
  // Load the React widget script
  const script = document.createElement('script');
  script.src = `${window.location.origin}/chat-widget-entry.js`;
  script.async = true;
  document.body.appendChild(script);
})();
