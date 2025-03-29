
interface Window {
  PULLSE_WORKSPACE_ID?: string;
  PULLSE_THEME?: 'light' | 'dark';
  PULLSE_POSITION?: 'left' | 'right';
  PULLSE_CHAT_CONFIG?: {
    workspaceId: string;
    theme?: {
      colors?: {
        primary?: string;
        background?: string;
        foreground?: string;
        userMessage?: string;
        agentMessage?: string;
        [key: string]: string | undefined;
      };
      position?: 'left' | 'right';
      compact?: boolean;
    };
    labels?: {
      welcomeTitle?: string;
      welcomeSubtitle?: string;
      sendButton?: string;
      placeholder?: string;
    };
    features?: {
      typingIndicator?: boolean;
      reactions?: boolean;
      fileAttachments?: boolean;
      readReceipts?: boolean;
    };
  };
  PULLSE?: {
    initializeWidget: (config: any) => void;
  };
}
