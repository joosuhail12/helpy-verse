import React, { useState, useEffect, useRef } from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { ChatMessage } from './types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { useTypingIndicator } from '@/hooks/chat/useTypingIndicator';
import { v4 as uuidv4 } from 'uuid';

interface ResponsiveConversationViewProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  agentName?: string;
  conversationId: string;
}

const ResponsiveConversationView: React.FC<ResponsiveConversationViewProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
  agentName,
  conversationId
}) => {
  const { colors } = useThemeContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { typingUsers, startTyping } = useTypingIndicator(conversationId);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(messages);

  // Update local messages when prop changes
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [localMessages, typingUsers]);

  const handleSendMessage = (content: string) => {
    // Create a temporary local message
    const tempMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      content,
      timestamp: new Date(),
      conversationId,
    };

    // Add to local state immediately for UI responsiveness
    setLocalMessages(prev => [...prev, tempMessage]);
    
    // Send to parent component for processing
    onSendMessage(content);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: colors.background, color: colors.foreground }}>
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={localMessages} />
        
        {(typingUsers.length > 0 || agentName) && (
          <TypingIndicator 
            users={typingUsers} 
            agentName={isLoading ? agentName : undefined} 
          />
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        onTyping={startTyping}
        isDisabled={isLoading}
      />
    </div>
  );
};

export default ResponsiveConversationView;
