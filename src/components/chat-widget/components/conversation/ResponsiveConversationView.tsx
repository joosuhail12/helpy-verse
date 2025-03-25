
import React, { useState, useEffect, useRef } from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { ChatMessage } from './types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { useTypingIndicator } from '@/hooks/chat/useTypingIndicator';
import { useChat } from '@/hooks/chat/useChat';
import { v4 as uuidv4 } from 'uuid';

interface ResponsiveConversationViewProps {
  conversationId: string;
  workspaceId?: string;
  onBack?: () => void;
  messages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
  agentName?: string;
}

const ResponsiveConversationView: React.FC<ResponsiveConversationViewProps> = ({
  conversationId,
  workspaceId,
  onBack,
  messages: propMessages = [],
  onSendMessage: propSendMessage,
  isLoading = false,
  agentName
}) => {
  const { colors } = useThemeContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { typingUsers, startTyping } = useTypingIndicator(conversationId);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(propMessages);
  const { sendMessage, getMessages } = useChat();

  // Fetch messages if they weren't provided as props
  useEffect(() => {
    if (propMessages && propMessages.length > 0) {
      setLocalMessages(propMessages);
      return;
    }

    const fetchMessages = async () => {
      if (conversationId) {
        const fetchedMessages = await getMessages(conversationId);
        if (fetchedMessages && fetchedMessages.length > 0) {
          setLocalMessages(fetchedMessages);
        }
      }
    };
    
    fetchMessages();
  }, [conversationId, getMessages, propMessages]);

  // Update local messages when prop changes
  useEffect(() => {
    if (propMessages && propMessages.length > 0) {
      setLocalMessages(propMessages);
    }
  }, [propMessages]);

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
    
    // Use prop function if provided, otherwise use the hook's sendMessage
    if (propSendMessage) {
      propSendMessage(content);
    } else if (conversationId) {
      sendMessage(conversationId, content);
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ background: colors.background, color: colors.foreground }}>
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={localMessages} />
        
        {(typingUsers.length > 0 || isLoading) && (
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
