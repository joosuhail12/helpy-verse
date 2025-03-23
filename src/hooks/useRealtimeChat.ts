
import { useEffect, useState } from 'react';
import { useAbly } from '@ably-labs/react-hooks';
import { Types } from 'ably';

export const useRealtimeChat = (
  channelId: string,
  userId: string
) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const ably = useAbly();

  useEffect(() => {
    if (!channelId || !ably) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const channel = ably.channels.get(`chat:${channelId}`);
      
      // Load message history
      channel.history((err, resultPage) => {
        if (err) {
          setError(new Error('Failed to load message history'));
          setIsLoading(false);
          return;
        }
        
        const historyMessages = resultPage?.items || [];
        setMessages(historyMessages.map(msg => msg.data).reverse());
        setIsLoading(false);
      });
      
      // Subscribe to new messages
      const subscription = channel.subscribe('message', (message: Types.Message) => {
        setMessages(prev => [...prev, message.data]);
      });
      
      // Cleanup
      return () => {
        subscription.unsubscribe();
        channel.detach();
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsLoading(false);
    }
  }, [channelId, ably]);

  // Send message function
  const sendMessage = (content: string) => {
    if (!channelId || !ably) {
      return Promise.reject(new Error('Cannot send message - not connected'));
    }
    
    const channel = ably.channels.get(`chat:${channelId}`);
    return channel.publish('message', { 
      content, 
      userId, 
      timestamp: new Date().toISOString() 
    });
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage
  };
};
