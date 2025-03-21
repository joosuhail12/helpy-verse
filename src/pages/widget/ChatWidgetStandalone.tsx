
import React, { useEffect, useState } from 'react';
import ChatHome from '@/components/chat-widget/ChatHome';
import ConversationList from '@/components/chat-widget/ConversationList';
import NewChat from '@/components/chat-widget/NewChat';
import ResponseTime from '@/components/chat-widget/components/ResponseTime';
import { X, ArrowLeft, Search, Home, MessageSquare } from 'lucide-react';

type WidgetPage = 'home' | 'conversations' | 'new-chat';

/**
 * Standalone page for the chat widget, used for direct embedding in iframe
 */
const ChatWidgetStandalone = () => {
  const [currentPage, setCurrentPage] = useState<WidgetPage>('home');
  const [options, setOptions] = useState({
    primaryColor: '#5DCFCF',
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

  const navigateTo = (page: WidgetPage) => {
    setCurrentPage(page);
  };

  // Conversation list header
  const renderHeader = () => {
    if (currentPage === 'home') {
      return (
        <div className="absolute top-4 left-4">
          <div className="w-8 h-8 bg-black/20 rounded-full"></div>
        </div>
      );
    }
    
    if (currentPage === 'conversations') {
      return (
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo('home')} 
              className="text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="font-semibold">Messages</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-gray-700">
              <Search className="h-5 w-5" />
            </button>
            <button onClick={closeWidget} className="text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="flex flex-col h-screen bg-white rounded-lg overflow-hidden">
      {/* Header */}
      {renderHeader()}

      {/* Widget content */}
      <div className="flex-1 overflow-y-auto">
        {currentPage === 'home' && <ChatHome onNewChat={() => navigateTo('new-chat')} />}
        {currentPage === 'conversations' && <ConversationList onNewChat={() => navigateTo('new-chat')} />}
        {currentPage === 'new-chat' && <NewChat onConversationCreated={() => navigateTo('conversations')} />}
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
          className={`flex flex-col items-center gap-1 ${currentPage === 'conversations' 
            ? 'text-[#5DCFCF]' 
            : 'text-gray-500'}`}
          aria-label="Messages"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs">Messages</span>
        </button>
      </div>

      {/* Brand footer - only include it once at the bottom */}
      <ResponseTime />
    </div>
  );
};

export default ChatWidgetStandalone;
