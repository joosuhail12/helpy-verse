
import React from 'react';
import ChatHome from '@/components/chat-widget/ChatHome';
import ConversationList from '@/components/chat-widget/ConversationList';
import NewChat from '@/components/chat-widget/NewChat';
import ConversationView from '@/components/chat-widget/components/conversation/ConversationView';
import { WidgetPage } from '@/components/chat-widget/container/types';

interface StandaloneContentProps {
  currentPage: WidgetPage;
  currentConversationId: string | null;
  navigateTo: (page: WidgetPage) => void;
  handleSelectConversation: (conversationId: string) => void;
  handleConversationCreated: (conversationId?: string) => void;
  workspaceId: string;
}

/**
 * Content component for standalone widget mode
 */
const StandaloneContent: React.FC<StandaloneContentProps> = ({
  currentPage,
  currentConversationId,
  navigateTo,
  handleSelectConversation,
  handleConversationCreated,
  workspaceId
}) => {
  switch (currentPage) {
    case 'home':
      return (
        <ChatHome 
          onNewChat={() => navigateTo('new-chat')}
          workspaceId={workspaceId}
        />
      );
    
    case 'conversations':
      return (
        <ConversationList 
          onNewChat={() => navigateTo('new-chat')} 
          onSelectConversation={handleSelectConversation}
          workspaceId={workspaceId}
        />
      );
    
    case 'new-chat':
      return (
        <NewChat 
          onConversationCreated={handleConversationCreated}
          workspaceId={workspaceId}
        />
      );
    
    case 'conversation-detail':
      if (!currentConversationId) {
        return (
          <div className="flex-1 flex items-center justify-center p-4">
            <p className="text-gray-500">No conversation selected</p>
          </div>
        );
      }
      
      return (
        <ConversationView 
          conversationId={currentConversationId} 
          onBack={() => navigateTo('conversations')}
          workspaceId={workspaceId}
        />
      );
    
    default:
      return (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-gray-500">Unknown page</p>
        </div>
      );
  }
};

export default StandaloneContent;
