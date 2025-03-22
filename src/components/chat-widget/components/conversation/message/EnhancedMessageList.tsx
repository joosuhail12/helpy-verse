
import React from 'react';
import { Message } from '../types';
import EnhancedMessageItem from './EnhancedMessageItem';

interface EnhancedMessageListProps {
  messages: Message[];
  loading: boolean;
  hasMore?: boolean;
  loadMore?: () => void;
  currentUserId?: string;
  onReact?: (messageId: string, emoji: string) => void;
}

/**
 * Component to render a list of messages with enhanced features
 */
const EnhancedMessageList: React.FC<EnhancedMessageListProps> = ({
  messages,
  loading,
  hasMore = false,
  loadMore,
  currentUserId = 'user',
  onReact
}) => {
  // Group messages by date
  const groupMessagesByDate = (msgs: Message[]) => {
    const groups: { [date: string]: Message[] } = {};
    
    msgs.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };
  
  const messageGroups = groupMessagesByDate(messages);
  
  // Formatter for timestamps
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timestamp;
    }
  };
  
  if (loading && messages.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="loader animate-pulse flex space-x-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Load more button */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-white text-sm text-gray-500 px-4 py-2 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {loading ? 'Loading...' : 'Load earlier messages'}
          </button>
        </div>
      )}
      
      {/* Messages grouped by date */}
      {Object.entries(messageGroups).map(([date, dateMessages]) => (
        <div key={date} className="space-y-4">
          {/* Date header */}
          <div className="flex justify-center">
            <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
              {new Date(date).toLocaleDateString(undefined, { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
          
          {/* Messages for this date */}
          <div className="space-y-3">
            {dateMessages.map((message, index) => (
              <EnhancedMessageItem
                key={message.id}
                message={message}
                isCurrentUser={message.sender === 'user'}
                previousMessage={index > 0 ? dateMessages[index - 1] : undefined}
                nextMessage={index < dateMessages.length - 1 ? dateMessages[index + 1] : undefined}
                onReact={onReact}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EnhancedMessageList;
