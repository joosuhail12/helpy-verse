
import React, { useEffect, useState } from 'react';
import ChatHome from '@/components/chat-widget/ChatHome';
import ConversationList from '@/components/chat-widget/ConversationList';
import NewChat from '@/components/chat-widget/NewChat';
import { X, Minimize2, MessageSquare, Home } from 'lucide-react';

type WidgetPage = 'home' | 'conversations' | 'new-chat';

/**
 * Standalone page for the chat widget, used for direct embedding in iframe
 */
const ChatWidgetStandalone = () => {
  const [currentPage, setCurrentPage] = useState<WidgetPage>('home');
  const [options, setOptions] = useState({
    primaryColor: '#9b87f5',
    welcomeMessage: 'How can we help you today?',
    agentName: 'Support Team',
    workspaceId: ''
  });

  // Listen for options passed via postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate message origin for security in real implementation
      if (event.data && event.data.type === 'PULLSE_CHAT_OPTIONS') {
        console.log('Received widget options:', event.data.options);
        setOptions(prev => ({
          ...prev,
          ...event.data.options
        }));
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const closeWidget = () => {
    // Send message to parent window to close the widget
    if (window.parent) {
      window.parent.postMessage({
        type: 'PULLSE_CLOSE_WIDGET'
      }, '*');
    }
  };

  const minimizeWidget = () => {
    // Send message to parent window to minimize the widget
    if (window.parent) {
      window.parent.postMessage({
        type: 'PULLSE_MINIMIZE_WIDGET'
      }, '*');
    }
  };

  const navigateTo = (page: WidgetPage) => {
    setCurrentPage(page);
  };

  // Apply custom styling based on received options
  const headerStyle = {
    backgroundColor: options.primaryColor
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Widget header */}
      <div className="p-3 flex justify-between items-center text-white" style={headerStyle}>
        <h3 className="font-medium">Customer Support</h3>
        <div className="flex gap-2">
          <button 
            onClick={minimizeWidget} 
            className="text-white/80 hover:text-white"
            aria-label="Minimize chat"
          >
            <Minimize2 className="h-5 w-5" />
          </button>
          <button 
            onClick={closeWidget}
            className="text-white/80 hover:text-white"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Widget content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {currentPage === 'home' && <ChatHome onNewChat={() => navigateTo('new-chat')} />}
        {currentPage === 'conversations' && <ConversationList onNewChat={() => navigateTo('new-chat')} />}
        {currentPage === 'new-chat' && <NewChat onConversationCreated={() => navigateTo('conversations')} />}
      </div>

      {/* Widget navigation */}
      <div className="border-t border-gray-200 p-2 bg-white flex justify-between items-center">
        <div className="flex gap-1">
          <button 
            onClick={() => navigateTo('home')}
            className={`p-2 rounded-md ${currentPage === 'home' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
            aria-label="Home"
          >
            <Home className="h-5 w-5" />
          </button>
          <button 
            onClick={() => navigateTo('conversations')}
            className={`p-2 rounded-md ${currentPage === 'conversations' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
            aria-label="Conversations"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        </div>
        <button 
          onClick={() => navigateTo('new-chat')}
          className="bg-primary text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-primary/90"
          style={{ backgroundColor: options.primaryColor }}
        >
          New Chat
        </button>
      </div>

      {/* Powered by footer */}
      <div className="bg-gray-900 text-white text-xs p-1.5 text-center">
        Powered by Pullse
      </div>
    </div>
  );
};

export default ChatWidgetStandalone;
