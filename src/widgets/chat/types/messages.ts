
/**
 * Message types for the chat widget
 */

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages?: Message[];
  lastMessage?: string;
  lastMessageTimestamp: string;
  unreadCount: number;
}
