
// This loads the chat widget component into the container
(function() {
  console.log('Chat widget initialized with config:', window.PULLSE_CHAT_CONFIG);
  
  const config = window.PULLSE_CHAT_CONFIG || {};
  const workspaceId = config.workspaceId || '6c22b22f-7bdf-43db-b7c1-9c5884125c63';
  
  // Create container for the widget with proper styling
  const container = document.createElement('div');
  container.className = 'pullse-chat-widget-container';
  document.getElementById('pullse-chat-widget').appendChild(container);
  
  // Create widget button
  const button = document.createElement('button');
  button.className = 'pullse-chat-widget-button';
  button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
  button.setAttribute('aria-label', 'Open chat');
  container.appendChild(button);
  
  // Create chat widget panel (hidden by default)
  const panel = document.createElement('div');
  panel.className = 'pullse-chat-widget-panel';
  panel.style.display = 'none';
  container.appendChild(panel);
  
  // Chat header
  const header = document.createElement('div');
  header.className = 'pullse-chat-widget-header';
  header.innerHTML = `
    <h3>Chat Support</h3>
    <button class="pullse-chat-widget-close" aria-label="Close chat">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  `;
  panel.appendChild(header);
  
  // Chat messages area
  const messagesArea = document.createElement('div');
  messagesArea.className = 'pullse-chat-widget-messages';
  
  // Add a welcome message
  const welcomeMsg = document.createElement('div');
  welcomeMsg.className = 'pullse-chat-message-agent';
  welcomeMsg.innerHTML = '<p>👋 Hi there! How can I help you today?</p>';
  messagesArea.appendChild(welcomeMsg);
  
  panel.appendChild(messagesArea);
  
  // Chat input area
  const inputArea = document.createElement('div');
  inputArea.className = 'pullse-chat-widget-input';
  inputArea.innerHTML = `
    <textarea class="pullse-chat-input" placeholder="Type your message here..." rows="1"></textarea>
    <button class="pullse-chat-send" aria-label="Send message">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
    </button>
  `;
  panel.appendChild(inputArea);
  
  // Add event listeners
  button.addEventListener('click', function() {
    panel.style.display = 'flex';
    button.style.display = 'none';
  });
  
  const closeBtn = header.querySelector('.pullse-chat-widget-close');
  closeBtn.addEventListener('click', function() {
    panel.style.display = 'none';
    button.style.display = 'flex';
  });
  
  const textarea = inputArea.querySelector('.pullse-chat-input');
  const sendBtn = inputArea.querySelector('.pullse-chat-send');
  
  // Auto-resize textarea as user types
  textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });
  
  // Send message function
  function sendMessage() {
    const text = textarea.value.trim();
    if (!text) return;
    
    // Create user message element
    const msgEl = document.createElement('div');
    msgEl.className = 'pullse-chat-message-user';
    msgEl.innerHTML = `<p>${text}</p>`;
    messagesArea.appendChild(msgEl);
    
    // Clear input
    textarea.value = '';
    textarea.style.height = 'auto';
    
    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
    
    // Send to Ably channel (would need Ably integration here)
    console.log('Sending message to workspace:', workspaceId, text);
    
    // Simulate agent response
    setTimeout(() => {
      const agentMsg = document.createElement('div');
      agentMsg.className = 'pullse-chat-message-agent';
      agentMsg.innerHTML = `<p>Thanks for your message! Our team will get back to you soon.</p>`;
      messagesArea.appendChild(agentMsg);
      messagesArea.scrollTop = messagesArea.scrollHeight;
    }, 1000);
  }
  
  // Send on click
  sendBtn.addEventListener('click', sendMessage);
  
  // Send on Enter key (but new line on Shift+Enter)
  textarea.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // Apply CSS for the widget
  const style = document.createElement('style');
  style.textContent = `
    .pullse-chat-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    
    .pullse-chat-widget-button {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: hsl(265, 89%, 60%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border: none;
      outline: none;
      transition: background-color 0.2s;
    }
    
    .pullse-chat-widget-button:hover {
      background-color: hsl(265, 89%, 50%);
    }
    
    .pullse-chat-widget-panel {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 320px;
      height: 450px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .pullse-chat-widget-header {
      padding: 12px 16px;
      background-color: hsl(265, 89%, 60%);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .pullse-chat-widget-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
    }
    
    .pullse-chat-widget-close {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .pullse-chat-widget-close:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .pullse-chat-widget-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background-color: #f5f5f5;
    }
    
    .pullse-chat-message-user,
    .pullse-chat-message-agent {
      max-width: 85%;
      margin-bottom: 12px;
      padding: 8px 12px;
      border-radius: 8px;
      position: relative;
    }
    
    .pullse-chat-message-user {
      background-color: hsl(265, 89%, 60%);
      color: white;
      margin-left: auto;
      border-bottom-right-radius: 2px;
    }
    
    .pullse-chat-message-agent {
      background-color: #e6e6e6;
      color: #333;
      margin-right: auto;
      border-bottom-left-radius: 2px;
    }
    
    .pullse-chat-message-user p,
    .pullse-chat-message-agent p {
      margin: 0;
      line-height: 1.4;
    }
    
    .pullse-chat-widget-input {
      padding: 12px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      align-items: flex-end;
      background-color: white;
    }
    
    .pullse-chat-input {
      flex: 1;
      border: 1px solid #e0e0e0;
      border-radius: 18px;
      padding: 8px 12px;
      font-family: inherit;
      resize: none;
      max-height: 120px;
      outline: none;
    }
    
    .pullse-chat-input:focus {
      border-color: hsl(265, 89%, 60%);
    }
    
    .pullse-chat-send {
      background: transparent;
      border: none;
      color: hsl(265, 89%, 60%);
      padding: 8px;
      margin-left: 8px;
      cursor: pointer;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .pullse-chat-send:hover {
      background-color: #f0f0f0;
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .pullse-chat-widget-panel {
        background-color: #1f1f1f;
      }
      
      .pullse-chat-widget-messages {
        background-color: #121212;
      }
      
      .pullse-chat-message-agent {
        background-color: #2a2a2a;
        color: #e0e0e0;
      }
      
      .pullse-chat-input {
        background-color: #2a2a2a;
        border-color: #444;
        color: #e0e0e0;
      }
      
      .pullse-chat-widget-input {
        background-color: #1f1f1f;
        border-top-color: #333;
      }
    }
    
    /* Responsive design */
    @media (max-width: 480px) {
      .pullse-chat-widget-panel {
        width: calc(100% - 40px);
        bottom: 80px;
      }
    }
  `;
  
  document.head.appendChild(style);
  
  // Report successful init
  console.log(`Chat widget loaded for workspace: ${workspaceId}`);
})();
