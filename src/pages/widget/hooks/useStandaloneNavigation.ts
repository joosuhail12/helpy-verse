
import { useState } from 'react';
import { WidgetPage } from '@/components/chat-widget/container/types';

/**
 * Custom hook for widget navigation in standalone mode
 */
export const useStandaloneNavigation = () => {
  const [currentPage, setCurrentPage] = useState<WidgetPage>('home');
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const navigateTo = (page: WidgetPage) => {
    setCurrentPage(page);
    
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

  const closeWidget = () => {
    // Send message to parent window to close the widget
    if (window.parent) {
      window.parent.postMessage({
        type: 'PULLSE_CLOSE_WIDGET'
      }, '*');
    }
  };

  return {
    currentPage,
    currentConversationId,
    navigateTo,
    handleSelectConversation,
    handleConversationCreated,
    closeWidget
  };
};

export default useStandaloneNavigation;
