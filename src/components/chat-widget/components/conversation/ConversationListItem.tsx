
import React from 'react';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  status: 'resolved' | 'ongoing';
  date: string;
}

interface ConversationListItemProps {
  conversation: Conversation;
}

/**
 * Individual conversation item in the list
 */
const ConversationListItem = ({ conversation }: ConversationListItemProps) => {
  return (
    <div 
      key={conversation.id}
      className="border-b border-gray-100 cursor-pointer"
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900">
            {conversation.title}
          </h3>
          <div className={`text-xs px-3 py-1 rounded-full font-medium ${
            conversation.status === 'resolved' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {conversation.status === 'resolved' ? 'Resolved' : 'Ongoing'}
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {conversation.timestamp}
        </div>
      </div>
    </div>
  );
};

export default ConversationListItem;
