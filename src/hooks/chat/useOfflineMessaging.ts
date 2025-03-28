
import { useCallback } from 'react';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';

export const useOfflineMessaging = (conversationId: string) => {
  // Queue a message to be sent when online
  const queueMessage = useCallback(async (message: ChatMessage): Promise<void> => {
    try {
      const queuedMessages = await getQueuedMessages();
      queuedMessages.push(message);
      
      localStorage.setItem(`offline_messages_${conversationId}`, JSON.stringify(queuedMessages));
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to queue message:', error);
      return Promise.reject(error);
    }
  }, [conversationId]);
  
  // Get all queued messages
  const getQueuedMessages = useCallback(async (): Promise<ChatMessage[]> => {
    try {
      const messages = localStorage.getItem(`offline_messages_${conversationId}`);
      return messages ? JSON.parse(messages) : [];
    } catch (error) {
      console.error('Failed to get queued messages:', error);
      return [];
    }
  }, [conversationId]);
  
  // Clear all queued messages
  const clearQueuedMessages = useCallback(async (): Promise<void> => {
    try {
      localStorage.removeItem(`offline_messages_${conversationId}`);
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to clear queued messages:', error);
      return Promise.reject(error);
    }
  }, [conversationId]);
  
  return {
    queueMessage,
    getQueuedMessages,
    clearQueuedMessages
  };
};
