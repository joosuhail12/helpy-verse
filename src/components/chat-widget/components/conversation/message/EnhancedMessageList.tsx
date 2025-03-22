
import React, { useEffect, useRef } from 'react';
import EnhancedMessageItem from './EnhancedMessageItem';
import { useIsMobile } from '@/hooks/use-mobile';

interface EnhancedMessageListProps {
  messages: {
    id: string;
    text?: string;
    sender: string;
    timestamp: string;
    status?: string;
  }[];
  loading?: boolean;
  hasMore?: boolean;
  loadMore?: () => void;
  currentUserId?: string;
}

/**
 * Enhanced and responsive message list component
 */
const EnhancedMessageList: React.FC<EnhancedMessageListProps> = ({
  messages,
  loading = false,
  hasMore = false,
  loadMore,
  currentUserId = 'user'
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevMessageLength = useRef<number>(0);
  const isMobile = useIsMobile();
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    // Only auto-scroll if messages were added (not on initial load or infinite scroll)
    if (messages.length > prevMessageLength.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    
    prevMessageLength.current = messages.length;
  }, [messages.length]);
  
  // Handle scroll for loading more messages
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (container && hasMore && !loading) {
        // Load more when scrolled near the top
        if (container.scrollTop < 50) {
          loadMore?.();
        }
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [hasMore, loading, loadMore]);
  
  return (
    <div 
      className="flex flex-col p-2 md:p-4 space-y-4 overflow-y-auto" 
      style={{ maxHeight: '100%' }}
      ref={containerRef}
    >
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-2">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
      
      {/* Empty state */}
      {!loading && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full py-8 px-4 text-center text-gray-500">
          <p className={isMobile ? "text-sm" : "text-base"}>No messages yet.</p>
          <p className="text-xs mt-1">Start the conversation by sending a message below.</p>
        </div>
      )}
      
      {/* Messages */}
      {messages.map((message, index) => (
        <EnhancedMessageItem
          key={message.id}
          message={message}
          isCurrentUser={message.sender === currentUserId || message.sender === 'user'}
          previousMessage={index > 0 ? messages[index - 1] : undefined}
          nextMessage={index < messages.length - 1 ? messages[index + 1] : undefined}
          isMobile={isMobile}
        />
      ))}
      
      {/* Invisible element to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default EnhancedMessageList;
