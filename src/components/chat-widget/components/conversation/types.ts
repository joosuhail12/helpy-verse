
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system' | string;
  timestamp: string;
  conversationId: string;
  encrypted?: boolean;
  encryptedContent?: string;
  metadata?: Record<string, any>;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  attachments?: {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
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

export interface EnhancedConversationViewProps {
  conversationId: string;
  showSearch?: boolean;
  showAttachments?: boolean;
  showReactions?: boolean;
  showReadReceipts?: boolean;
  encrypted?: boolean;
  virtualized?: boolean;
}

export interface UserAvatarProps {
  name?: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'away' | 'busy';
  userId?: string; // Add missing property
  color?: string; // Add missing property
}

export interface TypingIndicatorProps {
  users: TypingUser[];
  className?: string;
}

