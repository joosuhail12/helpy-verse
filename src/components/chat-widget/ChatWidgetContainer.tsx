
import React, { useState, useEffect } from 'react';
import { X, Minimize2, MessageSquare, Home, Send } from 'lucide-react';
import ChatHome from './ChatHome';
import ConversationList from './ConversationList';
import NewChat from './NewChat';
import { Button } from '@/components/ui/button';

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
          className="bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2"
          aria-label="Open chat widget"
        >
          <MessageSquare className="h-6 w-6" />
          {minimized && <span className="font-medium pr-1">Continue Chat</span>}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100" 
         style={{ width: '380px', height: '600px', maxHeight: 'calc(100vh - 40px)' }}>
      {/* Widget header */}
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <h3 className="font-semibold text-lg">Customer Support</h3>
        <div className="flex gap-2">
          <button 
            onClick={minimizeWidget} 
            className="text-white/90 hover:text-white hover:bg-primary-foreground/10 p-1.5 rounded-full transition-colors"
            aria-label="Minimize chat"
          >
            <Minimize2 className="h-5 w-5" />
          </button>
          <button 
            onClick={toggleWidget}
            className="text-white/90 hover:text-white hover:bg-primary-foreground/10 p-1.5 rounded-full transition-colors"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Widget content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {currentPage === 'home' && <ChatHome onNewChat={() => navigateTo('new-chat')} />}
        {currentPage === 'conversations' && <ConversationList onNewChat={() => navigateTo('new-chat')} />}
        {currentPage === 'new-chat' && <NewChat onConversationCreated={() => navigateTo('conversations')} />}
      </div>

      {/* Widget navigation */}
      <div className="border-t border-gray-200 p-3 bg-white flex justify-between items-center">
        <div className="flex gap-3">
          <button 
            onClick={() => navigateTo('home')}
            className={`p-2 rounded-lg transition-colors ${currentPage === 'home' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
            aria-label="Home"
          >
            <Home className="h-5 w-5" />
          </button>
          <button 
            onClick={() => navigateTo('conversations')}
            className={`p-2 rounded-lg transition-colors ${currentPage === 'conversations' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`}
            aria-label="Conversations"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        </div>
        <Button 
          onClick={() => navigateTo('new-chat')}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm"
          size="sm"
        >
          <span>New Chat</span>
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Powered by footer */}
      <div className="bg-gray-900 text-white text-xs py-2 text-center">
        Powered by Pullse
      </div>
    </div>
  );
};

export default ChatWidgetContainer;
