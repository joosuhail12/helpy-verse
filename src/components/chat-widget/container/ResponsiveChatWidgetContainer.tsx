
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import ResponseTime from '../components/ResponseTime';
import WidgetHeader from './WidgetHeader';
import WidgetContent from './WidgetContent';
import NavigationBar from './NavigationBar';
import WidgetLauncher from './WidgetLauncher';
import ResponsiveConversationView from '../components/conversation/ResponsiveConversationView';
import { WidgetPage } from './types';
import { ThemeProvider, ThemeConfig } from '../theme/ThemeContext';

interface ResponsiveChatWidgetContainerProps {
  workspaceId?: string;
  themeConfig?: Partial<ThemeConfig>;
}

/**
 * Enhanced responsive chat widget container with offline support
 */
const ResponsiveChatWidgetContainer: React.FC<ResponsiveChatWidgetContainerProps> = ({ 
  workspaceId = '6c22b22f-7bdf-43db-b7c1-9c5884125c63',
  themeConfig = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<WidgetPage>('home');
  const [minimized, setMinimized] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
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

  // If widget is minimized, only show the launcher
  if (!isOpen || minimized) {
    return (
      <ThemeProvider initialTheme={themeConfig}>
        <WidgetLauncher toggleWidget={toggleWidget} isOpen={false} />
      </ThemeProvider>
    );
  }

  // Check if we should show the navigation bar
  const shouldShowNavBar = () => {
    return currentPage !== 'conversation-detail';
  };

  // Check if we should show the brand footer
  const shouldShowFooter = () => {
    return currentPage !== 'conversation-detail';
  };

  // Calculate responsive dimensions
  const getWidgetDimensions = () => {
    if (isMobile) {
      return {
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        bottom: '0',
        right: '0',
        borderRadius: '0',
      };
    }
    
    return {
      width: '340px',
      height: '570px',
      maxHeight: 'calc(100vh - 40px)',
      bottom: '20px',
      right: '20px',
      borderRadius: '1rem',
    };
  };

  const dimensions = getWidgetDimensions();

  return (
    <ThemeProvider initialTheme={themeConfig}>
      {/* Widget container */}
      <div 
        className="fixed z-40 flex flex-col bg-white shadow-2xl overflow-hidden" 
        style={dimensions}
      >
        {/* Widget header */}
        <WidgetHeader 
          currentPage={currentPage} 
          navigateTo={navigateTo} 
          toggleWidget={toggleWidget} 
        />

        {/* Show the appropriate content based on current page */}
        {currentPage === 'conversation-detail' && currentConversationId ? (
          <ResponsiveConversationView
            conversationId={currentConversationId}
            onBack={() => navigateTo('conversations')}
            workspaceId={workspaceId}
          />
        ) : (
          <>
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
          </>
        )}
      </div>
      
      {/* Only show launcher when not in mobile view */}
      {!isMobile && (
        <WidgetLauncher toggleWidget={toggleWidget} isOpen={true} />
      )}
    </ThemeProvider>
  );
};

export default ResponsiveChatWidgetContainer;
