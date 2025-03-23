
import React, { useState, useEffect, KeyboardEvent } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { ChatMessage } from './types';

interface EnhancedConversationViewProps {
  workspaceId: string;
  conversationId: string;
  agentName?: string;
}

const EnhancedConversationView: React.FC<EnhancedConversationViewProps> = ({ 
  workspaceId, 
  conversationId,
  agentName = 'Agent'
}) => {
  const { sendMessage, getMessages, loadingMessages } = useChat();
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Load messages for this conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (conversationId) {
        const conversationMessages = await getMessages(conversationId);
        setMessages(conversationMessages);
      }
    };

    fetchMessages();
  }, [conversationId, getMessages]);

  // Simulate typing indicator after user sends a message
  useEffect(() => {
    if (isSending) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setIsSending(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSending]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    
    setIsSending(true);
    
    // Add user message to UI immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: messageText,
      timestamp: new Date(),
      conversationId
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    try {
      await sendMessage(conversationId, messageText);
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsSending(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList conversationId={conversationId} />
        {isTyping && <TypingIndicator agentName={agentName} />}
      </div>
      
      <MessageInput
        onSendMessage={handleSendMessage}
        isDisabled={isSending || loadingMessages}
      />
    </div>
  );
};

export default EnhancedConversationView;
