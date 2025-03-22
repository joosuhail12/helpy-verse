
// Re-export messaging functions for easier imports
export { sendMessage, subscribeToConversation } from './realTimeMessaging';
export { 
  queueMessage,
  updateMessageStatus,
  loadQueuedMessages,
  saveQueuedMessages,
  removeFromQueue,
  checkForFailedMessages as hasFailedMessages,
  resendFailedMessages as retryFailedMessages
} from './offlineMessaging';
