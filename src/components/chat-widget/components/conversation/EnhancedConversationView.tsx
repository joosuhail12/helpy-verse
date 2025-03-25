
import React, { useState, useEffect, useRef } from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { ChatMessage } from './types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { v4 as uuidv4 } from 'uuid';

interface EnhancedConversationViewProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  agentName?: string;
  isTyping?: boolean;
  isDisabled?: boolean;
}

const EnhancedConversationView: React.FC<EnhancedConversationViewProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
  agentName,
  isTyping = false,
  isDisabled = false
}) => {
  const { colors } = useThemeContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (content: string) => {
    onSendMessage(content);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: colors.background, color: colors.foreground }}>
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
        
        {isTyping && (
          <TypingIndicator users={[]} agentName={agentName} />
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        isDisabled={isDisabled || isLoading}
      />
    </div>
  );
};

export default EnhancedConversationView;
