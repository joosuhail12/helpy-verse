
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system' | string;
  timestamp: string;
  conversationId: string;
  encrypted?: boolean;
  encryptedContent?: string;
  metadata?: Record<string, any>;
}

export interface MessageInputProps {
  onSendMessage: (content: string, attachments?: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
  onTyping?: () => void;
  encrypted?: boolean;
  attachments?: File[];
  onFileUpload?: (files: File[]) => void;
  onRemoveFile?: (file: File) => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  compact?: boolean;
  onHeightChange?: (height: number) => void;
  isRateLimited?: boolean;
  rateLimitTimeRemaining?: number;
}

export interface TypingUser {
  clientId: string;
  name?: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  encrypted?: boolean;
}
