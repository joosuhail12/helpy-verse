
import { v4 as uuidv4 } from 'uuid';
import { initializeAbly } from '../connection/connectionManager';
import { ChatMessage } from '../types';

// Interface for queued messages
interface QueuedMessage {
  id: string;
  conversationId: string;
  text: string;
  sender: {
    id: string;
    name: string;
    type: string;
  };
  timestamp: string;
  status: 'queued' | 'sending' | 'sent' | 'failed';
}

// Store for offline messages
const STORAGE_KEY = 'offline_messages';

/**
 * Save a message to offline queue
 */
export const queueOfflineMessage = (
  conversationId: string,
  text: string,
  sender: { id: string; name: string; type: string }
): QueuedMessage => {
  const queuedMessage: QueuedMessage = {
    id: uuidv4(),
    conversationId,
    text,
    sender,
    timestamp: new Date().toISOString(),
    status: 'queued'
  };

  // Get existing messages
  const existingMessages = getQueuedMessages();
  
  // Add new message
  const updatedMessages = [...existingMessages, queuedMessage];
  
  // Save to local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
  
  return queuedMessage;
};

/**
 * Get all queued messages
 */
export const getQueuedMessages = (): QueuedMessage[] => {
  try {
    const messages = localStorage.getItem(STORAGE_KEY);
    return messages ? JSON.parse(messages) : [];
  } catch (error) {
    console.error('Error retrieving queued messages:', error);
    return [];
  }
};

/**
 * Get queued messages for a specific conversation
 */
export const getQueuedMessagesForConversation = (conversationId: string): QueuedMessage[] => {
  return getQueuedMessages().filter(msg => msg.conversationId === conversationId);
};

/**
 * Update message status
 */
export const updateMessageStatus = (messageId: string, status: 'queued' | 'sending' | 'sent' | 'failed'): void => {
  const messages = getQueuedMessages();
  const updatedMessages = messages.map(msg => 
    msg.id === messageId ? { ...msg, status } : msg
  );
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
};

/**
 * Remove a message from the queue
 */
export const removeQueuedMessage = (messageId: string): void => {
  const messages = getQueuedMessages();
  const updatedMessages = messages.filter(msg => msg.id !== messageId);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
};

/**
 * Send all queued messages when connection is restored
 */
export const syncQueuedMessages = async (): Promise<void> => {
  const queuedMessages = getQueuedMessages();
  if (queuedMessages.length === 0) return;
  
  try {
    const ably = await initializeAbly();
    
    // Process messages in order they were queued (oldest first)
    for (const message of queuedMessages) {
      try {
        updateMessageStatus(message.id, 'sending');
        
        const channel = ably.channels.get(`conversation:${message.conversationId}`);
        
        // Convert to ChatMessage format
        const chatMessage: ChatMessage = {
          id: message.id,
          text: message.text,
          sender: message.sender,
          timestamp: message.timestamp
        };
        
        await channel.publish('message', chatMessage);
        
        // Message sent successfully, remove from queue
        removeQueuedMessage(message.id);
      } catch (error) {
        console.error('Error sending queued message:', error);
        updateMessageStatus(message.id, 'failed');
      }
    }
  } catch (error) {
    console.error('Failed to sync queued messages:', error);
  }
};

/**
 * Check if there are any failed messages
 */
export const hasFailedMessages = (): boolean => {
  return getQueuedMessages().some(msg => msg.status === 'failed');
};

/**
 * Retry sending failed messages
 */
export const retryFailedMessages = async (): Promise<void> => {
  const failedMessages = getQueuedMessages().filter(msg => msg.status === 'failed');
  
  for (const message of failedMessages) {
    updateMessageStatus(message.id, 'queued');
  }
  
  await syncQueuedMessages();
};
