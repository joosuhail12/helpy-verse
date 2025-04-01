
import { useState, useEffect, useCallback } from 'react';
import { useAbly } from '@/context/AblyContext';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';

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

    // Use on() instead of subscribe()
    const subscription = channel.on('message', (message: any) => {
      if (options?.onMessage) {
        options.onMessage(message.data);
      }
    });

    setIsSubscribed(true);

    return () => {
      channel.off(subscription); // Use off() instead of unsubscribe()
      setIsSubscribed(false);
    };
  }, [conversationId, workspaceId, ably, options]);

  const publishMessage = useCallback(
    async (message: ChatMessage) => {
      if (!conversationId || !workspaceId || !ably.client) return;

      const channelName = `chat:${workspaceId}:${conversationId}`;
      const channel = ably.getChannel(channelName);

      // Use channel.publish directly
      await channel.publish('message', message);
    },
    [conversationId, workspaceId, ably]
  );

  return {
    isSubscribed,
    publishMessage
  };
};
