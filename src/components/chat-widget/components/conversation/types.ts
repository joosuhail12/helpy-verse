
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  senderName?: string;
  timestamp: string | Date; // Allow both string and Date
  attachments?: Attachment[];
  reactions?: Record<string, string[]>; // Changed from Reaction[] to Record<emoji, userIds[]>
  read?: boolean;
  readBy?: string[];
  conversationId?: string;
  metadata?: Record<string, any>;
}

export interface Attachment {
  id: string;
  type: 'image' | 'file';
  url: string;
  name: string;
  size?: number;
  thumbnailUrl?: string;
}

// Changed to interface
export interface Reaction {
  emoji: string;
  userId: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: ChatMessage;
  lastMessageTimestamp?: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  type?: string;
}

export interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTyping?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  showAttachments?: boolean;
  disabled?: boolean;
}
