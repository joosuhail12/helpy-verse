
import React from 'react';
import ConversationEmptyState from './components/conversation-list/ConversationEmptyState';
import NewConversationButton from './components/conversation-list/NewConversationButton';
import ConversationListItem from './components/conversation/ConversationListItem';
import { useConversations } from './components/conversation-list/hooks/useConversations';

interface ConversationListProps {
  onNewChat: () => void;
  onSelectConversation: (conversationId: string) => void;
  workspaceId?: string;
}

/**
 * List of conversations in the chat widget
 */
const ConversationList: React.FC<ConversationListProps> = ({ 
  onNewChat, 
  onSelectConversation,
  workspaceId 
}) => {
  // Changed to use useConversations without any arguments
  const { conversations, loading } = useConversations();
  
  if (loading) {
    return (
      <div className="p-4 h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-sm">Your conversations</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-100 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (conversations.length === 0) {
    return <ConversationEmptyState onNewChat={onNewChat} />;
  }
  
  return (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-sm">Your conversations</h2>
        <NewConversationButton onNewChat={onNewChat} />
      </div>
      
      <div className="space-y-2">
        {conversations.map(conversation => (
          <ConversationListItem 
            key={conversation.id}
            conversation={conversation}
            onSelect={() => onSelectConversation(conversation.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
