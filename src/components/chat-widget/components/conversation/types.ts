
export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date | string;
  conversationId: string;
  metadata?: Record<string, any>;
  attachments?: FileAttachment[];
  reactions?: Record<string, string[]>;
  readBy?: string[];
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

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}
