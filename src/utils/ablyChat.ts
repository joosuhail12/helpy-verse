
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
  getAblyChannel
} from './ably/channelService';

// Using 'export type' for TypeScript interfaces when isolatedModules is enabled
import type {
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
  
  // Channel
  getAblyChannel
};

// Re-export types with the correct syntax for isolatedModules
export type { ChatMessage, ConversationMetadata };
