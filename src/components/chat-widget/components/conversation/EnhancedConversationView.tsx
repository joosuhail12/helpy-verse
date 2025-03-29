
import React, { useState, useEffect, useRef, memo } from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { ChatMessage } from './types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { useStableCallback } from '@/utils/performance/reactOptimizations';
import { useRenderTime } from '@/hooks/usePerformanceOptimization';

// Memoize child components for better performance
const MemoizedMessageList = memo(MessageList);
const MemoizedTypingIndicator = memo(TypingIndicator);
const MemoizedMessageInput = memo(MessageInput);

interface EnhancedConversationViewProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  agentName?: string;
  isTyping?: boolean;
  disabled?: boolean;
  hasActiveConversation?: boolean;
}

const EnhancedConversationView: React.FC<EnhancedConversationViewProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
  agentName,
  isTyping = false,
  disabled = false,
  hasActiveConversation = false
}) => {
  // Track render time in development
  useRenderTime('EnhancedConversationView');
  
  const { colors } = useThemeContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Create a stable callback for sending messages
  const handleSendMessage = useStableCallback((content: string) => {
    onSendMessage(content);
  }, [onSendMessage]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Memoize the placeholder based on conversation state
  const inputPlaceholder = hasActiveConversation 
    ? "Type a message..." 
    : "Start a new conversation...";

  return (
    <div className="flex flex-col h-full" style={{ background: colors.background, color: colors.foreground }}>
      <div className="flex-1 overflow-y-auto p-4">
        <MemoizedMessageList messages={messages} />
        
        {isTyping && (
          <MemoizedTypingIndicator users={[]} agentName={agentName} />
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <MemoizedMessageInput 
        onSendMessage={handleSendMessage}
        disabled={disabled || isLoading}
        placeholder={inputPlaceholder}
      />
    </div>
  );
};

// Export a memoized version of the component
export default memo(EnhancedConversationView);
