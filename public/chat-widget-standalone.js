
// This will be replaced with a bundled version of the chat widget in production
(function() {
  console.log('Chat widget initialized');
  
  // Create root element for the widget
  const root = document.createElement('div');
  root.id = 'chat-widget-root';
  document.getElementById('pullse-chat-widget').appendChild(root);
  
  // Append a message that the widget is working
  const message = document.createElement('div');
  message.textContent = 'Chat widget is working! Configure on the backend to connect to your workspace.';
  message.style.position = 'fixed';
  message.style.bottom = '100px';
  message.style.right = '20px';
  message.style.backgroundColor = '#F3F4F6';
  message.style.color = '#1F2937';
  message.style.padding = '12px';
  message.style.borderRadius = '8px';
  message.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
  message.style.maxWidth = '300px';
  message.style.zIndex = '9999';
  
  // Add a small delay
  setTimeout(function() {
    document.body.appendChild(message);
    
    // Remove the message after 5 seconds
    setTimeout(function() {
      message.remove();
    }, 5000);
  }, 1000);
})();
