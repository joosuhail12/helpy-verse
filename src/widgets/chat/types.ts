
export interface ThemeConfig {
  colors?: {
    primary?: string;
    primaryForeground?: string;
    background?: string;
    backgroundSecondary?: string;
    foreground?: string;
    border?: string;
    muted?: string;
    accent?: string;
    inputBackground?: string;
    userMessage?: string;
    userMessageText?: string;
    agentMessage?: string;
    agentMessageText?: string;
    error?: string;
    success?: string;
  };
  position?: 'left' | 'right';
  compact?: boolean;
  labels?: {
    welcomeTitle?: string;
    welcomeSubtitle?: string;
    placeholder?: string;
    sendButton?: string;
    noMessagesText?: string;
    recentMessagesTitle?: string;
    askQuestionButton?: string;
  };
  features?: {
    typingIndicator?: boolean;
    reactions?: boolean;
    fileAttachments?: boolean;
    readReceipts?: boolean;
  };
}

export interface ChatWidgetSettings {
  appearance?: {
    position?: 'left' | 'right';
    compact?: boolean;
    primaryColor?: string;
  };
  content?: {
    welcomeTitle?: string;
    welcomeSubtitle?: string;
  };
  features?: {
    enableTypingIndicator?: boolean;
    enableReactions?: boolean;
    enableFileAttachments?: boolean;
    enableReadReceipts?: boolean;
  };
}

export type View = 'home' | 'messages' | 'conversation';

export interface WidgetOptions {
  workspaceId: string;
  theme?: Partial<ThemeConfig>;
  settings?: Partial<ChatWidgetSettings>;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  conversationId: string;
  status: 'sent' | 'delivered' | 'read' | 'error';
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnailUrl?: string;
  uploadProgress?: number;
  status: 'uploading' | 'uploaded' | 'error';
}
