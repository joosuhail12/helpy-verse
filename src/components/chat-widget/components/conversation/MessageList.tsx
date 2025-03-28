
import React, { useEffect, useRef, useState } from 'react';
import MessageItem from './MessageItem';
import MessageSearch from './MessageSearch';
import { ChatMessage } from './types';
import { Search, ArrowDown } from 'lucide-react';

interface MessageListProps {
  messages: ChatMessage[];
  conversationId?: string;
  showAvatars?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages,
  conversationId,
  showAvatars = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Record<string, HTMLDivElement>>({});
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Function to handle manual scrolling
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    // Update auto-scroll state based on user scroll position
    if (isNearBottom !== isAutoScrollEnabled) {
      setIsAutoScrollEnabled(isNearBottom);
    }
    
    // Show/hide scroll button based on position
    setShowScrollButton(!isNearBottom);
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setIsAutoScrollEnabled(true);
    }
  };

  useEffect(() => {
    // Auto-scroll to bottom when new messages come in, if enabled
    if (messagesEndRef.current && isAutoScrollEnabled) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (!isAutoScrollEnabled && messages.length > 0) {
      // Show scroll button when new messages arrive but auto-scroll is disabled
      setShowScrollButton(true);
    }
  }, [messages, isAutoScrollEnabled]);

  // Group messages by sender and consecutive time (within 2 minutes)
  const groupedMessages = messages.reduce((groups: ChatMessage[][], message, index) => {
    // Start a new group if this is the first message
    if (index === 0) {
      return [[message]];
    }

    const lastGroup = groups[groups.length - 1];
    const lastMessage = lastGroup[lastGroup.length - 1];
    
    // Conditions for grouping messages together:
    // 1. Same sender
    // 2. Time difference less than 2 minutes (120,000 ms)
    const sameUser = lastMessage.sender === message.sender;
    
    // Fixed timestamp handling to properly handle string or Date objects
    const getTimestampMs = (timestamp: string | Date): number => {
      return typeof timestamp === 'string' 
        ? new Date(timestamp).getTime() 
        : timestamp.getTime();
    };
    
    const timeDiff = getTimestampMs(message.timestamp) - getTimestampMs(lastMessage.timestamp);
    const closeInTime = timeDiff < 120000; // 2 minutes
    
    if (sameUser && closeInTime) {
      // Add to existing group
      lastGroup.push(message);
    } else {
      // Start new group
      groups.push([message]);
    }
    
    return groups;
  }, []);

  const scrollToMessage = (messageId: string) => {
    if (messageRefs.current[messageId]) {
      messageRefs.current[messageId].scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Highlight the message temporarily
      messageRefs.current[messageId].classList.add('bg-yellow-100', 'transition-colors');
      setTimeout(() => {
        messageRefs.current[messageId]?.classList.remove('bg-yellow-100');
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {showSearch && (
        <MessageSearch
          messages={messages}
          onResultSelect={scrollToMessage}
          onClose={() => setShowSearch(false)}
        />
      )}
      
      <div 
        className="flex-1 overflow-y-auto"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        <div className="flex flex-col space-y-2 p-2 relative">
          {!showSearch && messages.length > 5 && (
            <button 
              onClick={() => setShowSearch(true)}
              className="absolute top-2 right-2 p-1.5 bg-white shadow-sm rounded-full hover:bg-gray-100 z-10"
            >
              <Search className="h-4 w-4 text-gray-500" />
            </button>
          )}
          
          {groupedMessages.map((group, groupIndex) => (
            <div 
              key={`group-${groupIndex}`} 
              className="message-group"
            >
              {group.map((message, messageIndex) => (
                <div 
                  key={message.id}
                  ref={el => {
                    if (el) messageRefs.current[message.id] = el;
                  }}
                >
                  <MessageItem
                    message={message}
                    showAvatar={showAvatars && messageIndex === group.length - 1}
                    isFirstInGroup={messageIndex === 0}
                    isLastInGroup={messageIndex === group.length - 1}
                  />
                </div>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button 
          onClick={scrollToBottom}
          className="absolute bottom-16 right-4 p-2 bg-primary text-white rounded-full shadow-md hover:bg-primary/90 transition-all z-10"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default MessageList;
