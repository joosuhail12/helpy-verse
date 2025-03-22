import { v4 as uuid } from 'uuid';
import { ChatMessage, QueuedMessage } from '../types';

// In-memory storage for queued messages
let queuedMessages: QueuedMessage[] = [];

/**
 * Queue a message to be sent when online
 */
export const queueMessage = (
  text: string, 
  userId: string, 
  userName: string,
  conversationId?: string
): QueuedMessage => {
  const message: QueuedMessage = {
    id: uuid(),
    text,
    sender: {
      id: userId,
      name: userName,
      type: 'customer'
    },
    timestamp: new Date().toISOString(),
    status: 'queued'
  };
  
  // Add conversationId as an extra property if provided
  if (conversationId) {
    Object.assign(message, { conversationId });
  }
  
  queuedMessages.push(message);
  
  // Persist to localStorage (could be improved with a proper offline storage solution)
  try {
    localStorage.setItem('queuedMessages', JSON.stringify(queuedMessages));
  } catch (error) {
    console.error('Error saving queued messages to localStorage:', error);
  }
  
  return message;
};

/**
 * Update the status of a queued message
 */
export const updateQueuedMessageStatus = (
  messageId: string, 
  status: 'queued' | 'sending' | 'sent' | 'failed'
): void => {
  queuedMessages = queuedMessages.map(msg => 
    msg.id === messageId ? { ...msg, status } : msg
  );
  
  // Update localStorage
  try {
    localStorage.setItem('queuedMessages', JSON.stringify(queuedMessages));
  } catch (error) {
    console.error('Error updating queued messages in localStorage:', error);
  }
};

/**
 * Get all queued messages
 */
export const getQueuedMessages = (): QueuedMessage[] => {
  // Try to load from localStorage on first access
  if (queuedMessages.length === 0) {
    try {
      const storedMessages = localStorage.getItem('queuedMessages');
      if (storedMessages) {
        queuedMessages = JSON.parse(storedMessages) as QueuedMessage[];
      }
    } catch (error) {
      console.error('Error loading queued messages from localStorage:', error);
    }
  }
  
  return queuedMessages;
};

/**
 * Get queued messages for a specific conversation
 */
export const getQueuedMessagesForConversation = (conversationId: string): QueuedMessage[] => {
  return getQueuedMessages().filter(msg => 
    // Check both properties since we might have stored conversationId in different ways
    (msg as any).conversationId === conversationId
  );
};

/**
 * Remove a queued message (e.g. after successful sending)
 */
export const removeQueuedMessage = (messageId: string): void => {
  queuedMessages = queuedMessages.filter(msg => msg.id !== messageId);
  
  // Update localStorage
  try {
    localStorage.setItem('queuedMessages', JSON.stringify(queuedMessages));
  } catch (error) {
    console.error('Error updating queued messages in localStorage:', error);
  }
};

/**
 * Clear all queued messages
 */
export const clearQueuedMessages = (): void => {
  queuedMessages = [];
  
  // Clear from localStorage
  try {
    localStorage.removeItem('queuedMessages');
  } catch (error) {
    console.error('Error clearing queued messages from localStorage:', error);
  }
};

/**
 * Convert a queued message to a regular chat message
 */
export const convertQueuedMessageToChatMessage = (queuedMessage: QueuedMessage): ChatMessage => {
  // Extract status and keep the rest
  const { status, ...chatMessage } = queuedMessage;
  return chatMessage;
};
