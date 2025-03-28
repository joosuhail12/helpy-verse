
import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage } from './types';
import MessageItem from './MessageItem';
import { Loader2, ArrowDown, Lock } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';

interface MessageListProps {
  messages: ChatMessage[];
  loading?: boolean;
  showAvatars?: boolean;
  encrypted?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  loading = false, 
  showAvatars = false,
  encrypted = false
}) => {
  const { colors } = useThemeContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (!autoScroll && messages.length > 0) {
      // If auto-scroll is disabled, increment unread count
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'agent') {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, autoScroll]);
  
  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      setShowScrollButton(!isNearBottom);
      
      // If user manually scrolled to bottom, enable auto-scroll
      if (isNearBottom && !autoScroll) {
        setAutoScroll(true);
        setUnreadCount(0);
      } 
      // If user scrolled up, disable auto-scroll
      else if (!isNearBottom && autoScroll) {
        setAutoScroll(false);
      }
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [autoScroll]);
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setAutoScroll(true);
      setUnreadCount(0);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto"
      style={{ background: colors.background }}
    >
      {/* Encryption notice at the top */}
      {encrypted && (
        <div className="flex items-center justify-center p-2 text-sm text-gray-500">
          <Lock className="h-4 w-4 mr-1" />
          <span>Messages in this conversation are end-to-end encrypted</span>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: colors.primary }} />
        </div>
      ) : messages.length === 0 ? (
        <div 
          className="flex justify-center items-center h-full text-center text-gray-500 px-6"
          style={{ color: colors.mutedForeground }}
        >
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map(message => (
          <MessageItem 
            key={message.id} 
            message={message} 
            showAvatar={showAvatars}
            encrypted={encrypted && message.encrypted}
          />
        ))
      )}
      
      {/* Hidden div for scroll targeting */}
      <div ref={messagesEndRef} />
      
      {/* Button to scroll to the bottom */}
      {showScrollButton && (
        <div className="sticky bottom-4 flex justify-center">
          <Button
            className="rounded-full shadow-lg flex items-center gap-1 px-3 py-1 h-auto"
            style={{ background: colors.primary, color: colors.primaryForeground }}
            onClick={scrollToBottom}
          >
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px]">
                {unreadCount}
              </span>
            )}
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MessageList;
