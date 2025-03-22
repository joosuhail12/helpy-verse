
import { ChatMessage, QueuedMessage } from '../types';
import { localStorageKeys } from '@/config/constants';

/**
 * Save queued messages to local storage
 */
export const saveQueuedMessages = (messages: QueuedMessage[]) => {
  try {
    localStorage.setItem(localStorageKeys.QUEUED_MESSAGES, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save queued messages to localStorage:', error);
  }
};

/**
 * Load queued messages from local storage
 */
export const loadQueuedMessages = (): QueuedMessage[] => {
  try {
    const savedMessages = localStorage.getItem(localStorageKeys.QUEUED_MESSAGES);
    return savedMessages ? JSON.parse(savedMessages) : [];
  } catch (error) {
    console.error('Failed to load queued messages from localStorage:', error);
    return [];
  }
};

/**
 * Queue a message for later sending when connection is restored
 */
export const queueMessage = (
  message: ChatMessage, 
  conversationId: string, 
  userId: string
): QueuedMessage => {
  // Create a queued message with the required status
  const queuedMessage: QueuedMessage = {
    ...message,
    status: 'queued',
    conversationId, // Include conversationId
    userId, // Include userId
  };

  // Load existing queued messages
  const queuedMessages = loadQueuedMessages();
  
  // Add the new message to the queue
  queuedMessages.push(queuedMessage);
  
  // Save updated queue back to localStorage
  saveQueuedMessages(queuedMessages);
  
  return queuedMessage;
};

/**
 * Update status of a queued message
 */
export const updateMessageStatus = (
  messageId: string, 
  status: 'queued' | 'sending' | 'sent' | 'failed'
): QueuedMessage[] => {
  const queuedMessages = loadQueuedMessages();
  
  const updatedMessages = queuedMessages.map(message => {
    if (message.id === messageId) {
      return { ...message, status };
    }
    return message;
  });
  
  saveQueuedMessages(updatedMessages);
  return updatedMessages;
};

/**
 * Remove a message from the queue (e.g., after successful sending)
 */
export const removeFromQueue = (messageId: string): QueuedMessage[] => {
  const queuedMessages = loadQueuedMessages();
  const filteredMessages = queuedMessages.filter(message => message.id !== messageId);
  saveQueuedMessages(filteredMessages);
  return filteredMessages;
};

/**
 * Check if there are any failed messages in the queue
 */
export const checkForFailedMessages = (): boolean => {
  const queuedMessages = loadQueuedMessages();
  return queuedMessages.some(message => message.status === 'failed');
};

/**
 * Attempt to resend failed messages
 */
export const resendFailedMessages = async (
  sendFunction: (
    conversationId: string, 
    text: string, 
    sender: any, 
    messageId?: string
  ) => Promise<any>
): Promise<QueuedMessage[]> => {
  const queuedMessages = loadQueuedMessages();
  const failedMessages = queuedMessages.filter(message => message.status === 'failed');
  
  for (const message of failedMessages) {
    try {
      updateMessageStatus(message.id, 'sending');
      
      // Use the conversationId from the message
      if (message.conversationId && message.text) {
        await sendFunction(
          message.conversationId,
          message.text,
          message.sender,
          message.id
        );
        removeFromQueue(message.id);
      }
    } catch (error) {
      console.error('Failed to resend message:', error);
      updateMessageStatus(message.id, 'failed');
    }
  }
  
  return loadQueuedMessages();
};

/**
 * Clear all queued messages
 */
export const clearQueuedMessages = (): void => {
  saveQueuedMessages([]);
};
