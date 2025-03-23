
/**
 * Offline message queue functionality using localStorage
 */
import { v4 as uuidv4 } from 'uuid';

export interface QueuedMessage {
  id: string;
  conversationId: string;
  content: string;
  sender: string;
  timestamp: string;
  metadata?: Record<string, any>;
  attempts?: number;
}

// Queue key prefix
const QUEUE_KEY_PREFIX = 'ably_message_queue_';

// Get queue key for a conversation
const getQueueKey = (conversationId: string): string => {
  return `${QUEUE_KEY_PREFIX}${conversationId}`;
};

// Add a message to the offline queue
export const queueMessage = async (
  conversationId: string,
  content: string,
  sender: string,
  metadata: Record<string, any> = {}
): Promise<QueuedMessage> => {
  const queueKey = getQueueKey(conversationId);
  
  // Create message
  const message: QueuedMessage = {
    id: uuidv4(),
    conversationId,
    content,
    sender,
    timestamp: new Date().toISOString(),
    metadata,
    attempts: 0
  };
  
  // Get current queue
  const currentQueueJson = localStorage.getItem(queueKey);
  const currentQueue: QueuedMessage[] = currentQueueJson ? JSON.parse(currentQueueJson) : [];
  
  // Add message to queue
  currentQueue.push(message);
  
  // Save queue
  localStorage.setItem(queueKey, JSON.stringify(currentQueue));
  
  return message;
};

// Get all queued messages for a conversation
export const getQueuedMessages = (conversationId: string): QueuedMessage[] => {
  const queueKey = getQueueKey(conversationId);
  
  // Get current queue
  const currentQueueJson = localStorage.getItem(queueKey);
  return currentQueueJson ? JSON.parse(currentQueueJson) : [];
};

// Remove a message from the queue
export const removeQueuedMessage = (conversationId: string, messageId: string): boolean => {
  const queueKey = getQueueKey(conversationId);
  
  // Get current queue
  const currentQueueJson = localStorage.getItem(queueKey);
  if (!currentQueueJson) return false;
  
  const currentQueue: QueuedMessage[] = JSON.parse(currentQueueJson);
  
  // Filter out the message
  const newQueue = currentQueue.filter(msg => msg.id !== messageId);
  
  // Save queue
  localStorage.setItem(queueKey, JSON.stringify(newQueue));
  
  return true;
};

// Clear all queued messages for a conversation
export const clearQueuedMessages = (conversationId: string): boolean => {
  const queueKey = getQueueKey(conversationId);
  localStorage.removeItem(queueKey);
  return true;
};

// Process queued messages with a callback
export const processQueuedMessages = async (
  conversationId: string,
  processCallback: (message: QueuedMessage) => Promise<boolean>
): Promise<number> => {
  const queuedMessages = getQueuedMessages(conversationId);
  let processedCount = 0;
  
  for (const message of queuedMessages) {
    try {
      const success = await processCallback(message);
      
      if (success) {
        removeQueuedMessage(conversationId, message.id);
        processedCount++;
      } else {
        // Increment attempts
        message.attempts = (message.attempts || 0) + 1;
      }
    } catch (error) {
      console.error('Error processing queued message:', error);
      // Increment attempts
      message.attempts = (message.attempts || 0) + 1;
    }
  }
  
  return processedCount;
};
