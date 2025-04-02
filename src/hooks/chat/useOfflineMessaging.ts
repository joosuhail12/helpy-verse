
import { useCallback } from 'react';
import { queueMessage, getQueuedMessages, clearQueuedMessages } from '@/utils/ably/messaging/offlineQueue';
import { ChatMessage } from '@/types/chat';

export const useOfflineMessaging = (conversationId: string) => {
  const queueMessageCallback = useCallback(
    async (message: ChatMessage) => {
      return queueMessage(message);
    },
    [conversationId]
  );

  const getQueuedMessagesCallback = useCallback(
    async () => {
      return getQueuedMessages(conversationId);
    },
    [conversationId]
  );

  const clearQueuedMessagesCallback = useCallback(
    async () => {
      return clearQueuedMessages(conversationId);
    },
    [conversationId]
  );

  return {
    queueMessage: queueMessageCallback,
    getQueuedMessages: getQueuedMessagesCallback,
    clearQueuedMessages: clearQueuedMessagesCallback
  };
};
