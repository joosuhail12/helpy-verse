
import { useCallback } from 'react';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';

// Store key prefix
const OFFLINE_QUEUE_KEY = 'pullse_offline_messages_';

export const useOfflineMessaging = (conversationId: string) => {
  // Queue a message for when connection is restored
  const queueMessage = useCallback(async (message: ChatMessage) => {
    try {
      const key = `${OFFLINE_QUEUE_KEY}${conversationId}`;
      const existingMessages = JSON.parse(localStorage.getItem(key) || '[]');
      existingMessages.push(message);
      localStorage.setItem(key, JSON.stringify(existingMessages));
      return true;
    } catch (error) {
      console.error('Failed to queue message:', error);
      return false;
    }
  }, [conversationId]);
  
  // Get queued messages for this conversation
  const getQueuedMessages = useCallback(async (): Promise<ChatMessage[]> => {
    try {
      const key = `${OFFLINE_QUEUE_KEY}${conversationId}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (error) {
      console.error('Failed to get queued messages:', error);
      return [];
    }
  }, [conversationId]);
  
  // Clear the message queue
  const clearQueuedMessages = useCallback(async () => {
    try {
      const key = `${OFFLINE_QUEUE_KEY}${conversationId}`;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to clear queued messages:', error);
      return false;
    }
  }, [conversationId]);
  
  // Check if there are queued messages
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
