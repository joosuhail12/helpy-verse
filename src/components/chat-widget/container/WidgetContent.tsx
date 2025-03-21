
import React from 'react';
import ChatHome from '../ChatHome';
import ConversationList from '../ConversationList';
import NewChat from '../NewChat';
import ConversationView from '../components/conversation/ConversationView';
import { WidgetContentProps } from './types';

/**
 * Content container for the different widget pages
 */
const WidgetContent: React.FC<WidgetContentProps> = ({
  currentPage,
  currentConversationId,
  navigateTo,
  handleSelectConversation,
  handleConversationCreated,
  workspaceId
}) => {
  // Render content based on current page
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

export default WidgetContent;
