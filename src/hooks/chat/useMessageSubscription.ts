
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

    // Subscribe to messages using the correct Ably event format
    const callbackHandler = (message: Ably.Types.Message) => {
      if (options?.onMessage) {
        options.onMessage(message.data);
      }
    };

    // Use the correct event name format for Ably
    channel.subscribe('message', callbackHandler);
    setIsSubscribed(true);

    return () => {
      channel.unsubscribe('message', callbackHandler);
      setIsSubscribed(false);
    };
  }, [conversationId, workspaceId, ably, options]);

  const publishMessage = useCallback(
    async (message: ChatMessage) => {
      if (!conversationId || !workspaceId || !ably.client) return;

      const channelName = `chat:${workspaceId}:${conversationId}`;
      const channel = ably.getChannel(channelName);

      try {
        // Use the correct publish method with name and data
        await channel.publish('message', message);
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
