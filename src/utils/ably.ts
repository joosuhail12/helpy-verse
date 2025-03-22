
/**
 * Utility functions for working with Ably real-time messaging
 */

// Re-export all functions from our refactored modules
export {
  // Connection functions
  initializeAbly,
  cleanupAblyConnection,
  
  // Conversation management functions
  createConversation,
  sendMessage,
  getUserConversations,
  
  // Messaging functions
  subscribeToConversation,
  monitorTypingIndicators,
  updateTypingStatus
} from './ably/index';

// Re-export types
export type { ChatMessage, ConversationMetadata } from './ably/types';
