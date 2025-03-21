
import { useState } from 'react';
import { WidgetPage } from '../container/types';

/**
 * Custom hook for managing chat widget navigation
 */
export const useWidgetNavigation = () => {
  const [currentPage, setCurrentPage] = useState<WidgetPage>('home');
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const navigateTo = (page: WidgetPage) => {
    setCurrentPage(page);
    
    // Clear current conversation when navigating away from detail
    if (page !== 'conversation-detail') {
      setCurrentConversationId(null);
    }
  };

  const selectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    setCurrentPage('conversation-detail');
  };

  const handleConversationCreated = (conversationId?: string) => {
    if (conversationId) {
      selectConversation(conversationId);
    } else {
      navigateTo('conversations');
    }
  };

  return {
    currentPage,
    currentConversationId,
    navigateTo,
    selectConversation,
    handleConversationCreated
  };
};

export default useWidgetNavigation;
