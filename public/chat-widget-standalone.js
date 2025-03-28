
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
  panel.className = 'pullse-chat-widget-main';
  panel.style.display = 'none';
  container.appendChild(panel);

  // Current view state
  let currentView = 'home'; // 'home' or 'messages'
  let currentConversation = null;
  let messages = [];
  
  // Render the appropriate view
  const renderView = () => {
    if (currentView === 'home') {
      renderHomeView();
    } else if (currentView === 'messages') {
      if (currentConversation) {
        renderConversationView();
      } else {
        renderMessagesListView();
      }
    }
  };
  
  // Render home view
  const renderHomeView = () => {
    panel.innerHTML = `
      <div class="flex flex-col h-full">
        <!-- Header with logo -->
        <div class="pt-6 pb-4 px-6 text-white">
          <div class="bg-white/10 w-10 h-10 rounded-md flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="8" y1="7" x2="16" y2="7" stroke="black" strokeWidth="2" />
              <line x1="8" y1="12" x2="16" y2="12" stroke="black" strokeWidth="2" />
              <line x1="8" y1="17" x2="16" y2="17" stroke="black" strokeWidth="2" />
            </svg>
          </div>
          <h1 class="text-2xl text-gray-400 font-light mb-1">Hello there.</h1>
          <h2 class="text-3xl font-medium">How can we help?</h2>
        </div>

        <!-- Content area -->
        <div class="flex-1 px-4 pb-4 overflow-y-auto space-y-4">
          <!-- Recent message -->
          <div class="bg-white rounded-xl p-4 shadow-sm">
            <h3 class="font-medium mb-2">Recent message</h3>
            <div class="flex items-center space-x-3 cursor-pointer" id="recent-message">
              <div class="bg-black rounded-md p-2 flex-shrink-0">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="8" y1="7" x2="16" y2="7" stroke="black" strokeWidth="2" />
                  <line x1="8" y1="12" x2="16" y2="12" stroke="black" strokeWidth="2" />
                  <line x1="8" y1="17" x2="16" y2="17" stroke="black" strokeWidth="2" />
                </svg>
              </div>
              <div class="flex-grow">
                <p class="text-black">can you explain copilot to me</p>
                <p class="text-gray-500 text-sm">Fin · 1d ago</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          <!-- Ask a question -->
          <button class="bg-white rounded-xl p-4 w-full flex items-center justify-between hover:bg-gray-50 transition-colors" id="ask-question">
            <span class="font-medium">Ask a question</span>
            <div class="flex items-center">
              <div class="bg-black rounded-md p-1 mr-1">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="8" y1="7" x2="16" y2="7" stroke="black" strokeWidth="2" />
                  <line x1="8" y1="12" x2="16" y2="12" stroke="black" strokeWidth="2" />
                  <line x1="8" y1="17" x2="16" y2="17" stroke="black" strokeWidth="2" />
                </svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </button>

          <!-- Service report card -->
          <div class="bg-black text-white p-3 rounded-xl relative overflow-hidden">
            <div class="uppercase font-bold">
              <div>THE 2025</div>
              <div>CUSTOMER SERVICE</div>
              <div>TRANSFORMATION</div>
              <div>REPORT</div>
            </div>
            <div class="mt-8 text-xs text-gray-400 uppercase">
              <div>CUSTOMER SERVICE TRENDS</div>
              <div>AS WE DIVE INTO 2025</div>
            </div>
            <!-- Logo in corner -->
            <div class="absolute top-3 right-3 bg-white/10 rounded-md p-1">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="8" y1="7" x2="16" y2="7" stroke="black" strokeWidth="2" />
                <line x1="8" y1="12" x2="16" y2="12" stroke="black" strokeWidth="2" />
                <line x1="8" y1="17" x2="16" y2="17" stroke="black" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="pullse-chat-nav">
          <div class="pullse-chat-nav-item active">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Home</span>
          </div>
          <div class="pullse-chat-nav-item" id="nav-messages">
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span class="pullse-chat-badge">1</span>
            </div>
            <span>Messages</span>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    document.getElementById('recent-message')?.addEventListener('click', () => {
      currentView = 'messages';
      currentConversation = 'recent';
      renderView();
    });

    document.getElementById('ask-question')?.addEventListener('click', () => {
      currentView = 'messages';
      currentConversation = 'new';
      messages = [];
      renderView();
    });

    document.getElementById('nav-messages')?.addEventListener('click', () => {
      currentView = 'messages';
      currentConversation = null;
      renderView();
    });
  };

  // Render messages list view
  const renderMessagesListView = () => {
    panel.innerHTML = `
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="border-b border-gray-800 p-4">
          <h2 class="text-xl font-semibold">Messages</h2>
        </div>

        <!-- Conversation list -->
        <div class="flex-1 overflow-y-auto">
          <div class="divide-y divide-gray-800">
            <button class="w-full px-4 py-3 flex items-start hover:bg-gray-900 transition-colors" id="conversation-recent">
              <div class="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mr-3 flex-shrink-0">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="8" y1="7" x2="16" y2="7" stroke="black" strokeWidth="2" />
                  <line x1="8" y1="12" x2="16" y2="12" stroke="black" strokeWidth="2" />
                  <line x1="8" y1="17" x2="16" y2="17" stroke="black" strokeWidth="2" />
                </svg>
              </div>
              <div class="text-left">
                <h3 class="font-medium text-white">Copilot explanation</h3>
                <p class="text-gray-400 text-sm truncate">
                  can you explain copilot to me
                </p>
              </div>
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <div class="pullse-chat-nav">
          <div class="pullse-chat-nav-item" id="nav-home">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Home</span>
          </div>
          <div class="pullse-chat-nav-item active">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>Messages</span>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    document.getElementById('conversation-recent')?.addEventListener('click', () => {
      currentConversation = 'recent';
      renderView();
    });

    document.getElementById('nav-home')?.addEventListener('click', () => {
      currentView = 'home';
      renderView();
    });
  };

  // Render conversation view
  const renderConversationView = () => {
    // Initialize messages if empty
    if (messages.length === 0 && currentConversation === 'recent') {
      messages = [
        { id: 1, sender: 'user', text: 'can you explain copilot to me', time: '1d ago' },
        { id: 2, sender: 'agent', text: 'GitHub Copilot is an AI-powered code completion tool that helps developers write code faster and with fewer errors. It suggests code snippets based on comments and existing code, supporting many programming languages. Would you like to know more about specific features?', time: '1d ago' }
      ];
    } else if (messages.length === 0 && currentConversation === 'new') {
      messages = [];
    }

    const messagesHtml = messages.map(msg => {
      const isUser = msg.sender === 'user';
      return `
        <div class="flex ${isUser ? 'justify-end' : 'justify-start'} mb-4">
          <div class="${isUser ? 'bg-primary text-white' : 'bg-gray-700 text-white'} px-3 py-2 rounded-lg ${isUser ? 'rounded-br-none' : 'rounded-bl-none'} max-w-[80%]">
            <div>${msg.text}</div>
            <div class="text-xs mt-1 ${isUser ? 'text-white/70' : 'text-gray-400'}">${msg.time || 'Just now'}</div>
          </div>
        </div>
      `;
    }).join('');

    panel.innerHTML = `
      <div class="flex flex-col h-full">
        <!-- Conversation header -->
        <div class="border-b border-gray-800 p-3 flex items-center">
          <button id="back-to-messages" class="p-1 mr-2 rounded-full hover:bg-gray-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h2 class="font-medium truncate">
            ${currentConversation === 'recent' ? 'Copilot explanation' : 'New conversation'}
          </h2>
        </div>
        
        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-4" id="messages-container">
          ${messagesHtml}
        </div>
        
        <!-- Message input -->
        <div class="border-t border-gray-800 p-3 bg-black">
          <div class="flex items-end space-x-2">
            <textarea id="message-input" placeholder="Type a message..." class="flex-1 resize-none border border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary min-h-[40px] max-h-32 bg-gray-900 text-white"></textarea>
            <button id="send-button" class="p-2 rounded-full bg-primary text-white hover:bg-primary/90">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <div class="pullse-chat-nav">
          <div class="pullse-chat-nav-item" id="nav-home-from-convo">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Home</span>
          </div>
          <div class="pullse-chat-nav-item active">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>Messages</span>
          </div>
        </div>
      </div>
    `;

    // Scroll to bottom of messages
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Add event listeners
    document.getElementById('back-to-messages')?.addEventListener('click', () => {
      currentConversation = null;
      renderView();
    });

    document.getElementById('nav-home-from-convo')?.addEventListener('click', () => {
      currentView = 'home';
      renderView();
    });

    document.getElementById('send-button')?.addEventListener('click', sendMessage);
    
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
      messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
    }
  };

  // Send message function
  const sendMessage = () => {
    const messageInput = document.getElementById('message-input') as HTMLTextAreaElement;
    const text = messageInput?.value?.trim();
    
    if (!text) return;
    
    // Add user message
    messages.push({
      id: Date.now(),
      sender: 'user',
      text: text,
      time: 'Just now'
    });
    
    // Clear input
    messageInput.value = '';
    
    // Re-render view with new message
    renderView();
    
    // Simulate agent response after a delay
    setTimeout(() => {
      messages.push({
        id: Date.now() + 1,
        sender: 'agent',
        text: `Thanks for your message! I'll help you with "${text}". Is there anything specific you'd like to know?`,
        time: 'Just now'
      });
      
      renderView();
    }, 1000);
  };

  // Add event listeners
  button.addEventListener('click', function() {
    panel.style.display = 'flex';
    button.style.display = 'none';
    renderView();
  });
  
  // Initialize widget
  console.log(`Chat widget loaded for workspace: ${workspaceId}`);
})();
