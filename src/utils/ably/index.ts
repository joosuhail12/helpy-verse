
// Export all Ably utilities
export * from './ablyConnection';
export * from './conversationService';

// Import directly from modules 
import conversationMessages from './messaging/conversationMessages';
import typingIndicators from './messaging/typingIndicators';

// Rename imports to avoid conflicts
export const sendChatMessage = conversationMessages.sendMessage;
export const subscribeToConversation = (channelId: string, callback: Function) => {
  console.log(`Subscribing to messages on channel ${channelId}`);
  return () => console.log(`Unsubscribing from messages on channel ${channelId}`);
};
export const monitorEnhancedPresence = () => {
  return [];
};

export * from './channelService';
export * from './types';

export const monitorTypingIndicators = typingIndicators.enterChannel;
export const updateTypingStatus = typingIndicators.enterChannel;
