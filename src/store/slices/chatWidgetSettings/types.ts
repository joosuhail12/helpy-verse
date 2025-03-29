
import { ThemeConfig } from '@/types/chat';

/**
 * Chat widget settings for the admin panel
 */
export interface ChatWidgetSettings {
  appearance: {
    primaryColor: string;
    position: 'right' | 'left';
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

/**
 * Maps settings to ThemeConfig for the widget
 */
export function mapSettingsToTheme(settings: ChatWidgetSettings): ThemeConfig {
  return {
    colors: {
      primary: settings.appearance.primaryColor
    },
    position: settings.appearance.position,
    compact: settings.appearance.compact,
    labels: {
      welcomeTitle: settings.content.welcomeTitle,
      welcomeSubtitle: settings.content.welcomeSubtitle
    },
    features: {
      typingIndicator: settings.features.enableTypingIndicator,
      reactions: settings.features.enableReactions,
      fileAttachments: settings.features.enableFileAttachments,
      readReceipts: settings.features.enableReadReceipts
    }
  };
}

export interface ChatWidgetSettingsState {
  settings: ChatWidgetSettings;
  loading: boolean;
  error: string | null;
  lastSaved: number | null;
}
