
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';

export const useOfflineMessaging = (conversationId: string) => {
  const [queueKey] = useState(`chat_queue_${conversationId}`);
  
  // Queue a message for sending when back online
  const queueMessage = useCallback(async (message: ChatMessage): Promise<void> => {
    try {
      const queueStr = localStorage.getItem(queueKey);
      const queue: ChatMessage[] = queueStr ? JSON.parse(queueStr) : [];
      
      queue.push(message);
      localStorage.setItem(queueKey, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to queue message:', error);
      throw error;
    }
  }, [queueKey]);
  
  // Get all queued messages
  const getQueuedMessages = useCallback(async (): Promise<ChatMessage[]> => {
    try {
      const queueStr = localStorage.getItem(queueKey);
      return queueStr ? JSON.parse(queueStr) : [];
    } catch (error) {
      console.error('Failed to get queued messages:', error);
      return [];
    }
  }, [queueKey]);
  
  // Clear the message queue
  const clearQueuedMessages = useCallback(async (): Promise<void> => {
    try {
      localStorage.removeItem(queueKey);
    } catch (error) {
      console.error('Failed to clear queued messages:', error);
      throw error;
    }
  }, [queueKey]);
  
  return {
    queueMessage,
    getQueuedMessages,
    clearQueuedMessages
  };
};

export default useOfflineMessaging;
