
// This file is now just a re-export to maintain backward compatibility
// New code should import directly from the specific modules

import { 
  subscribeToConversation 
} from './messaging/conversationMessages';

import { 
  monitorTypingIndicators,
  updateTypingStatus 
} from './messaging/typingIndicators';

export {
  subscribeToConversation,
  monitorTypingIndicators,
  updateTypingStatus
};
