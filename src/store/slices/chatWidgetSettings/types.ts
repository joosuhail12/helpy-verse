
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

export interface ChatWidgetSettingsState {
  settings: ChatWidgetSettings;
  loading: boolean;
  error: string | null;
  lastSaved: number | null;
}
