
/**
 * Message-related type definitions
 */

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: string;
  conversationId: string;
  status?: 'sent' | 'delivered' | 'read' | 'error';
}

export interface Conversation {
  id: string;
  title?: string;
  lastMessage?: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  type?: string;
}
