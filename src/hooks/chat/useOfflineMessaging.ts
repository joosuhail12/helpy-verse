
import { useCallback } from 'react';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';

/**
 * Hook to handle offline messaging functionality
 */
export const useOfflineMessaging = (conversationId: string) => {
  const getQueueKey = useCallback(() => `offline_queue_${conversationId}`, [conversationId]);

  // Queue a message for later sending
  const queueMessage = useCallback(
    async (message: ChatMessage) => {
      try {
        const queueKey = getQueueKey();
        const queuedMessages = await getQueuedMessages();
        
        localStorage.setItem(queueKey, JSON.stringify([...queuedMessages, message]));
        return true;
      } catch (error) {
        console.error('Error queueing message:', error);
        return false;
      }
    },
    [getQueueKey]
  );

  // Get all queued messages
  const getQueuedMessages = useCallback(async (): Promise<ChatMessage[]> => {
    try {
      const queueKey = getQueueKey();
      const queuedMessagesString = localStorage.getItem(queueKey);
      
      if (!queuedMessagesString) return [];
      
      return JSON.parse(queuedMessagesString);
    } catch (error) {
      console.error('Error getting queued messages:', error);
      return [];
    }
  }, [getQueueKey]);

  // Clear all queued messages
  const clearQueuedMessages = useCallback(async () => {
    try {
      const queueKey = getQueueKey();
      localStorage.removeItem(queueKey);
      return true;
    } catch (error) {
      console.error('Error clearing queued messages:', error);
      return false;
    }
  }, [getQueueKey]);

  // Check if there are any queued messages
  const hasQueuedMessages = useCallback(async (): Promise<boolean> => {
    const messages = await getQueuedMessages();
    return messages.length > 0;
  }, [getQueuedMessages]);

  return {
    queueMessage,
    getQueuedMessages,
    clearQueuedMessages,
    hasQueuedMessages
  };
};
