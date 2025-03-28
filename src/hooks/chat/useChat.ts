
import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';

interface UseChatOptions {
  conversationId: string;
  encrypted?: boolean;
}

export const useChat = ({ conversationId, encrypted = false }: UseChatOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load messages
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock messages
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          content: 'Hello! How can I help you today?',
          sender: 'agent',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          conversationId
        },
        {
          id: '2',
          content: 'I have a question about my order',
          sender: 'user',
          timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
          conversationId
        },
        {
          id: '3',
          content: 'Sure, I\'d be happy to help. Could you provide your order number?',
          sender: 'agent',
          timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
          conversationId
        }
      ];
      
      setMessages(mockMessages);
      setIsLoading(false);
    }, 500);
  }, [conversationId]);

  // Send a message
  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!content.trim()) return;
    
    // Create new message
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      conversationId,
      status: 'sending'
    };
    
    // Add message to state
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate sending to server
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
      
      // Simulate agent response
      setTimeout(() => {
        const responseMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          content: `Thank you for your message. I'm reviewing your request.`,
          sender: 'agent',
          timestamp: new Date().toISOString(),
          conversationId,
          status: 'sent'
        };
        
        setMessages(prev => [...prev, responseMessage]);
      }, 1500);
    }, 500);
  }, [conversationId]);

  return {
    messages,
    isLoading,
    sendMessage
  };
};

export default useChat;
