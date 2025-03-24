
import { useState, useEffect, useCallback } from 'react';
import { useAbly } from '@/context/AblyContext';
import { getAblyChannel } from '@/utils/ably';

interface TypingUser {
  clientId: string;
  name?: string;
}

export const useTypingIndicator = (
  conversationId: string,
  userName?: string
) => {
  const { client, clientId } = useAbly();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  
  // Subscribe to typing indicators
  useEffect(() => {
    if (!client || !conversationId) return;

    let subscriptionCleanup: (() => void) | null = null;
    
    const setupSubscription = async () => {
      try {
        const channel = await getAblyChannel(`chat:typing:${conversationId}`);
        
        // Subscribe to typing:start events
        const startCallback = (message: any) => {
          const user = message.data as TypingUser;
          // Only add if it's not the current user and not already in the list
          if (user.clientId !== clientId) {
            setTypingUsers(prev => {
              if (prev.some(u => u.clientId === user.clientId)) return prev;
              return [...prev, user];
            });
          }
        };
        
        // Subscribe to typing:stop events
        const stopCallback = (message: any) => {
          const userId = message.data.clientId;
          if (userId !== clientId) {
            setTypingUsers(prev => prev.filter(user => user.clientId !== userId));
          }
        };
        
        channel.subscribe('typing:start', startCallback);
        channel.subscribe('typing:stop', stopCallback);
        
        // Setup automatic cleanup after timeout
        const cleanupInterval = setInterval(() => {
          setTypingUsers(prev => {
            // Remove typing indicators older than 5 seconds
            const fiveSecondsAgo = Date.now() - 5000;
            return prev.filter(user => 
              (user.timestamp as unknown as number || 0) > fiveSecondsAgo
            );
          });
        }, 1000);
        
        subscriptionCleanup = () => {
          channel.unsubscribe('typing:start', startCallback);
          channel.unsubscribe('typing:stop', stopCallback);
          clearInterval(cleanupInterval);
        };
      } catch (error) {
        console.error('Error setting up typing indicator subscription:', error);
      }
    };
    
    setupSubscription();
    
    return () => {
      if (subscriptionCleanup) {
        subscriptionCleanup();
      }
    };
  }, [client, clientId, conversationId]);

  // Report this user is typing
  const startTyping = useCallback(async () => {
    if (!client || !conversationId) return;
    
    try {
      const channel = await getAblyChannel(`chat:typing:${conversationId}`);
      
      await channel.publish('typing:start', {
        clientId,
        name: userName || 'User',
        timestamp: Date.now()
      });
      
      // Automatically stop typing after 3 seconds
      setTimeout(async () => {
        await channel.publish('typing:stop', { clientId });
      }, 3000);
    } catch (error) {
      console.error('Error publishing typing indicator:', error);
    }
  }, [client, clientId, conversationId, userName]);

  return {
    typingUsers,
    startTyping
  };
};
