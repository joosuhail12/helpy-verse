
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';

// Storage key for messages
const STORAGE_KEY_PREFIX = 'offline_messages_';

interface UseOfflineMessagingReturn {
  queueMessage: (message: ChatMessage) => Promise<void>;
  getQueuedMessages: () => Promise<ChatMessage[]>;
  clearQueuedMessages: () => Promise<void>;
  pendingCount: number;
}

export const useOfflineMessaging = (conversationId: string): UseOfflineMessagingReturn => {
  const [pendingCount, setPendingCount] = useState<number>(0);
  
  // Get storage key for this conversation
  const getStorageKey = () => `${STORAGE_KEY_PREFIX}${conversationId}`;
  
  // Queue a message for when online
  const queueMessage = useCallback(async (message: ChatMessage): Promise<void> => {
    try {
      // Get current messages
      const current = await getQueuedMessages();
      
      // Add new message
      const updated = [...current, message];
      
      // Save to localStorage
      localStorage.setItem(getStorageKey(), JSON.stringify(updated));
      
      // Update pending count
      setPendingCount(updated.length);
    } catch (error) {
      console.error('Failed to queue offline message:', error);
    }
  }, [conversationId]);
  
  // Get all queued messages
  const getQueuedMessages = useCallback(async (): Promise<ChatMessage[]> => {
    try {
      const stored = localStorage.getItem(getStorageKey());
      
      if (!stored) {
        return [];
      }
      
      const messages = JSON.parse(stored) as ChatMessage[];
      setPendingCount(messages.length);
      return messages;
    } catch (error) {
      console.error('Failed to get queued messages:', error);
      return [];
    }
  }, [conversationId]);
  
  // Clear queued messages
  const clearQueuedMessages = useCallback(async (): Promise<void> => {
    try {
      localStorage.removeItem(getStorageKey());
      setPendingCount(0);
    } catch (error) {
      console.error('Failed to clear queued messages:', error);
    }
  }, [conversationId]);
  
  return {
    queueMessage,
    getQueuedMessages,
    clearQueuedMessages,
    pendingCount
  };
};
