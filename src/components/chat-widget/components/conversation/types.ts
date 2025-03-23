
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date | string;
  read?: boolean;
  metadata?: Record<string, any>;
  userId?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date | string;
  read?: boolean;
  metadata?: Record<string, any>;
}

export interface Conversation {
  id: string;
  title?: string;
  lastMessage?: string;
  lastMessageTimestamp?: Date | string;
  unreadCount?: number;
}

export interface TypingStatus {
  userId: string;
  username: string;
  isTyping: boolean;
}
