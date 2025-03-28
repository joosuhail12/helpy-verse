
import { useState, useEffect, useCallback } from 'react';
import { useAbly } from '@/context/AblyContext';
import { TypingUser } from '@/components/chat-widget/components/conversation/types';

const TYPING_TIMEOUT = 3000; // 3 seconds

export const useTypingIndicator = (conversationId: string) => {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const ably = useAbly();

  // Send typing indicator
  const sendTypingIndicator = useCallback(async () => {
    try {
      const channelName = ably.getChannelName(`typing:${conversationId}`);
      await ably.publish(channelName, 'typing', {
        clientId: ably.clientId,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Failed to send typing indicator:', error);
    }
  }, [conversationId, ably]);

  // Subscribe to typing indicators
  useEffect(() => {
    const channelName = ably.getChannelName(`typing:${conversationId}`);
    
    const unsubscribe = ably.subscribe(channelName, 'typing', message => {
      const data = message.data;
      if (!data || data.clientId === ably.clientId) return;
      
      setTypingUsers(prev => {
        // Check if this user is already in the list
        const existing = prev.find(u => u.clientId === data.clientId);
        
        if (existing) {
          // Update the timestamp
          return prev.map(u => 
            u.clientId === data.clientId 
              ? { ...u, timestamp: data.timestamp }
              : u
          );
        } else {
          // Add new typing user
          return [...prev, {
            clientId: data.clientId,
            name: data.name || 'User',
            timestamp: data.timestamp
          }];
        }
      });
    });
    
    // Clean up typing users that haven't typed recently
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setTypingUsers(prev => 
        prev.filter(user => now - user.timestamp < TYPING_TIMEOUT)
      );
    }, 1000);
    
    return () => {
      unsubscribe();
      clearInterval(cleanupInterval);
    };
  }, [conversationId, ably]);

  return {
    typingUsers,
    sendTypingIndicator
  };
};

export default useTypingIndicator;
