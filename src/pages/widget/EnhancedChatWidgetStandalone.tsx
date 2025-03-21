
import React from 'react';
import { ThemeProvider } from '@/components/chat-widget/theme/ThemeContext';
import useWidgetOptions from './hooks/useWidgetOptions';
import useStandaloneNavigation from './hooks/useStandaloneNavigation';
import StandaloneLayout from './components/StandaloneLayout';
import EnhancedStandaloneContent from './components/EnhancedStandaloneContent';

/**
 * Enhanced standalone page for the chat widget with improved features
 */
const EnhancedChatWidgetStandalone = () => {
  const { options, themeConfig } = useWidgetOptions();
  const {
    currentPage,
    currentConversationId,
    navigateTo,
    handleSelectConversation,
    handleConversationCreated,
    closeWidget
  } = useStandaloneNavigation();

  return (
    <ThemeProvider initialTheme={themeConfig}>
      <StandaloneLayout
        currentPage={currentPage}
        currentConversationId={currentConversationId}
        navigateTo={navigateTo}
        handleSelectConversation={handleSelectConversation}
        handleConversationCreated={handleConversationCreated}
        closeWidget={closeWidget}
        workspaceId={options.workspaceId}
        content={
          <EnhancedStandaloneContent
            currentPage={currentPage}
            currentConversationId={currentConversationId}
            navigateTo={navigateTo}
            handleSelectConversation={handleSelectConversation}
            handleConversationCreated={handleConversationCreated}
            workspaceId={options.workspaceId}
          />
        }
      />
    </ThemeProvider>
  );
};

export default EnhancedChatWidgetStandalone;
