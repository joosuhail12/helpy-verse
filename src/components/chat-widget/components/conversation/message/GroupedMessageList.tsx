
import React, { useMemo } from 'react';
import { Message } from '../types';
import EnhancedMessageItem from './EnhancedMessageItem';
import ConversationDateHeader from '../ConversationDateHeader';

interface GroupedMessageListProps {
  messages: Message[];
  loading: boolean;
  searchResults?: Message[];
  hasMore?: boolean;
  loadMore?: () => void;
  currentUserId?: string;
  onReact?: (messageId: string, emoji: string) => void;
}

/**
 * A message list component that groups messages by time periods for better readability
 */
const GroupedMessageList: React.FC<GroupedMessageListProps> = ({
  messages,
  loading,
  searchResults,
  hasMore = false,
  loadMore,
  currentUserId = 'user',
  onReact
}) => {
  // Group messages by time period
  const groupedMessages = useMemo(() => {
    const groups: Record<string, {
      title: string;
      messages: Message[];
    }> = {};
    
    // Use search results if available, otherwise use all messages
    const messagesToGroup = searchResults || messages;
    
    messagesToGroup.forEach(message => {
      const date = new Date(message.timestamp);
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Determine group key based on date
      let groupKey: string;
      let groupTitle: string;
      
      if (date.toDateString() === now.toDateString()) {
        groupKey = 'today';
        groupTitle = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'yesterday';
        groupTitle = 'Yesterday';
      } else {
        // If within this week
        const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff < 7) {
          // Get day of week
          const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          groupKey = `day-${date.getDay()}`;
          groupTitle = dayNames[date.getDay()];
        } else if (date.getFullYear() === now.getFullYear()) {
          // If within this year
          const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                              'July', 'August', 'September', 'October', 'November', 'December'];
          groupKey = `month-${date.getMonth()}`;
          groupTitle = `${monthNames[date.getMonth()]} ${date.getDate()}`;
        } else {
          // Different year
          groupKey = `year-${date.getFullYear()}`;
          groupTitle = date.toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
          });
        }
      }
      
      // Create group if it doesn't exist
      if (!groups[groupKey]) {
        groups[groupKey] = {
          title: groupTitle,
          messages: []
        };
      }
      
      groups[groupKey].messages.push(message);
    });
    
    // Sort groups by date (newest to oldest)
    // Convert groups object to array and sort
    return Object.entries(groups).sort((a, b) => {
      // Predefined order for today and yesterday
      if (a[0] === 'today') return -1;
      if (b[0] === 'today') return 1;
      if (a[0] === 'yesterday') return -1;
      if (b[0] === 'yesterday') return 1;
      
      // For other days, compare first message timestamp
      const aTimestamp = a[1].messages[0]?.timestamp;
      const bTimestamp = b[1].messages[0]?.timestamp;
      
      if (!aTimestamp) return 1;
      if (!bTimestamp) return -1;
      
      return new Date(bTimestamp).getTime() - new Date(aTimestamp).getTime();
    });
  }, [messages, searchResults]);
  
  if (loading && messages.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="loader animate-pulse flex space-x-2" aria-label="Loading messages">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    );
  }
  
  // Highlight when we're showing search results
  const isSearchActive = searchResults && searchResults.length > 0;
  
  return (
    <div className="space-y-4">
      {/* Search results indicator */}
      {isSearchActive && (
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md text-sm">
          Showing {searchResults.length} search results
        </div>
      )}
      
      {/* Load more button */}
      {hasMore && !isSearchActive && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-white text-sm text-gray-500 px-4 py-2 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
            aria-label="Load earlier messages"
          >
            {loading ? 'Loading...' : 'Load earlier messages'}
          </button>
        </div>
      )}
      
      {/* Grouped messages */}
      {groupedMessages.map(([groupKey, group]) => (
        <div key={groupKey} className="space-y-3">
          <ConversationDateHeader date={group.title} />
          
          <div className="space-y-3 px-4">
            {group.messages.map((message, index) => (
              <EnhancedMessageItem
                key={message.id}
                message={message}
                isCurrentUser={message.sender === currentUserId}
                previousMessage={index > 0 ? group.messages[index - 1] : undefined}
                nextMessage={index < group.messages.length - 1 ? group.messages[index + 1] : undefined}
                onReact={onReact}
                isHighlighted={isSearchActive}
              />
            ))}
          </div>
        </div>
      ))}
      
      {messages.length === 0 && !loading && (
        <div className="flex justify-center items-center p-4 text-gray-500">
          No messages to display
        </div>
      )}
    </div>
  );
};

export default GroupedMessageList;
