
import { ThemeConfig } from '@/context/ThemeContext';

// View type for navigation
export type View = 'home' | 'messages' | 'conversation';

// Chat Widget Settings Interface
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

// Button Props Interface
export interface ToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
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

// Widget Options for external configuration
export interface WidgetOptions {
  workspaceId: string;
  theme?: {
    position?: 'left' | 'right';
    compact?: boolean;
    colors?: {
      primary?: string;
      [key: string]: string | undefined;
    };
  };
  settings?: Partial<ChatWidgetSettings>;
}

// Widget Props Interface for IsolatedChatWidget
export interface IsolatedChatWidgetProps {
  workspaceId: string;
  config?: any;
}

// DO NOT add global window interface declarations here to avoid conflicts
// These are now moved to src/types/globals.d.ts
