
import React from 'react';
import ConversationListItem from '../conversation/ConversationListItem';
import { Conversation } from './types';

interface ConversationGroupProps {
  date: string;
  conversations: Conversation[];
  onSelectConversation: (conversationId: string) => void;
}

/**
 * Group of conversations for a specific date
 */
const ConversationGroup: React.FC<ConversationGroupProps> = ({ 
  date, 
  conversations,
  onSelectConversation
}) => {
  return (
    <div key={date}>
      <div className="sticky top-0 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 border-y">
        {new Date(date).toLocaleDateString(undefined, { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
      {conversations.map(conversation => (
        <ConversationListItem
          key={conversation.id}
          conversation={conversation}
          onSelect={() => onSelectConversation(conversation.id)}
        />
      ))}
    </div>
  );
};

export default ConversationGroup;
