
import { useEffect, useState, useCallback } from 'react';
import { useAbly } from '@/context/AblyContext';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';

interface MessageSubscriptionOptions {
  onMessage?: (message: ChatMessage) => void;
}

export const useMessageSubscription = (
  conversationId: string, 
  workspaceId: string,
  options: MessageSubscriptionOptions = {}
) => {
  const { client, getChannelName } = useAbly();
  const [channel, setChannel] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  // Initialize channel
  useEffect(() => {
    if (!client) return;
    
    const channelName = getChannelName(conversationId);
    const channelInstance = client.channels.get(channelName);
    
    setChannel({ channel: channelInstance });
    
    return () => {
      client.channels.release(channelName);
    };
  }, [client, conversationId, getChannelName]);

  // Subscribe to messages
  useEffect(() => {
    if (!channel || !channel.channel) return;
    
    const handleMessage = (message: any) => {
      const messageData = message.data as ChatMessage;
      
      if (options.onMessage) {
        options.onMessage(messageData);
      }
    };
    
    // Subscribe to messages
    const sub = channel.channel.subscribe('message', handleMessage);
    setSubscription(sub);
    setIsSubscribed(true);
    
    return () => {
      // Check if subscription exists before calling unsubscribe
      if (sub && typeof sub.unsubscribe === 'function') {
        sub.unsubscribe();
      }
      setIsSubscribed(false);
    };
  }, [channel, options]);

  // Function to manually publish a message
  const publishMessage = useCallback(
    async (message: ChatMessage): Promise<boolean> => {
      if (!channel || !channel.channel) return false;
      
      try {
        await channel.channel.publish('message', message);
        return true;
      } catch (error) {
        console.error('Error publishing message:', error);
        return false;
      }
    },
    [channel]
  );

  return {
    isSubscribed,
    publishMessage
  };
};
