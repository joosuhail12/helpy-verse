
import { useCallback } from 'react';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';

export const useOfflineMessaging = (conversationId: string) => {
  const getStorageKey = useCallback(() => {
    return `offline_messages_${conversationId}`;
  }, [conversationId]);

  const queueMessage = useCallback(
    async (message: ChatMessage) => {
      const key = getStorageKey();
      const storedMessages = localStorage.getItem(key);
      let queuedMessages: ChatMessage[] = [];

      if (storedMessages) {
        try {
          queuedMessages = JSON.parse(storedMessages);
        } catch (e) {
          console.error('Error parsing stored messages:', e);
        }
      }

      queuedMessages.push(message);
      localStorage.setItem(key, JSON.stringify(queuedMessages));
    },
    [getStorageKey]
  );

  const getQueuedMessages = useCallback(async (): Promise<ChatMessage[]> => {
    const key = getStorageKey();
    const storedMessages = localStorage.getItem(key);

    if (!storedMessages) {
      return [];
    }

    try {
      return JSON.parse(storedMessages);
    } catch (e) {
      console.error('Error parsing stored messages:', e);
      return [];
    }
  }, [getStorageKey]);

  const clearQueuedMessages = useCallback(async () => {
    localStorage.removeItem(getStorageKey());
  }, [getStorageKey]);

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
