
/**
 * Re-export Ably utilities for easier imports
 */

// Re-export Ably functionality
export * from './ably/ablyConnection';
export * from './ably/conversationService';
export * from './ably/channelService';
export * from './ably/types';

// Import from messaging index
import { 
  sendMessage, 
  subscribeToConversation, 
  monitorEnhancedPresence 
} from './ably/messaging/index';

// Import typing indicators from their dedicated file
import { 
  monitorTypingIndicators, 
  updateTypingStatus 
} from './ably/messaging/typingIndicators';

// Re-export everything
export { 
  sendMessage, 
  subscribeToConversation, 
  monitorEnhancedPresence,
  monitorTypingIndicators, 
  updateTypingStatus 
};
