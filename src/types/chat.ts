
/**
 * Core chat widget type definitions with inheritance structure
 */

// Base entity with shared properties
export interface BaseEntity {
  id: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Base message for all communication types
export interface BaseMessage extends BaseEntity {
  content: string;
  sender: string;
  timestamp: string | Date;
  metadata?: Record<string, any>;
}

// Base user type with shared properties
export interface BaseUser extends BaseEntity {
  name?: string;
  avatar?: string;
  email?: string;
}

// User presence information
export interface UserPresence extends Pick<BaseUser, 'id' | 'name'> {
  lastActive: string | Date;
  status?: 'online' | 'offline' | 'away' | 'busy';
  isTyping?: boolean;
  location?: {
    area: string;
    itemId?: string;
  };
}

// Notification types
export type NotificationType = 'message' | 'status' | 'system' | 'error';

export interface Notification extends BaseEntity {
  type: NotificationType;
  content: string;
  read?: boolean;
  userId?: string;
  itemId?: string;
  context?: string;
}

// Conversation/thread model
export interface Conversation extends BaseEntity {
  title?: string;
  lastMessage?: string;
  lastMessageTimestamp?: string | Date;
  unreadCount?: number;
  participants?: string[];
  type?: string;
  status?: 'open' | 'closed' | 'archived';
}

// File attachment type
export interface FileAttachment extends BaseEntity {
  name: string;
  type: string;
  url: string;
  size: number;
  thumbnailUrl?: string;
  uploadProgress?: number;
}

// Reactions to messages
export interface Reaction {
  emoji: string;
  userId: string;
  timestamp: string | Date;
}

// Message with all rich features
export interface ChatMessage extends BaseMessage {
  conversationId: string;
  attachments?: FileAttachment[];
  reactions?: Record<string, string[]>;
  readBy?: string[];
  edited?: boolean;
  delivered?: boolean;
  isInternalNote?: boolean;
}

// Typing indicator status
export interface TypingStatus {
  userId: string;
  username: string;
  isTyping: boolean;
  timestamp: number;
}

// Agent information
export interface Agent extends BaseUser {
  role?: string;
  department?: string;
  isAvailable?: boolean;
  lastActiveTime?: string | Date;
}

// Widget configuration types
export interface ThemeConfig {
  colors?: {
    primary?: string;
    background?: string;
    foreground?: string;
    userMessage?: string;
    agentMessage?: string;
    error?: string;
    success?: string;
    warning?: string;
  };
  position?: 'left' | 'right';
  compact?: boolean;
  labels?: {
    welcomeTitle?: string;
    welcomeSubtitle?: string;
    sendButton?: string;
    placeholder?: string;
  };
  features?: {
    typingIndicator?: boolean;
    reactions?: boolean;
    fileAttachments?: boolean;
    readReceipts?: boolean;
  };
}
