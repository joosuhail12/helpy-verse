
// Export all Ably utilities
export * from './ablyConnection';
export * from './conversationService';

// Import directly from modules 
import { 
  conversationMessages, 
  typingIndicators,
  presenceIndicators,
  monitorEnhancedPresence as getPresence
} from './messaging';

// Rename imports to avoid conflicts
export const sendChatMessage = conversationMessages.sendMessage;
export const subscribeToConversation = (channelId: string, callback: Function) => {
  console.log(`Subscribing to messages on channel ${channelId}`);
  return () => console.log(`Unsubscribing from messages on channel ${channelId}`);
};
export const monitorEnhancedPresence = getPresence;

export * from './channelService';
export * from './types';

export const monitorTypingIndicators = typingIndicators.enterChannel;
export const updateTypingStatus = typingIndicators.enterChannel;
