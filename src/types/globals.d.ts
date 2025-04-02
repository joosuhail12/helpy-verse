
import { WidgetOptions } from '@/widgets/chat/types';

declare global {
  interface Window {
    PULLSE_WORKSPACE_ID?: string;
    PULLSE_THEME?: 'light' | 'dark';
    PULLSE_POSITION?: 'left' | 'right';
    PULLSE?: {
      [key: string]: any;
      initializeWidget: (options: WidgetOptions) => void;
      openWidget?: () => void;
      closeWidget?: () => void;
      toggleWidget?: () => void;
    };
    PULLSE_CHAT_CONFIG?: WidgetOptions;
  }
}

export {};
