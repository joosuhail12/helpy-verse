
import { useState, useEffect, useCallback } from 'react';
import { useAbly } from '@/context/AblyContext';

interface TypingUser {
  clientId: string;
  name?: string;
}

export const useTypingIndicator = (conversationId: string) => {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const ably = useAbly();

  const sendTypingIndicator = useCallback(
    (isTyping: boolean) => {
      if (!conversationId) return;

      const channelName = `typing:${conversationId}`;
      const channel = ably.getChannel(channelName);

      channel.publish('typing', { 
        isTyping, 
        clientId: 'current-user',
        timestamp: Date.now() 
      });
    },
    [conversationId, ably]
  );

  useEffect(() => {
    if (!conversationId) return;

    const channelName = `typing:${conversationId}`;
    const channel = ably.getChannel(channelName);

    const subscription = channel.subscribe('typing', (message: any) => {
      const { isTyping, clientId, name, timestamp } = message.data;

      if (isTyping) {
        setTypingUsers(prev => {
          // Don't add duplicate users
          if (prev.some(user => user.clientId === clientId)) {
            return prev;
          }
          return [...prev, { clientId, name }];
        });

        // Clear typing indicator after 3 seconds
        setTimeout(() => {
          setTypingUsers(prev => 
            prev.filter(user => user.clientId !== clientId)
          );
        }, 3000);
      } else {
        setTypingUsers(prev => 
          prev.filter(user => user.clientId !== clientId)
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId, ably]);

  return {
    typingUsers,
    sendTypingIndicator
  };
};
