
import { useState, useEffect, useCallback } from 'react';
import { useChannel } from '@ably-labs/react-hooks';

// Define message type
export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
  };
  timestamp: number;
  metadata?: Record<string, any>;
}

// Hook for subscribing to messages
export const useMessageSubscription = (channelId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use Ably channel
  const { channel } = useChannel(channelId, (message) => {
    if (message.name === 'message') {
      setMessages((prev) => [...prev, message.data as ChatMessage]);
    }
  });
  
  // Load message history
  useEffect(() => {
    const loadMessageHistory = async () => {
      setIsLoading(true);
      try {
        // Simulate loading message history (replace with actual implementation)
        const messageHistory: ChatMessage[] = [];
        setMessages(messageHistory);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load message history'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessageHistory();
  }, [channelId]);
  
  // Send message
  const sendMessage = useCallback(async (content: string, metadata?: Record<string, any>) => {
    if (!channel) return false;
    
    try {
      const newMessage: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        sender: {
          id: 'current-user-id', // Replace with actual user ID
          name: 'Current User', // Replace with actual user name
        },
        timestamp: Date.now(),
        metadata,
      };
      
      // Publish message to channel (handle failure case)
      console.log('Publishing message to channel', channelId, newMessage);
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      return false;
    }
  }, [channel, channelId]);
  
  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
};

export default useMessageSubscription;
