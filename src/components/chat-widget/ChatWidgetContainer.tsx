
import React, { useState, useEffect } from 'react';
import ResponseTime from './components/ResponseTime';
import WidgetHeader from './container/WidgetHeader';
import WidgetContent from './container/WidgetContent';
import NavigationBar from './container/NavigationBar';
import WidgetLauncher from './container/WidgetLauncher';
import { WidgetPage } from './container/types';

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
    return <WidgetLauncher toggleWidget={toggleWidget} />;
  }

  // Check if we should show the navigation bar
  const shouldShowNavBar = () => {
    return currentPage !== 'conversation-detail';
  };

  // Check if we should show the brand footer
  const shouldShowFooter = () => {
    return currentPage !== 'conversation-detail';
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
      {/* Widget header */}
      <WidgetHeader 
        currentPage={currentPage} 
        navigateTo={navigateTo} 
        toggleWidget={toggleWidget} 
      />

      {/* Widget content */}
      <WidgetContent 
        currentPage={currentPage}
        currentConversationId={currentConversationId}
        navigateTo={navigateTo}
        handleSelectConversation={handleSelectConversation}
        handleConversationCreated={handleConversationCreated}
      />

      {/* Only show navigation when appropriate */}
      {shouldShowNavBar() && (
        <NavigationBar currentPage={currentPage} navigateTo={navigateTo} />
      )}

      {/* Brand footer - only including it once at the bottom */}
      {shouldShowFooter() && <ResponseTime />}
    </div>
  );
};

export default ChatWidgetContainer;
