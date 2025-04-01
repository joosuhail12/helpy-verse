
import { useState, useEffect, useCallback } from 'react';
import { useAbly } from '@/context/AblyContext';

interface TypingUser {
  clientId: string;
  name?: string;
}

export const useTypingIndicator = (conversationId: string) => {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isUserTyping, setIsUserTyping] = useState<boolean>(false);
  const ably = useAbly();

  const sendTypingIndicator = useCallback(
    (isTyping: boolean, userName?: string) => {
      if (!conversationId) return;

      const channelName = `typing:${conversationId}`;
      const channel = ably.getChannel(channelName);

      setIsUserTyping(isTyping);

      channel.publish('typing', { 
        isTyping, 
        clientId: ably.clientId,
        name: userName || 'User',
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

      if (clientId === ably.clientId) {
        // It's our own typing indicator, just update local state
        setIsUserTyping(isTyping);
        return;
      }

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
    sendTypingIndicator,
    isUserTyping
  };
};
