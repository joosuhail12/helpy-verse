
// Re-export all messaging utilities for easier imports

// Offline messaging utilities
export {
  getOfflineMessages,
  saveOfflineMessages,
  addOfflineMessage,
  updateMessageStatus,
  removeOfflineMessage,
  processOfflineMessages,
  getOfflineMessagesById,
  hasOfflineMessages,
  incrementRetryCount,
  markMessageAsSent,
  markMessageAsFailed,
  queueMessage,
  loadQueuedMessages,
  saveQueuedMessages,
  removeFromQueue,
  checkForFailedMessages,
  resendFailedMessages as retryFailedMessages,
  hasOfflineMessages as hasFailedMessages,
  useOfflineMessaging
} from './offlineMessaging';

// Conversation messages
export { default as conversationMessages } from './conversationMessages';
export const sendMessage = conversationMessages.sendMessage;
export const subscribeToConversation = (channelId, callback) => {
  console.log(`Subscribing to messages on channel ${channelId}`);
  return () => console.log(`Unsubscribing from messages on channel ${channelId}`);
};

// Presence indicators
export { default as presenceIndicators } from './presenceIndicators';
export const monitorEnhancedPresence = presenceIndicators.getPresence;

// Typing indicators
export { default as typingIndicators } from './typingIndicators';
export const monitorTypingIndicators = typingIndicators.enterChannel;
export const updateTypingStatus = typingIndicators.enterChannel;

// Real-time messaging
export { default as realTimeMessaging } from './realTimeMessaging';

// File upload service
export { default as fileUploadService } from './fileUploadService';
