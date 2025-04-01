
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

    // Subscribe to messages using the Ably on method
    const callbackHandler = (message: Ably.Types.Message) => {
      if (options?.onMessage) {
        options.onMessage(message.data);
      }
    };

    // Using proper Ably on/off methods for event subscription
    channel.on('message', callbackHandler);
    setIsSubscribed(true);

    return () => {
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
        // Properly type the publish method with a Promise
        await new Promise<void>((resolve, reject) => {
          // @ts-expect-error: Using channel.publish which exists at runtime
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
