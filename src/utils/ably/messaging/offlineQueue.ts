
/**
 * Offline message queuing functionality
 */
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';

const QUEUE_STORAGE_KEY = 'ably_message_queue';

/**
 * Saves a message to the offline queue
 */
export const queueMessage = async (message: ChatMessage): Promise<void> => {
  try {
    // Get current queue
    const queue = await getQueuedMessages(message.id.split(':')[0]);
    
    // Add message to queue
    queue.push(message);
    
    // Save updated queue
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to queue message:', error);
  }
};

/**
 * Gets all queued messages for a conversation
 */
export const getQueuedMessages = async (conversationId?: string): Promise<ChatMessage[]> => {
  try {
    const queueJson = localStorage.getItem(QUEUE_STORAGE_KEY);
    
    if (!queueJson) {
      return [];
    }
    
    const queue = JSON.parse(queueJson) as ChatMessage[];
    
    // Filter by conversation if ID provided
    if (conversationId) {
      return queue.filter(msg => {
        const msgConvId = msg.id.split(':')[0];
        return msgConvId === conversationId;
      });
    }
    
    return queue;
  } catch (error) {
    console.error('Failed to get queued messages:', error);
    return [];
  }
};

/**
 * Clears all queued messages or just for a specific conversation
 */
export const clearQueuedMessages = async (conversationId?: string): Promise<void> => {
  try {
    if (!conversationId) {
      // Clear entire queue
      localStorage.removeItem(QUEUE_STORAGE_KEY);
      return;
    }
    
    // Get current queue
    const allMessages = await getQueuedMessages();
    
    // Filter out messages for the specified conversation
    const remainingMessages = allMessages.filter(msg => {
      const msgConvId = msg.id.split(':')[0];
      return msgConvId !== conversationId;
    });
    
    // Save updated queue or remove if empty
    if (remainingMessages.length > 0) {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(remainingMessages));
    } else {
      localStorage.removeItem(QUEUE_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to clear queued messages:', error);
  }
};
