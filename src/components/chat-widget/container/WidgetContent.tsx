
import React from 'react';
import ChatHome from '../ChatHome';
import ConversationList from '../ConversationList';
import NewChat from '../NewChat';
import ConversationView from '../components/conversation/ConversationView';
import { WidgetContentProps } from './types';

/**
 * Main content component for the chat widget
 */
const WidgetContent: React.FC<WidgetContentProps> = ({
  currentPage,
  currentConversationId,
  navigateTo,
  handleSelectConversation,
  handleConversationCreated
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {currentPage === 'home' && (
        <ChatHome onNewChat={() => navigateTo('new-chat')} />
      )}
      
      {currentPage === 'conversations' && (
        <ConversationList 
          onNewChat={() => navigateTo('new-chat')} 
          onSelectConversation={handleSelectConversation}
        />
      )}
      
      {currentPage === 'new-chat' && (
        <NewChat onConversationCreated={handleConversationCreated} />
      )}
      
      {currentPage === 'conversation-detail' && currentConversationId && (
        <ConversationView 
          conversationId={currentConversationId} 
          onBack={() => navigateTo('conversations')}
        />
      )}
    </div>
  );
};

export default WidgetContent;
