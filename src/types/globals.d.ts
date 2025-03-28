
interface Window {
  PULLSE_WORKSPACE_ID?: string;
  PULLSE_THEME?: 'light' | 'dark';
  PULLSE_POSITION?: 'left' | 'right';
  PULLSE_ALLOWED_ORIGINS?: string[];
  PULLSE_CHAT_CONFIG?: {
    workspaceId: string;
    allowedOrigins?: string[];
    theme: {
      colors?: Record<string, string>;
      position?: 'left' | 'right';
      compact?: boolean;
      labels?: Record<string, string>;
      features?: {
        typingIndicator?: boolean;
        reactions?: boolean;
        fileAttachments?: boolean;
        readReceipts?: boolean;
      };
    };
  };
}
