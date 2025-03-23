
import { useCallback } from 'react';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';

export const useOfflineMessaging = (conversationId: string) => {
  // Store queue key
  const queueKey = `chat_queue_${conversationId}`;
  
  // Queue a message for offline storage
  const queueMessage = useCallback(async (message: ChatMessage) => {
    try {
      const queuedMessages = await getQueuedMessages();
      queuedMessages.push(message);
      localStorage.setItem(queueKey, JSON.stringify(queuedMessages));
    } catch (error) {
      console.error('Error queuing message:', error);
    }
  }, [queueKey]);
  
  // Get all queued messages
  const getQueuedMessages = useCallback(() => {
    try {
      const queuedMessages = localStorage.getItem(queueKey);
      return queuedMessages ? JSON.parse(queuedMessages) as ChatMessage[] : [];
    } catch (error) {
      console.error('Error getting queued messages:', error);
      return [];
    }
  }, [queueKey]);
  
  // Clear queued messages
  const clearQueuedMessages = useCallback(() => {
    try {
      localStorage.removeItem(queueKey);
      return true;
    } catch (error) {
      console.error('Error clearing queued messages:', error);
      return false;
    }
  }, [queueKey]);
  
  // Check if there are queued messages
  const hasQueuedMessages = useCallback(() => {
    try {
      const messages = getQueuedMessages();
      return messages.length > 0;
    } catch (error) {
      console.error('Error checking queued messages:', error);
      return false;
    }
  }, [getQueuedMessages]);

  return {
    queueMessage,
    getQueuedMessages,
    clearQueuedMessages,
    hasQueuedMessages
  };
};
