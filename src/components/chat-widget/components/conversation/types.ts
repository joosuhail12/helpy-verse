
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
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
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

export interface MessageSearchResult {
  messageId: string;
  conversationId: string;
  snippet: string;
  timestamp: string | Date;
  highlight: [number, number][];
}
