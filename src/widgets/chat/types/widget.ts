
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import { ApiThemeConfig as ThemeConfig } from './theme';

export interface WidgetOptions {
  workspaceId: string;
  theme?: Partial<ThemeConfig>;
  settings?: Partial<ChatWidgetSettings>;
  callbacks?: {
    onOpen?: () => void;
    onClose?: () => void;
    onMessageSent?: (message: any) => void;
    onMessageReceived?: (message: any) => void;
  };
}

export interface IsolatedChatWidgetProps {
  workspaceId: string;
  config?: any;
}

export interface WidgetState {
  isOpen: boolean;
  isInitialized: boolean;
  messages: any[];
  attachments: any[];
  config: WidgetOptions | null;
  theme: {
    colors: {
      primary: string;
      background?: string;
      foreground?: string;
      userMessage?: string;
      agentMessage?: string;
    };
    position: 'left' | 'right';
    compact: boolean;
  };
}
