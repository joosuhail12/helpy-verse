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

  colors: {
    background: string;
    backgroundSecondary: string;
    foreground: string;
    border: string;
    userMessage: {
      background: string;
      text: string;
    };
    agentMessage: {
      background: string;
      text: string;
    };
    input: {
      background: string;
      text: string;
      border: string;
    };
    button: {
      background: string;
      text: string;
      hover: string;
    };
  };

  typography: {
    fontFamily: string;
    fontSize: {
      small: string;
      medium: string;
      large: string;
    };
  };

  layout: {
    borderRadius: {
      small: string;
      medium: string;
      large: string;
    };
    spacing: {
      small: string;
      medium: string;
      large: string;
    };
  };
}

export interface ChatWidgetSettingsState {
  settings: ChatWidgetSettings;
  loading: boolean;
  error: string | null;
  lastSaved: number | null;
}
