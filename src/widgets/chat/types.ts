
/**
 * Core type definitions for the chat widget
 */

// Widget configuration for initialization
export interface WidgetOptions {
  workspaceId: string;
  theme?: Partial<ThemeConfig>;
  settings?: Partial<ChatWidgetSettings>;
  callbacks?: {
    onOpen?: () => void;
    onClose?: () => void;
    onMessageSent?: (message: ChatMessage) => void;
    onMessageReceived?: (message: ChatMessage) => void;
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

// Message structure
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | string;
  timestamp: string;
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

// Reexport from Redux to make it available as part of the public API
export interface ChatWidgetSettings {
  appearance: {
    primaryColor: string;
    position: 'left' | 'right';
    compact: boolean;
  };
  content: {
    welcomeTitle: string;
    welcomeSubtitle: string;
  };
  features: {
    enableTypingIndicator: boolean;
    enableReactions: boolean;
    enableFileAttachments: boolean;
    enableReadReceipts: boolean;
  };
}

// Navigation/view types
export type View = 'home' | 'messages' | 'conversation';
