
// Message sender types
export type MessageSender = 'user' | 'agent' | 'system' | string;

// Message status types
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed' | 'queued';

// Conversation type
export interface Conversation {
  id: string;
  title: string;
  lastMessageTimestamp: string;
  lastMessage?: string;
  unreadCount: number;
  encrypted?: boolean;
  participants?: string[];
  metadata?: Record<string, any>;
}

// Chat message type
export interface ChatMessage {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: string;
  conversationId: string;
  status?: MessageStatus;
  encrypted?: boolean;
  encryptedContent?: string;
  metadata?: Record<string, any>;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
}

// Typing indicator user type
export interface TypingUser {
  clientId: string;
  name?: string;
  timestamp: number;
}

// Message reaction type
export interface MessageReaction {
  messageId: string;
  userId: string;
  username?: string;
  emoji: string;
  timestamp: string;
}

// Read receipt type
export interface ReadReceipt {
  messageId: string;
  userId: string;
  username?: string;
  timestamp: string;
}

// New interfaces for component props
export interface TypingIndicatorProps {
  typingUsers: TypingUser[];
  agentName?: string;
  compact?: boolean;
  className?: string;
}

export interface EnhancedTypingIndicatorProps {
  typingUsers: TypingUser[];
  agentName?: string;
  compact?: boolean;
  className?: string;
}

export interface MessageSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  currentResult: number;
  onNavigate: (direction: 'next' | 'prev') => void;
}

export interface MessageInputProps {
  onSendMessage: (content: string, attachments?: File[]) => Promise<void>;
  disabled?: boolean;
  encrypted?: boolean;
  attachments?: File[];
  isRateLimited?: boolean;
  rateLimitTimeRemaining?: number;
  placeholder?: string;
}

export interface MessageListProps {
  messages: ChatMessage[];
  conversationId: string;
  isLoading?: boolean;
  encrypted?: boolean;
  showAvatars?: boolean;
  showReactions?: boolean;
  showReadReceipts?: boolean;
  useVirtualization?: boolean;
  typingUsers?: TypingUser[];
}

export interface MessageItemProps {
  message: ChatMessage;
  encrypted?: boolean;
  showReadReceipt?: boolean;
  showReactions?: boolean;
}

export interface UseChatOptions {
  conversationId: string;
  enableEncryption?: boolean;
}

