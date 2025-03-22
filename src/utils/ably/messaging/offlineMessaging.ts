
import { ChatMessage, QueuedMessage } from '../types';

const QUEUE_STORAGE_KEY = 'ably-message-queue';

type MessageStatus = 'queued' | 'sending' | 'sent' | 'failed';

// Queue a message for offline sending
export const queueMessage = (message: ChatMessage): QueuedMessage => {
  const queuedMessage: QueuedMessage = {
    ...message,
    status: 'queued' as MessageStatus
  };

  // Get existing queue
  const existingQueue = loadQueuedMessages();
  
  // Add message to queue
  const updatedQueue = [...existingQueue, queuedMessage];
  
  // Save updated queue to local storage
  saveQueuedMessages(updatedQueue);
  
  return queuedMessage;
};

// Update message status in the queue
export const updateMessageStatus = (messageId: string, status: MessageStatus): boolean => {
  const messages = loadQueuedMessages();
  const messageIndex = messages.findIndex(m => m.id === messageId);
  
  if (messageIndex === -1) return false;
  
  messages[messageIndex].status = status;
  saveQueuedMessages(messages);
  
  return true;
};

// Load queued messages from local storage
export const loadQueuedMessages = (): QueuedMessage[] => {
  try {
    const queueString = localStorage.getItem(QUEUE_STORAGE_KEY);
    return queueString ? JSON.parse(queueString) : [];
  } catch (error) {
    console.error('Error loading queued messages from storage:', error);
    return [];
  }
};

// Save queued messages to local storage
export const saveQueuedMessages = (messages: QueuedMessage[]): void => {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving queued messages to storage:', error);
  }
};

// Remove message from queue
export const removeFromQueue = (messageId: string): boolean => {
  const messages = loadQueuedMessages();
  const filteredMessages = messages.filter(m => m.id !== messageId);
  
  if (filteredMessages.length === messages.length) {
    return false; // No message was removed
  }
  
  saveQueuedMessages(filteredMessages);
  return true;
};

// Check if there are any failed messages
export const checkForFailedMessages = (): boolean => {
  const messages = loadQueuedMessages();
  return messages.some(m => m.status === 'failed');
};

// Retry sending all failed messages
export const resendFailedMessages = async (
  sendFunction: (message: ChatMessage) => Promise<void>
): Promise<{ success: string[], failed: string[] }> => {
  const messages = loadQueuedMessages();
  const failedMessages = messages.filter(m => m.status === 'failed');
  
  const results = {
    success: [] as string[],
    failed: [] as string[]
  };
  
  // Send each failed message
  for (const message of failedMessages) {
    try {
      // Update status to sending
      updateMessageStatus(message.id, 'sending');
      
      // Try to send
      await sendFunction(message);
      
      // If successful, remove from queue
      removeFromQueue(message.id);
      results.success.push(message.id);
    } catch (error) {
      // If failed, update status
      updateMessageStatus(message.id, 'failed');
      results.failed.push(message.id);
    }
  }
  
  return results;
};
