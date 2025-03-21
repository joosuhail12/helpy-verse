
import React, { useState, useEffect } from 'react';
import { X, Minimize2, MessageSquare, Home } from 'lucide-react';
import ChatHome from './ChatHome';
import ConversationList from './ConversationList';
import NewChat from './NewChat';

type WidgetPage = 'home' | 'conversations' | 'new-chat';

/**
 * Main container component for the embeddable chat widget
 */
const ChatWidgetContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<WidgetPage>('home');
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    // Initialize Ably connection when widget is opened
    if (isOpen && !minimized) {
      console.log('Initializing Ably connection for chat widget');
      // This would be replaced with actual Ably initialization
    }

    return () => {
      // Clean up Ably connection when widget is closed
      if (!isOpen) {
        console.log('Cleaning up Ably connection for chat widget');
      }
    };
  }, [isOpen, minimized]);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    setMinimized(false);
  };

  const minimizeWidget = () => {
    setMinimized(true);
  };

  const navigateTo = (page: WidgetPage) => {
    setCurrentPage(page);
    setMinimized(false);
  };

  // Render the launcher button when widget is closed or minimized
  if (!isOpen || minimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <button 
          onClick={toggleWidget}
          className="bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary/90 transition-all"
          aria-label="Open chat widget"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col bg-white rounded-lg shadow-xl overflow-hidden" style={{ width: '350px', maxHeight: '500px' }}>
      {/* Widget header */}
      <div className="bg-primary text-white p-3 flex justify-between items-center">
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
            onClick={toggleWidget}
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

export default ChatWidgetContainer;
