
/**
 * Offline messaging functionality
 */
import { ChatMessage, QueuedMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGE_STATUS } from '@/config/constants';

// Local storage key for queued messages
const QUEUE_STORAGE_KEY = 'chat_queued_messages';

// Define valid message status types
type MessageStatus = 'queued' | 'sending' | 'sent' | 'failed';

/**
 * Load queued messages from localStorage
 */
export const loadQueuedMessages = (): QueuedMessage[] => {
  try {
    const storedMessages = localStorage.getItem(QUEUE_STORAGE_KEY);
    return storedMessages ? JSON.parse(storedMessages) : [];
  } catch (error) {
    console.error('Failed to load queued messages from storage:', error);
    return [];
  }
};

/**
 * Save queued messages to localStorage
 */
export const saveQueuedMessages = (messages: QueuedMessage[]): void => {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save queued messages to storage:', error);
  }
};

/**
 * Queue a message for later sending
 */
export const queueMessage = (
  message: ChatMessage,
  conversationId: string,
  userId: string
): QueuedMessage => {
  const queuedMessage: QueuedMessage = {
    ...message,
    conversationId,
    userId,
    status: 'queued' as MessageStatus
  };
  
  const queuedMessages = loadQueuedMessages();
  queuedMessages.push(queuedMessage);
  saveQueuedMessages(queuedMessages);
  
  return queuedMessage;
};

/**
 * Update the status of a queued message
 */
export const updateMessageStatus = (
  messageId: string,
  status: MessageStatus
): void => {
  const queuedMessages = loadQueuedMessages();
  const updatedMessages = queuedMessages.map(msg => 
    msg.id === messageId ? { ...msg, status } : msg
  );
  saveQueuedMessages(updatedMessages);
};

/**
 * Remove a message from the queue
 */
export const removeFromQueue = (messageId: string): void => {
  const queuedMessages = loadQueuedMessages();
  const updatedMessages = queuedMessages.filter(msg => msg.id !== messageId);
  saveQueuedMessages(updatedMessages);
};

/**
 * Check if there are any failed messages in the queue
 */
export const checkForFailedMessages = (): boolean => {
  const queuedMessages = loadQueuedMessages();
  return queuedMessages.some(msg => msg.status === 'failed');
};

/**
 * Retry sending failed messages
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
  const failedMessages = queuedMessages.filter(msg => 
    msg.status === 'failed'
  );
  
  for (const message of failedMessages) {
    try {
      updateMessageStatus(message.id, 'sending');
      
      await sendFunction(
        message.conversationId,
        message.text,
        message.sender,
        message.id
      );
      
      // Remove from queue after successful send
      removeFromQueue(message.id);
    } catch (error) {
      console.error(`Failed to resend message ${message.id}:`, error);
      updateMessageStatus(message.id, 'failed');
    }
  }
  
  return loadQueuedMessages();
};

// Add named exports for better imports
export const hasFailedMessages = checkForFailedMessages;
export const retryFailedMessages = resendFailedMessages;
