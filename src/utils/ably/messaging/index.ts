
// Re-export messaging functions for easier imports
export { sendMessage, subscribeToConversation, monitorEnhancedPresence } from './realTimeMessaging';
export { 
  queueMessage,
  updateMessageStatus,
  loadQueuedMessages,
  saveQueuedMessages,
  removeFromQueue,
  checkForFailedMessages as hasFailedMessages,
  resendFailedMessages as retryFailedMessages
} from './offlineMessaging';
export { monitorTypingIndicators, updateTypingStatus } from './typingIndicators';
