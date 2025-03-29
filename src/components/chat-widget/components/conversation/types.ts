
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date | string;
  conversationId: string;
  readBy?: string[];
  reactions?: Record<string, string[]>;
  attachments?: {
    id: string;
    url: string;
    name: string;
    type: string;
    size: number;
  }[];
  metadata?: Record<string, any>;
}

export interface ConversationViewProps {
  conversationId: string;
  workspaceId: string;
  onBack?: () => void;
}

// Adding the FileAttachment type that was missing
export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  thumbnailUrl?: string;
  uploadProgress?: number;
}

// Interface for Conversation with unreadCount
export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageTimestamp?: string | Date;
  unreadCount?: number;
  participants?: string[];
  type?: string;
  status?: 'open' | 'closed' | 'archived';
}
