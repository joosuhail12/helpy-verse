
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
  conversationMessages,
  presenceIndicators,
  typingIndicators,
  monitorEnhancedPresence as getPresence
} from './ably/messaging';

// Re-export everything
export const sendMessage = conversationMessages.sendMessage;
export const subscribeToConversation = (channelId: string, callback: Function) => {
  console.log(`Subscribing to messages on channel ${channelId}`);
  return () => console.log(`Unsubscribing from messages on channel ${channelId}`);
};
export const monitorEnhancedPresence = getPresence;
export const monitorTypingIndicators = typingIndicators.enterChannel;
export const updateTypingStatus = typingIndicators.enterChannel;
