
import { ChatMessage, ParticipantInfo } from '../types';

// Queue for storing messages that couldn't be sent while offline
let messageQueue: Array<{
  conversationId: string;
  message: ChatMessage;
  status: 'queued' | 'failed';
  retryCount: number;
}> = [];

// Load queue from localStorage on startup
const initializeQueue = () => {
  try {
    const savedQueue = localStorage.getItem('message_queue');
    if (savedQueue) {
      messageQueue = JSON.parse(savedQueue);
    }
  } catch (error) {
    console.error('Failed to load message queue from localStorage:', error);
  }
};

// Save queue to localStorage
const saveQueue = () => {
  try {
    localStorage.setItem('message_queue', JSON.stringify(messageQueue));
  } catch (error) {
    console.error('Failed to save message queue to localStorage:', error);
  }
};

// Initialize queue on module load
initializeQueue();

/**
 * Queue a message for sending when connection is restored
 */
export const queueOfflineMessage = (
  conversationId: string,
  text: string,
  sender: ParticipantInfo,
  attachments?: Array<{url: string, type: string, name: string, size?: number}>
): ChatMessage => {
  const message: ChatMessage = {
    id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    text,
    sender,
    timestamp: new Date().toISOString(),
    status: 'queued',
    attachments
  };
  
  messageQueue.push({
    conversationId,
    message,
    status: 'queued',
    retryCount: 0
  });
  
  saveQueue();
  return message;
};

/**
 * Get all queued messages
 */
export const getQueuedMessages = (): Array<{
  conversationId: string;
  message: ChatMessage;
  status: 'queued' | 'failed';
}> => {
  return messageQueue.map(({ conversationId, message, status }) => ({
    conversationId,
    message,
    status
  }));
};

/**
 * Get queued messages for a specific conversation
 */
export const getQueuedMessagesForConversation = (conversationId: string): ChatMessage[] => {
  return messageQueue
    .filter(item => item.conversationId === conversationId)
    .map(item => item.message);
};

/**
 * Check if there are any failed messages that need retry
 */
export const hasFailedMessages = (): boolean => {
  return messageQueue.some(item => item.status === 'failed');
};

/**
 * Retry sending failed messages
 */
export const retryFailedMessages = async (): Promise<void> => {
  const failedMessages = messageQueue.filter(item => item.status === 'failed');
  if (failedMessages.length === 0) return;
  
  // For now, just mark them as queued again
  messageQueue = messageQueue.map(item => 
    item.status === 'failed' 
      ? { ...item, status: 'queued', retryCount: item.retryCount + 1 }
      : item
  );
  
  saveQueue();
  
  // Actual implementation would try to send them again
  await syncQueuedMessages();
};

/**
 * Sync queued messages with the server
 */
export const syncQueuedMessages = async (): Promise<void> => {
  if (messageQueue.length === 0) return;
  
  const currentQueue = [...messageQueue];
  
  // Process queued messages one by one
  for (const item of currentQueue) {
    if (item.status !== 'queued') continue;
    
    try {
      // This would be replaced with actual message sending logic
      // For now, just simulate with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from queue on success
      messageQueue = messageQueue.filter(qItem => qItem.message.id !== item.message.id);
    } catch (error) {
      console.error('Failed to send queued message:', error);
      
      // Mark as failed if retry count is too high
      if (item.retryCount >= 3) {
        messageQueue = messageQueue.map(qItem => 
          qItem.message.id === item.message.id 
            ? { ...qItem, status: 'failed' } 
            : qItem
        );
      }
    }
  }
  
  saveQueue();
};
