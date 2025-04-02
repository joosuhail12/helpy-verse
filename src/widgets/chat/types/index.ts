
/**
 * Types for the chat widget
 */

export type View = 'home' | 'messages' | 'conversation';

export interface ThemeConfig {
  colors?: {
    primary?: string;
    primaryForeground?: string;
    background?: string;
    foreground?: string;
    border?: string;
    userMessage?: string;
    userMessageText?: string;
    agentMessage?: string;
    agentMessageText?: string;
    inputBackground?: string;
    error?: string;
    success?: string;
    warning?: string;
  };
  position?: 'left' | 'right' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  compact?: boolean;
}

export interface ChatWidgetSettings {
  appearance: {
    primaryColor: string;
    position: 'left' | 'right' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
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

export interface WidgetOptions {
  workspaceId: string;
  theme?: Partial<ThemeConfig>;
  settings?: Partial<ChatWidgetSettings>;
  standalone?: boolean;
  instanceId?: string;
}

export * from './messages';
