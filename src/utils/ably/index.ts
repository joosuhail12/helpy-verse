
// Export all Ably utilities
export * from './ablyConnection';
export * from './conversationService';
// Rename imports to avoid conflicts
export { 
  sendMessage as sendChatMessage,
  subscribeToConversation,
  monitorEnhancedPresence
} from './messaging/index';
export * from './channelService';
export * from './types';
export { 
  monitorTypingIndicators,
  updateTypingStatus 
} from './messaging/typingIndicators';
