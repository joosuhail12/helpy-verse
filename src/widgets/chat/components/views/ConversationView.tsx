
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import MessageList from '../message/MessageList';
import MessageInput from '../input/MessageInput';
import ChatHeader from '../header/ChatHeader';

interface ConversationViewProps {
  onBack: () => void;
  onClose: () => void;
  workspaceId: string;
  conversationId: string;
  instanceId?: string;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  onBack,
  onClose,
  workspaceId,
  conversationId,
  instanceId = 'default'
}) => {
  const chatContext = useChat();
  const { sendMessage, loadMessages, messages, loadingMessages } = chatContext || {
    sendMessage: async () => {},
    loadMessages: async () => {},
    messages: [],
    loadingMessages: false
  };
  
  const { colors, features } = useThemeContext();
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loadConversation = async () => {
      if (loadMessages) {
        await loadMessages(conversationId);
        setIsLoading(false);
      }
    };
    
    loadConversation();
  }, [conversationId, loadMessages]);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async (content: string) => {
    if (sendMessage) {
      await sendMessage(conversationId, content);
      
      // Trigger message sent event for external callbacks
      window.dispatchEvent(new CustomEvent(`chat-message-sent-${instanceId}`, {
        detail: { message: { content } }
      }));
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        title="Conversation" 
        onBack={onBack} 
        onClose={onClose} 
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList 
          messages={messages} 
          isLoading={isLoading || loadingMessages} 
        />
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-border">
        <MessageInput 
          onSendMessage={handleSendMessage} 
          enableFileAttachments={features?.fileAttachments}
        />
      </div>
    </div>
  );
};

export default ConversationView;
