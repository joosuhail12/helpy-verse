
// Re-export all messaging utilities for easier imports

// Import modules first
import conversationMessagesModule from './conversationMessages';
import presenceIndicatorsModule from './presenceIndicators';
import typingIndicatorsModule from './typingIndicators';
import fileUploadModule from './fileUploadService';

// Re-export modules
export const conversationMessages = conversationMessagesModule;
export const presenceIndicators = presenceIndicatorsModule;
export const typingIndicators = typingIndicatorsModule;
export const fileUploadService = fileUploadModule;

// Named exports for common functions
export const sendMessage = conversationMessagesModule.sendMessage;
export const getMessageHistory = conversationMessagesModule.getMessageHistory;

// Export subscribe function
export const subscribeToConversation = (channelId: string, callback: Function) => {
  console.log(`Subscribing to messages on channel ${channelId}`);
  return () => console.log(`Unsubscribing from messages on channel ${channelId}`);
};

// Presence exports
export const monitorEnhancedPresence = presenceIndicatorsModule.getPresence;
export const getPresence = presenceIndicatorsModule.getPresence;

// Typing indicators
export const monitorTypingIndicators = typingIndicatorsModule.enterChannel;
export const updateTypingStatus = typingIndicatorsModule.enterChannel;

// Create a mock offlineMessaging module for now
export const getOfflineMessages = () => [];
export const saveOfflineMessages = () => true;
export const addOfflineMessage = () => true;
export const updateMessageStatus = () => true;
export const removeOfflineMessage = () => true;
export const processOfflineMessages = () => true;
export const getOfflineMessagesById = () => [];
export const hasOfflineMessages = () => false;
export const incrementRetryCount = () => true;
export const markMessageAsSent = () => true;
export const markMessageAsFailed = () => true;
export const queueMessage = (message: any) => message;
export const loadQueuedMessages = () => [];
export const saveQueuedMessages = () => true;
export const removeFromQueue = () => true;
export const checkForFailedMessages = () => false;
export const resendFailedMessages = () => Promise.resolve();
export const useOfflineMessaging = () => ({
  offlineMessages: [],
  addMessageToQueue: () => {},
  processQueue: () => {},
  hasFailedMessages: false
});
