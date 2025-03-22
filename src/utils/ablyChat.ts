
// This file is a backwards-compatibility layer to avoid breaking existing imports
// New code should import directly from @/utils/ably

import { 
  initializeAbly,
  cleanupAblyConnection,
  eventHandlers
} from './ably/ablyConnection';

import {
  createConversation,
  sendMessage,
  getUserConversations
} from './ably/conversationService';

import {
  subscribeToConversation,
  monitorTypingIndicators,
  updateTypingStatus
} from './ably/messagingService';

import {
  ChatMessage,
  ConversationMetadata
} from './ably/types';

// Re-export everything for backwards compatibility
export {
  // Connection
  initializeAbly,
  cleanupAblyConnection,
  
  // Conversation
  createConversation,
  sendMessage,
  getUserConversations,
  
  // Messaging
  subscribeToConversation,
  monitorTypingIndicators,
  updateTypingStatus,
  
  // Types
  ChatMessage,
  ConversationMetadata
};
