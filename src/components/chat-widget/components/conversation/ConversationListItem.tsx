
import React from 'react';
import { MessageCircle, CheckCircle2, Clock } from 'lucide-react';

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
  onSelect: (conversationId: string) => void;
}

/**
 * Individual conversation item in the list
 */
const ConversationListItem = ({ conversation, onSelect }: ConversationListItemProps) => {
  return (
    <div 
      className={`border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
        conversation.unread ? 'bg-blue-50 hover:bg-blue-50/80' : ''
      }`}
      onClick={() => onSelect(conversation.id)}
      role="button"
      aria-label={`Open conversation: ${conversation.title}`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              conversation.status === 'resolved' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-indigo-100 text-indigo-700'
            }`}>
              {conversation.status === 'resolved' 
                ? <CheckCircle2 className="h-5 w-5" /> 
                : <MessageCircle className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <h3 className={`text-sm ${conversation.unread ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>
                {conversation.title}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                {conversation.lastMessage}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className={`text-xs px-2 py-1 rounded-full font-medium text-xs ${
              conversation.status === 'resolved' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {conversation.status === 'resolved' ? 'Resolved' : 'Ongoing'}
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {conversation.timestamp}
            </div>
            {conversation.unread && (
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationListItem;
