
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
  // Theme settings
  backgroundColor: string;
  backgroundSecondary: string;
  foregroundColor: string;
  userMessageColor: string;
  agentMessageColor: string;
  borderColor: string;
}

export interface ChatWidgetSettingsState {
  settings: ChatWidgetSettings;
  loading: boolean;
  error: string | null;
  lastSaved: number | null;
}
