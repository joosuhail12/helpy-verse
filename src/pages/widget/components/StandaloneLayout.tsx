
import React from 'react';
import { WidgetPage } from '@/components/chat-widget/container/types';
import StandaloneHeader from './StandaloneHeader';
import StandaloneContent from './StandaloneContent';
import StandaloneNavigation from './StandaloneNavigation';
import ResponseTime from '@/components/chat-widget/components/ResponseTime';

interface StandaloneLayoutProps {
  currentPage: WidgetPage;
  currentConversationId: string | null;
  navigateTo: (page: WidgetPage) => void;
  handleSelectConversation: (conversationId: string) => void;
  handleConversationCreated: (conversationId?: string) => void;
  closeWidget: () => void;
  workspaceId: string;
}

/**
 * Layout component for standalone widget mode
 */
const StandaloneLayout: React.FC<StandaloneLayoutProps> = ({
  currentPage,
  currentConversationId,
  navigateTo,
  handleSelectConversation,
  handleConversationCreated,
  closeWidget,
  workspaceId
}) => {
  // Check if we should show the navigation bar
  const shouldShowNavBar = currentPage !== 'conversation-detail';

  // Check if we should show the brand footer
  const shouldShowFooter = currentPage !== 'conversation-detail';

  return (
    <div className="flex flex-col h-screen bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <StandaloneHeader 
        currentPage={currentPage} 
        navigateTo={navigateTo} 
        closeWidget={closeWidget} 
      />

      {/* Widget content */}
      <div className="flex-1 overflow-y-auto">
        <StandaloneContent 
          currentPage={currentPage}
          currentConversationId={currentConversationId}
          navigateTo={navigateTo}
          handleSelectConversation={handleSelectConversation}
          handleConversationCreated={handleConversationCreated}
          workspaceId={workspaceId}
        />
      </div>

      {/* Only show navigation when not in conversation detail */}
      {shouldShowNavBar && (
        <StandaloneNavigation 
          currentPage={currentPage} 
          navigateTo={navigateTo} 
        />
      )}

      {/* Brand footer - only show when not in conversation detail */}
      {shouldShowFooter && <ResponseTime />}
    </div>
  );
};

export default StandaloneLayout;
