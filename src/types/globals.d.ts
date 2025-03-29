
interface Window {
  PULLSE_WORKSPACE_ID?: string;
  PULLSE_THEME?: 'light' | 'dark';
  PULLSE_POSITION?: 'left' | 'right';
  PULLSE?: {
    [key: string]: any;
    initializeWidget: (config: any) => void;
  };
  PULLSE_CHAT_CONFIG?: {
    workspaceId: string;
    theme?: {
      colors?: {
        primary?: string;
        background?: string;
        foreground?: string;
        userMessage?: string;
        agentMessage?: string;
        error?: string;
        success?: string;
        warning?: string;
        [key: string]: string | undefined;
      };
      position?: 'left' | 'right';
      compact?: boolean;
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
    settings?: any;
    callbacks?: {
      onOpen?: () => void;
      onClose?: () => void;
      onMessageSent?: (message: any) => void;
      onMessageReceived?: (message: any) => void;
    };
  };
}
