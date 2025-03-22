
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '../types';

interface QueuedMessage {
  id: string;
  conversationId: string;
  text: string;
  userId: string;
  userType: 'agent' | 'user';
  userName: string;
  timestamp: string;
  status: 'queued' | 'sending' | 'sent' | 'failed';
  retryCount: number;
}

const STORAGE_KEY = 'pullse-offline-messages';
const MAX_RETRIES = 3;

/**
 * Save a queued message to localStorage
 */
export const queueMessage = (
  conversationId: string,
  text: string,
  userId: string,
  userType: 'agent' | 'user',
  userName: string
): QueuedMessage => {
  const queuedMessages = getQueuedMessages();
  
  const newMessage: QueuedMessage = {
    id: uuidv4(),
    conversationId,
    text,
    userId,
    userType,
    userName,
    timestamp: new Date().toISOString(),
    status: 'queued',
    retryCount: 0
  };
  
  const updatedQueue = [...queuedMessages, newMessage];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQueue));
  
  return newMessage;
};

/**
 * Convert a queued message to a chat message format
 */
export const convertQueuedMessageToChatMessage = (
  queuedMessage: QueuedMessage
): ChatMessage => {
  return {
    id: queuedMessage.id,
    conversationId: queuedMessage.conversationId,
    text: queuedMessage.text,
    sender: {
      id: queuedMessage.userId,
      name: queuedMessage.userName,
      type: queuedMessage.userType === 'agent' ? 'agent' : 'customer'
    },
    timestamp: queuedMessage.timestamp,
    status: queuedMessage.status
  };
};

/**
 * Get all queued messages from localStorage
 */
export const getQueuedMessages = (): QueuedMessage[] => {
  const storedMessages = localStorage.getItem(STORAGE_KEY);
  if (!storedMessages) return [];
  
  try {
    return JSON.parse(storedMessages);
  } catch (e) {
    console.error('Error parsing queued messages', e);
    return [];
  }
};

/**
 * Get queued messages for a specific conversation
 */
export const getQueuedMessagesForConversation = (
  conversationId: string
): QueuedMessage[] => {
  const allMessages = getQueuedMessages();
  return allMessages.filter(msg => msg.conversationId === conversationId);
};

/**
 * Update the status of a queued message
 */
export const updateQueuedMessageStatus = (
  messageId: string,
  status: 'queued' | 'sending' | 'sent' | 'failed'
): void => {
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
 * Clear all queued messages
 */
export const clearQueuedMessages = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
