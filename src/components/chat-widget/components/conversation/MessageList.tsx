
import React, { useRef, useState, useEffect } from 'react';
import { ChatMessage, TypingUser, MessageListProps } from './types';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import { useVirtualizer } from '@tanstack/react-virtual';

const MessageList: React.FC<MessageListProps> = ({
  messages = [],
  conversationId,
  isLoading = false,
  encrypted = false,
  showAvatars = true,
  showReactions = false,
  showReadReceipts = false,
  useVirtualization = false,
  typingUsers = []
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(true);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  
  // Set up virtualization if enabled
  const rowVirtualizer = useVirtualization ? useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimate height of each message
    overscan: 5
  }) : null;
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0 && scrolledToBottom) {
      setTimeout(() => {
        if (parentRef.current) {
          parentRef.current.scrollTop = parentRef.current.scrollHeight;
        }
      }, 100);
    } else if (messages.length > 0 && !scrolledToBottom) {
      setHasNewMessage(true);
    }
  }, [messages.length, scrolledToBottom]);
  
  // Handle scroll events to track if we're at the bottom
  const handleScroll = () => {
    if (parentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = parentRef.current;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 20;
      setScrolledToBottom(isBottom);
      
      if (isBottom && hasNewMessage) {
        setHasNewMessage(false);
      }
    }
  };
  
  // Scroll to bottom function
  const scrollToBottom = () => {
    if (parentRef.current) {
      parentRef.current.scrollTop = parentRef.current.scrollHeight;
      setScrolledToBottom(true);
      setHasNewMessage(false);
    }
  };
  
  // Render content based on virtualization setting
  const renderMessages = () => {
    if (useVirtualization && rowVirtualizer) {
      return (
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
            width: '100%',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const message = messages[virtualItem.index];
            return (
              <div
                key={message.id}
                data-index={virtualItem.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <MessageItem
                  message={message}
                  encrypted={encrypted}
                  showReactions={showReactions}
                  showReadReceipt={showReadReceipts}
                />
              </div>
            );
          })}
          
          {typingUsers.length > 0 && scrolledToBottom && (
            <div className="pt-1 pb-2">
              <TypingIndicator typingUsers={typingUsers} />
            </div>
          )}
        </div>
      );
    }
    
    return (
      <>
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            encrypted={encrypted}
            showReactions={showReactions}
            showReadReceipt={showReadReceipts}
          />
        ))}
        
        {typingUsers.length > 0 && scrolledToBottom && (
          <div className="pt-1 pb-2">
            <TypingIndicator typingUsers={typingUsers} />
          </div>
        )}
      </>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="animate-pulse flex flex-col space-y-4 w-full">
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div
      ref={parentRef}
      onScroll={handleScroll}
      className="flex flex-col h-full overflow-y-auto p-4 space-y-4"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          No messages yet. Start a conversation!
        </div>
      ) : (
        renderMessages()
      )}
      
      {hasNewMessage && !scrolledToBottom && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 right-4 bg-primary text-white rounded-full p-2 shadow-lg"
        >
          ↓ New messages
        </button>
      )}
    </div>
  );
};

export default MessageList;
