
import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, UseChatOptions } from '@/components/chat-widget/components/conversation/types';

export const useChat = (options?: UseChatOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const conversationId = options?.conversationId || '';

  // Load messages
  useEffect(() => {
    if (!conversationId) return;
    
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, we would fetch messages from an API or local storage
        // For now, we'll just mock this with empty data
        const mockMessages: ChatMessage[] = [];
        setMessages(mockMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [conversationId]);

  // Send a message
  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!content.trim() || !conversationId) return;
    
    // Create a new message
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      conversationId,
      status: 'sending'
    };
    
    // Add to messages
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate message being sent
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'sent' } 
            : msg
        )
      );
      
      // Simulate an agent response
      setTimeout(() => {
        const responseMessage: ChatMessage = {
          id: `msg-${Date.now()}-response`,
          content: `Thanks for your message. This is a simulated response to: "${content}"`,
          sender: 'agent',
          timestamp: new Date().toISOString(),
          conversationId,
          status: 'delivered'
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
