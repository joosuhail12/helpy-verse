
import { ChatMessage, QueuedMessage } from '../types';

// Valid message statuses
type MessageStatus = 'queued' | 'sending' | 'sent' | 'failed';

// Local storage key for queued messages
const QUEUE_STORAGE_KEY = 'ably-queued-messages';

/**
 * Queue a message for sending when online
 */
export const queueMessage = (message: ChatMessage): QueuedMessage => {
  const queuedMessage: QueuedMessage = {
    ...message,
    status: 'queued' as MessageStatus
  };
  
  // Get existing queued messages
  const queuedMessages = loadQueuedMessages();
  
  // Add new message to queue
  queuedMessages.push(queuedMessage);
  
  // Save updated queue
  saveQueuedMessages(queuedMessages);
  
  return queuedMessage;
};

/**
 * Update the status of a message in the queue
 */
export const updateMessageStatus = (
  messageId: string,
  status: MessageStatus
): QueuedMessage | null => {
  const queuedMessages = loadQueuedMessages();
  
  // Find the message by ID
  const messageIndex = queuedMessages.findIndex(msg => msg.id === messageId);
  
  if (messageIndex === -1) {
    return null;
  }
  
  // Update message status
  queuedMessages[messageIndex].status = status;
  
  // Save updated queue
  saveQueuedMessages(queuedMessages);
  
  return queuedMessages[messageIndex];
};

/**
 * Load queued messages from local storage
 */
export const loadQueuedMessages = (): QueuedMessage[] => {
  try {
    const queuedMessagesJson = localStorage.getItem(QUEUE_STORAGE_KEY);
    return queuedMessagesJson ? JSON.parse(queuedMessagesJson) : [];
  } catch (error) {
    console.error('Error loading queued messages:', error);
    return [];
  }
};

/**
 * Save queued messages to local storage
 */
export const saveQueuedMessages = (queuedMessages: QueuedMessage[]): void => {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queuedMessages));
  } catch (error) {
    console.error('Error saving queued messages:', error);
  }
};

/**
 * Remove a message from the queue
 */
export const removeFromQueue = (messageId: string): void => {
  const queuedMessages = loadQueuedMessages();
  
  // Filter out the specified message
  const updatedQueue = queuedMessages.filter(msg => msg.id !== messageId);
  
  // Save updated queue
  saveQueuedMessages(updatedQueue);
};

/**
 * Check if there are any failed messages in the queue
 */
export const checkForFailedMessages = (): boolean => {
  const queuedMessages = loadQueuedMessages();
  return queuedMessages.some(msg => msg.status === 'failed');
};

/**
 * Attempt to resend failed messages
 */
export const resendFailedMessages = async (
  sendMessage: (message: ChatMessage) => Promise<void>
): Promise<{ success: string[]; failed: string[] }> => {
  const queuedMessages = loadQueuedMessages();
  
  const failedMessages = queuedMessages.filter(msg => msg.status === 'failed');
  const results = { success: [] as string[], failed: [] as string[] };
  
  for (const message of failedMessages) {
    try {
      // Update status to sending
      updateMessageStatus(message.id, 'sending');
      
      // Attempt to send the message
      await sendMessage(message);
      
      // Message sent successfully
      updateMessageStatus(message.id, 'sent');
      results.success.push(message.id);
    } catch (error) {
      // Mark as failed again
      updateMessageStatus(message.id, 'failed');
      results.failed.push(message.id);
    }
  }
  
  return results;
};
