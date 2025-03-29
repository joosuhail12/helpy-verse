
/**
 * Widget configuration and props types
 */
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import { ThemeConfig } from '@/context/ThemeContext';

export interface ChatWidgetProps {
  workspaceId: string;
  theme?: Partial<ThemeConfig>;
  settings?: Partial<ChatWidgetSettings>;
}

export interface IsolatedChatWidgetProps {
  workspaceId: string;
  config?: any;
}

export type View = 'home' | 'messages' | 'conversation';

export interface ChatWidgetContainerProps {
  onClose: () => void;
  workspaceId: string;
  position?: 'left' | 'right';
  compact?: boolean;
}

export interface ToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}
