
export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date | string;
  conversationId: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  readBy?: string[];
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
    size: number;
  }[];
  // Encryption fields
  encrypted?: boolean;
  encryptedContent?: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessageTimestamp: string;
  lastMessage?: string;
  unreadCount: number;
  // Encryption flag
  encrypted?: boolean;
}
