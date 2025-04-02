
/**
 * Common chat and conversation types used throughout the application
 */

export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: Date | string;
  conversationId: string;
  metadata?: Record<string, any>;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessageTimestamp: string;
  lastMessage?: string;
  unreadCount: number;
}
