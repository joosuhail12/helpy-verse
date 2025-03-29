
/**
 * Type definitions for the Chat Widget API
 */

// Configuration for initializing the chat widget
export interface ChatWidgetConfig {
  workspaceId: string;
  theme?: Partial<ThemeConfig>;
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
  events?: {
    onMessageSent?: (message: ChatMessage) => void;
    onMessageReceived?: (message: ChatMessage) => void;
    onWidgetOpened?: () => void;
    onWidgetClosed?: () => void;
  };
}

// Theme configuration
export interface ThemeConfig {
  colors?: {
    primary?: string;
    background?: string;
    foreground?: string;
    userMessage?: string;
    agentMessage?: string;
  };
  position?: 'left' | 'right';
  compact?: boolean;
}

// Message structure
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | string;
  timestamp: string | Date;
  conversationId: string;
  attachments?: FileAttachment[];
  reactions?: Record<string, string[]>;
  readBy?: string[];
  metadata?: Record<string, any>;
}

// File attachment structure
export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  thumbnailUrl?: string;
  uploadProgress?: number;
}

// Status of the chat widget
export interface ChatWidgetStatus {
  isOpen: boolean;
  isConnected: boolean;
  unreadCount: number;
}
