
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
  headerTitle: string;
  headerColor: string;
  launcherStyle: 'circle' | 'rectangle';
  messageBoxColor: string;
  userMessageColor: string;
  agentMessageColor: string;
  fontFamily: string;
}

export interface ChatWidgetSettingsState {
  settings: ChatWidgetSettings;
  loading: boolean;
  error: string | null;
  lastSaved: number | null;
}
