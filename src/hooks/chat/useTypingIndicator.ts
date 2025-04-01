
import { useState, useEffect, useCallback } from 'react';
import { useAbly } from '@/context/AblyContext';
import * as Ably from 'ably';

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
      if (!conversationId || !ably.client) return;

      const channelName = `typing:${conversationId}`;
      const channel = ably.getChannel(channelName);

      setIsUserTyping(isTyping);

      // Use the correct publish method for Ably's RealtimeChannelBase
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
    if (!conversationId || !ably.client) return;

    const channelName = `typing:${conversationId}`;
    const channel = ably.getChannel(channelName);

    // Create a named handler function for the subscription
    const typingHandler = (message: Ably.Types.Message) => {
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
    };

    // Use on() instead of subscribe() for Ably's RealtimeChannelBase
    channel.on('typing', typingHandler);

    return () => {
      channel.off('typing', typingHandler);
    };
  }, [conversationId, ably]);

  return {
    typingUsers,
    sendTypingIndicator,
    isUserTyping
  };
};
