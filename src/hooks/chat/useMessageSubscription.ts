
import { useState, useEffect, useCallback } from 'react';
import { useAbly } from '@/context/AblyContext';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';
import * as Ably from 'ably';

interface MessageSubscriptionOptions {
  onMessage?: (message: ChatMessage) => void;
}

export const useMessageSubscription = (
  conversationId: string,
  workspaceId: string,
  options?: MessageSubscriptionOptions
) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const ably = useAbly();

  useEffect(() => {
    if (!conversationId || !workspaceId || !ably.client) return;

    const channelName = `chat:${workspaceId}:${conversationId}`;
    const channel = ably.getChannel(channelName);

    // Subscribe to messages using the on method (not subscribe)
    const callbackHandler = (message: Ably.Types.Message) => {
      if (options?.onMessage) {
        options.onMessage(message.data);
      }
    };

    // Use the on method with the correct event type
    channel.on('message', callbackHandler);
    setIsSubscribed(true);

    return () => {
      // Use off instead of unsubscribe
      channel.off('message', callbackHandler);
      setIsSubscribed(false);
    };
  }, [conversationId, workspaceId, ably, options]);

  const publishMessage = useCallback(
    async (message: ChatMessage) => {
      if (!conversationId || !workspaceId || !ably.client) return;

      const channelName = `chat:${workspaceId}:${conversationId}`;
      const channel = ably.getChannel(channelName);

      try {
        // Use the publishAsync method to return a promise
        await new Promise<void>((resolve, reject) => {
          channel.publish('message', message, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      } catch (error) {
        console.error('Error publishing message:', error);
      }
    },
    [conversationId, workspaceId, ably]
  );

  return {
    isSubscribed,
    publishMessage
  };
};
