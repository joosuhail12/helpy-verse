
import React, { useState, useEffect } from 'react';
import { X, Minimize2, MessageSquare, Home, MessageCircle, ArrowLeft } from 'lucide-react';
import ChatHome from './ChatHome';
import ConversationList from './ConversationList';
import NewChat from './NewChat';
import ResponseTime from './components/ResponseTime';
import ConversationView from './components/conversation/ConversationView';

type WidgetPage = 'home' | 'conversations' | 'new-chat' | 'conversation-detail';

/**
 * Main container component for the embeddable chat widget
 */
const ChatWidgetContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<WidgetPage>('home');
  const [minimized, setMinimized] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

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
    
    // Clear current conversation when navigating away from detail
    if (page !== 'conversation-detail') {
      setCurrentConversationId(null);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    setCurrentPage('conversation-detail');
  };

  const handleConversationCreated = (conversationId?: string) => {
    if (conversationId) {
      handleSelectConversation(conversationId);
    } else {
      navigateTo('conversations');
    }
  };

  // Render the launcher button when widget is closed or minimized
  if (!isOpen || minimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <button 
          onClick={toggleWidget}
          className="bg-[#5DCFCF] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 focus:outline-none"
          aria-label="Open chat widget"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>
    );
  }

  // Render header based on current page
  const renderHeader = () => {
    if (currentPage === 'home') {
      return (
        <div className="absolute top-4 left-4 z-10">
          <div className="w-8 h-8 bg-black/20 rounded-full"></div>
        </div>
      );
    }
    
    if (currentPage === 'conversations') {
      return (
        <div className="bg-white p-4 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={() => navigateTo('home')} className="text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="font-semibold">Messages</h2>
          </div>
          <button onClick={toggleWidget} className="text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
      );
    }
    
    if (currentPage === 'conversation-detail') {
      return (
        <div className="bg-white p-4 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={() => navigateTo('conversations')} className="text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="font-semibold">Conversation</h2>
          </div>
          <button onClick={toggleWidget} className="text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div 
      className="fixed bottom-5 right-5 z-50 flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden" 
      style={{ 
        width: '340px', 
        height: '550px', 
        maxHeight: 'calc(100vh - 40px)'
      }}
    >
      {/* Header */}
      {renderHeader()}

      {/* Widget content */}
      <div className="flex-1 overflow-y-auto">
        {currentPage === 'home' && <ChatHome onNewChat={() => navigateTo('new-chat')} />}
        {currentPage === 'conversations' && (
          <ConversationList 
            onNewChat={() => navigateTo('new-chat')} 
            onSelectConversation={handleSelectConversation}
          />
        )}
        {currentPage === 'new-chat' && (
          <NewChat onConversationCreated={handleConversationCreated} />
        )}
        {currentPage === 'conversation-detail' && currentConversationId && (
          <ConversationView 
            conversationId={currentConversationId} 
          />
        )}
      </div>

      {/* Modern widget navigation */}
      <div className="border-t border-gray-100 py-3 px-6 bg-white flex justify-around items-center">
        <button 
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center gap-1 ${currentPage === 'home' 
            ? 'text-[#5DCFCF]' 
            : 'text-gray-500'}`}
          aria-label="Home"
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </button>
        
        <button 
          onClick={() => navigateTo('conversations')}
          className={`flex flex-col items-center gap-1 ${
            (currentPage === 'conversations' || currentPage === 'conversation-detail')
              ? 'text-[#5DCFCF]' 
              : 'text-gray-500'
          }`}
          aria-label="Messages"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs">Messages</span>
        </button>
      </div>

      {/* Brand footer - only including it once at the bottom */}
      <ResponseTime />
    </div>
  );
};

export default ChatWidgetContainer;
