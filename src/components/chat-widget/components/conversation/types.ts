
export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date | string;
  conversationId: string;
  metadata?: Record<string, any>;
}

export interface Conversation {
  id: string;
  title?: string;
  lastMessage?: string;
  lastMessageTimestamp?: string;
  unreadCount?: number;
}

export interface TypingStatus {
  userId: string;
  username: string;
  isTyping: boolean;
}
