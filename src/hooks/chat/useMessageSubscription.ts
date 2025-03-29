
import { useCallback, useEffect } from 'react';
import { useAbly } from '@/context/AblyContext';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';

interface MessageSubscriptionOptions {
  onMessage?: (message: ChatMessage) => void;
  onPresence?: (presence: any) => void;
  onTyping?: (typing: { userId: string; username: string; isTyping: boolean }) => void;
}

/**
 * Hook for subscribing to Ably channel messages
 */
export const useMessageSubscription = (
  conversationId: string,
  workspaceId: string,
  options: MessageSubscriptionOptions = {}
) => {
  const { client, isConnected } = useAbly();

  // Function to publish a message to the channel
  const publishMessage = useCallback(
    async (message: ChatMessage) => {
      if (!client || !isConnected) {
        console.warn('Cannot publish message: Not connected to Ably');
        return false;
      }

      try {
        // In a real implementation, we would use Ably to publish the message
        // For now, just simulate a successful message sending
        console.log('Simulated publishing message:', message);
        
        // If there's an onMessage callback, call it as if the message was received back
        setTimeout(() => {
          options.onMessage?.(message);
        }, 100);
        
        return true;
      } catch (error) {
        console.error('Error publishing message:', error);
        return false;
      }
    },
    [client, isConnected, options]
  );

  // Function to publish typing status
  const publishTypingStatus = useCallback(
    (userId: string, username: string, isTyping: boolean) => {
      if (!client || !isConnected) {
        console.warn('Cannot publish typing status: Not connected to Ably');
        return false;
      }

      try {
        // In a real implementation, we would use Ably to publish the typing status
        console.log('Simulated publishing typing status:', { userId, username, isTyping });
        
        // If there's an onTyping callback, call it as if the status was received back
        options.onTyping?.({ userId, username, isTyping });
        
        return true;
      } catch (error) {
        console.error('Error publishing typing status:', error);
        return false;
      }
    },
    [client, isConnected, options]
  );

  useEffect(() => {
    if (!client || !isConnected || !conversationId) return;

    // In a real implementation, we would subscribe to the Ably channel here
    console.log(`Simulated subscription to conversation ${conversationId}`);

    return () => {
      // Cleanup subscription
      console.log(`Simulated unsubscription from conversation ${conversationId}`);
    };
  }, [client, conversationId, isConnected, options, workspaceId]);

  return {
    isSubscribed: isConnected,
    publishMessage,
    publishTypingStatus
  };
};
