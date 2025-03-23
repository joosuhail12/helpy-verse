
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
  resendFailedMessages,
  useOfflineMessaging
} from './offlineMessaging';

// Import modules
import conversationMessagesModule from './conversationMessages';
import presenceIndicatorsModule from './presenceIndicators';
import typingIndicatorsModule from './typingIndicators';
import realTimeMessagingModule from './realTimeMessaging';
import fileUploadModule from './fileUploadService';

// Re-export modules
export const conversationMessages = conversationMessagesModule;
export const presenceIndicators = presenceIndicatorsModule;
export const typingIndicators = typingIndicatorsModule;
export const realTimeMessaging = realTimeMessagingModule;
export const fileUploadService = fileUploadModule;

// Named exports for common functions
export const sendMessage = conversationMessagesModule.sendMessage;
export const subscribeToConversation = (channelId: string, callback: Function) => {
  console.log(`Subscribing to messages on channel ${channelId}`);
  return () => console.log(`Unsubscribing from messages on channel ${channelId}`);
};

// Presence exports
export const monitorEnhancedPresence = presenceIndicatorsModule.getPresence;

// Typing indicators
export const monitorTypingIndicators = typingIndicatorsModule.enterChannel;
export const updateTypingStatus = typingIndicatorsModule.enterChannel;
