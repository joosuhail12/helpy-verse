
/**
 * Types related to chat messages
 */
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date | string;
  conversationId: string;
  readBy?: string[];
  reactions?: Record<string, string[]>;
  attachments?: FileAttachment[];
  metadata?: Record<string, any>;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  thumbnailUrl?: string;
  uploadProgress?: number;
}

export interface TypingIndicator {
  userId: string;
  name: string;
  isTyping: boolean;
  timestamp: number;
}
