
import React, { useState, useEffect } from 'react';
import ResponseTime from './components/ResponseTime';
import WidgetHeader from './container/WidgetHeader';
import WidgetContent from './container/WidgetContent';
import NavigationBar from './container/NavigationBar';
import WidgetLauncher from './container/WidgetLauncher';
import { WidgetPage } from './container/types';

/**
 * Main container component for the embeddable chat widget
 * Styled with Intercom-inspired design
 */
const ChatWidgetContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<WidgetPage>('home');
  const [minimized, setMinimized] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string>('6c22b22f-7bdf-43db-b7c1-9c5884125c63');

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

  // Always render the launcher button
  const renderLauncher = () => (
    <WidgetLauncher toggleWidget={toggleWidget} isOpen={isOpen} />
  );

  // If widget is minimized, only show the launcher
  if (!isOpen || minimized) {
    return renderLauncher();
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
    <>
      {/* Always show launcher */}
      {renderLauncher()}
      
      {/* Widget container */}
      <div 
        className="fixed bottom-5 right-5 z-40 flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden" 
        style={{ 
          width: '340px', 
          height: '570px', 
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
          workspaceId={workspaceId}
        />

        {/* Only show navigation when appropriate */}
        {shouldShowNavBar() && (
          <NavigationBar currentPage={currentPage} navigateTo={navigateTo} />
        )}

        {/* Brand footer - only including it once at the bottom */}
        {shouldShowFooter() && <ResponseTime />}
      </div>
    </>
  );
};

export default ChatWidgetContainer;
