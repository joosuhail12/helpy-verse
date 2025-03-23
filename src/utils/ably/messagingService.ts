
// This file is now just a re-export to maintain backward compatibility
// New code should import directly from the specific modules

import conversationMessages from './messaging/conversationMessages';
import typingIndicators from './messaging/typingIndicators';

export const subscribeToConversation = (channelId: string, callback: Function) => {
  console.log(`Subscribing to messages on channel ${channelId}`);
  return () => console.log(`Unsubscribing from messages on channel ${channelId}`);
};

export const monitorTypingIndicators = typingIndicators.enterChannel;
export const updateTypingStatus = typingIndicators.enterChannel;
