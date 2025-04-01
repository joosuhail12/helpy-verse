export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: string | Date;
  conversationId: string;
  status?: 'sent' | 'delivered' | 'read' | 'error';
  readBy?: string[];
  attachment?: {
    url: string;
    name: string;
    type: string;
    size: number;
  };
  attachments?: FileAttachment[];
  reactions?: {
    type: string;
    count: number;
    userReacted: boolean;
  }[];
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

export interface TypingUser {
  clientId: string;
  name?: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageTimestamp?: string;
  unreadCount?: number;
  participants?: string[];
  type?: string;
  status?: 'active' | 'resolved' | 'pending';
}
