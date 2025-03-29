
/**
 * Theme configuration types for the chat widget
 */
import { ThemeConfig as ContextThemeConfig } from '@/context/ThemeContext';
import { ThemeConfig as ApiThemeConfig } from '@/api/chat-widget/types';

export { ContextThemeConfig, ApiThemeConfig };

export interface WidgetThemeProps {
  position?: 'left' | 'right';
  compact?: boolean;
  theme?: Partial<ContextThemeConfig>;
}
