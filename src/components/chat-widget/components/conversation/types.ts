
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  senderName?: string;
  timestamp: string;
  attachments?: Attachment[];
  reactions?: Reaction[];
  read?: boolean;
  readBy?: string[];
  conversationId?: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'file';
  url: string;
  name: string;
  size?: number;
  thumbnailUrl?: string;
}

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
}

export interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTyping?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  showAttachments?: boolean;
}
