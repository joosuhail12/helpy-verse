
import React, { useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChatMessage, TypingUser } from './types';
import TypingIndicator from './TypingIndicator';
import MessageItem from './MessageItem';
import { Loader2 } from 'lucide-react';

export interface MessageListProps {
  messages: ChatMessage[];
  conversationId?: string;
  isLoading?: boolean;
  useVirtualization?: boolean;
  showReadReceipts?: boolean;
  encrypted?: boolean;
  typingUsers?: TypingUser[];
  showReactions?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  conversationId,
  isLoading = false,
  useVirtualization = false,
  showReadReceipts = false,
  encrypted = false,
  typingUsers = [],
  showReactions = false
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingUsers]);
  
  // Virtual list for performance with large message lists
  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Estimate height of each message
    overscan: 5, // Number of items to render before and after visible items
  });
  
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center text-gray-500">
        <p>No messages yet</p>
        <p className="text-sm mt-1">Start the conversation by typing a message below</p>
      </div>
    );
  }
  
  // Render using virtualization for better performance with large lists
  if (useVirtualization) {
    return (
      <div 
        ref={parentRef} 
        className="flex-1 overflow-y-auto py-4 px-3"
      >
        <div 
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const message = messages[virtualRow.index];
            return (
              <div
                key={virtualRow.index}
                id={`message-${virtualRow.index}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <MessageItem 
                  message={message}
                  encrypted={encrypted}
                  showReadReceipt={showReadReceipts}
                  showReactions={showReactions}
                />
              </div>
            );
          })}
        </div>
        
        {typingUsers && typingUsers.length > 0 && (
          <div className="p-2">
            <TypingIndicator typingUsers={typingUsers} />
          </div>
        )}
        
        <div ref={endRef} />
      </div>
    );
  }
  
  // Regular rendering for smaller message lists
  return (
    <div className="flex-1 overflow-y-auto py-4 px-3" ref={parentRef}>
      {messages.map((message, index) => (
        <div id={`message-${index}`} key={message.id || index}>
          <MessageItem 
            message={message}
            encrypted={encrypted}
            showReadReceipt={showReadReceipts}
            showReactions={showReactions}
          />
        </div>
      ))}
      
      {typingUsers && typingUsers.length > 0 && (
        <div className="p-2">
          <TypingIndicator typingUsers={typingUsers} />
        </div>
      )}
      
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;
