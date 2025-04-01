
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

  // Custom event name for typing indicators
  const TYPING_EVENT = 'typing' as Ably.Types.ChannelEvent;

  const sendTypingIndicator = useCallback(
    (isTyping: boolean, userName?: string) => {
      if (!conversationId || !ably.client) return;

      const channelName = `typing:${conversationId}`;
      const channel = ably.getChannel(channelName);

      setIsUserTyping(isTyping);

      try {
        // Use ts-expect-error since we know the method exists at runtime
        // @ts-expect-error: Using channel.publish which exists at runtime
        channel.publish(TYPING_EVENT, { 
          isTyping, 
          clientId: ably.clientId,
          name: userName || 'User',
          timestamp: Date.now() 
        }, (err) => {
          if (err) {
            console.error('Error publishing typing indicator:', err);
          }
        });
      } catch (error) {
        console.error('Error publishing typing indicator:', error);
      }
    },
    [conversationId, ably, TYPING_EVENT]
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

    // Use appropriate method for Ably subscriptions
    channel.subscribe(TYPING_EVENT, typingHandler);

    return () => {
      // Clean up subscription
      channel.unsubscribe(TYPING_EVENT, typingHandler);
    };
  }, [conversationId, ably, TYPING_EVENT]);

  return {
    typingUsers,
    sendTypingIndicator,
    isUserTyping
  };
};
