
import { useState, useEffect, useCallback } from 'react';
import { useAbly } from '@/context/AblyContext';
import { getAblyChannel } from '@/utils/ably';

interface TypingUser {
  clientId: string;
  name?: string;
  timestamp?: number;
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

    let channel: any;
    let startCallback: any;
    let stopCallback: any;
    let cleanupInterval: NodeJS.Timeout;
    
    const setupSubscription = async () => {
      try {
        channel = await getAblyChannel(`chat:typing:${conversationId}`);
        
        // Subscribe to typing:start events
        startCallback = (message: any) => {
          const user = message.data as TypingUser;
          // Only add if it's not the current user and not already in the list
          if (user.clientId !== clientId) {
            setTypingUsers(prev => {
              if (prev.some(u => u.clientId === user.clientId)) return prev;
              return [...prev, {...user, timestamp: Date.now()}];
            });
          }
        };
        
        // Subscribe to typing:stop events
        stopCallback = (message: any) => {
          const userId = message.data.clientId;
          if (userId !== clientId) {
            setTypingUsers(prev => prev.filter(user => user.clientId !== userId));
          }
        };
        
        channel.subscribe('typing:start', startCallback);
        channel.subscribe('typing:stop', stopCallback);
        
        // Setup automatic cleanup after timeout
        cleanupInterval = setInterval(() => {
          setTypingUsers(prev => {
            // Remove typing indicators older than 5 seconds
            const fiveSecondsAgo = Date.now() - 5000;
            return prev.filter(user => 
              (user.timestamp || 0) > fiveSecondsAgo
            );
          });
        }, 1000);
      } catch (error) {
        console.error('Error setting up typing indicator subscription:', error);
      }
    };
    
    setupSubscription();
    
    return () => {
      if (channel) {
        if (startCallback) channel.unsubscribe('typing:start', startCallback);
        if (stopCallback) channel.unsubscribe('typing:stop', stopCallback);
      }
      if (cleanupInterval) clearInterval(cleanupInterval);
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
