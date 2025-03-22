
/**
 * Re-export Ably utilities for easier imports
 */

// Re-export Ably connection functionality
export { 
  initializeAbly, 
  getAblyInstance, 
  setAblyInstance, 
  connectionOptions 
} from './ably/connection/connectionManager';

// Re-export channel services
export {
  getAblyChannel,
  subscribeToChannel,
  publishToChannel,
  enterChannelPresence,
  subscribeToPresence,
  cleanupChannel
} from './ably/channelService';

// Re-export conversation service
export {
  createConversation,
  sendMessage,
  getUserConversations
} from './ably/conversationService';

// Re-export messaging functionality
export { 
  subscribeToConversation,
  subscribeToTicket,
  monitorEnhancedPresence 
} from './ably/messaging/realTimeMessaging';

// Re-export typing indicators
export { 
  monitorTypingIndicators, 
  updateTypingStatus 
} from './ably/messaging/typingIndicators';

// Re-export offline messaging
export { 
  queueMessage,
  updateMessageStatus,
  loadQueuedMessages,
  saveQueuedMessages,
  removeFromQueue,
  checkForFailedMessages as hasFailedMessages,
  resendFailedMessages as retryFailedMessages
} from './ably/messaging/offlineMessaging';

// Re-export file upload
export { 
  uploadFile, 
  uploadFiles 
} from './ably/messaging/fileUploadService';

// Re-export cleanup function
export { 
  cleanupAblyConnection 
} from './ably/connection/cleanup';

// Re-export event handlers registry
export { 
  eventHandlers 
} from './ably/events/eventRegistry';

// Re-export types
export type { 
  ChatMessage, 
  ParticipantInfo,
  ConversationMetadata,
  QueuedMessage
} from './ably/types';
