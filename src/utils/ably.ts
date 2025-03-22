
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
  sendChatMessage as sendMessage,
  getUserConversations,
  
  // Messaging functions
  subscribeToConversation,
  monitorTypingIndicators,
  updateTypingStatus,
  monitorEnhancedPresence,
  
  // Channel management
  getAblyChannel
} from './ably/index';

// Re-export types
export type { ChatMessage, ConversationMetadata } from './ably/types';
