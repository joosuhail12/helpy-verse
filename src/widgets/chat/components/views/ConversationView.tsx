
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
  const { 
    sendMessage, 
    getMessages,
    loading: loadingMessages 
  } = chatContext || {
    sendMessage: async () => {},
    getMessages: () => [],
    loading: false
  };
  
  const { colors, features } = useThemeContext();
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loadConversation = async () => {
      try {
        // If getMessages exists, use it
        if (getMessages) {
          const conversationMessages = await getMessages(conversationId);
          setMessages(conversationMessages || []);
        } else {
          // Fallback for mock data
          setMessages([{
            id: '1',
            content: 'Hello! How can I help you today?',
            sender: 'agent',
            timestamp: new Date().toISOString(),
            conversationId
          }]);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConversation();
  }, [conversationId, getMessages]);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async (content: string) => {
    if (sendMessage) {
      // Optimistically add the user message
      const newUserMessage = {
        id: `temp-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: new Date().toISOString(),
        conversationId
      };
      
      setMessages(prev => [...prev, newUserMessage]);
      
      // Send the message
      await sendMessage(conversationId, content);
      
      // Trigger message sent event for external callbacks
      window.dispatchEvent(new CustomEvent(`chat-message-sent-${instanceId}`, {
        detail: { message: { content } }
      }));
      
      // Refresh messages
      if (getMessages) {
        const updatedMessages = await getMessages(conversationId);
        setMessages(updatedMessages || []);
      } else {
        // Add mock response
        setTimeout(() => {
          const agentResponse = {
            id: `response-${Date.now()}`,
            content: `Thank you for your message: "${content}". How else can I help?`,
            sender: 'agent',
            timestamp: new Date().toISOString(),
            conversationId
          };
          
          setMessages(prev => [...prev, agentResponse]);
        }, 1000);
      }
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
