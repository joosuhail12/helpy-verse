
export interface ChatWidgetSettings {
  primaryColor: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  position: 'right' | 'left';
  compact: boolean;
  enableTypingIndicator: boolean;
  enableReactions: boolean;
  enableFileAttachments: boolean;
  enableReadReceipts: boolean;
}

export interface ChatWidgetSettingsState {
  settings: ChatWidgetSettings;
  loading: boolean;
  error: string | null;
  lastSaved: number | null;
}
