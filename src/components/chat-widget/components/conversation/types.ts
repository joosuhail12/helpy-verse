
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  attachments?: {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
  metadata?: Record<string, any>;
  // Adding properties for encryption support
  encrypted?: boolean;
  encryptedContent?: string;
  // Adding property for conversation ID
  conversationId?: string;
}

export interface MessageInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  placeholder?: string;
  disabled?: boolean;
  attachments?: File[];
  onFileUpload?: (files: File[]) => void;
  onRemoveFile?: (file: File) => void;
  showAttachments?: boolean;
  compact?: boolean;
  onHeightChange?: (height: number) => void;
  encrypted?: boolean;
  onTyping?: () => void;
}

export interface ChatAvatarProps {
  name: string;
  status?: 'online' | 'offline' | 'away';
  size?: 'sm' | 'md' | 'lg';
  src?: string;
}

export interface UserAvatarProps {
  name: string;
  userId?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  src?: string;
  status?: 'online' | 'offline' | 'away';
}

export interface Conversation {
  id: string;
  title: string;
  lastMessageTimestamp: string;
  lastMessage?: string;
  unreadCount: number;
  participants?: string[];
  encrypted?: boolean;
  type?: string;
}

export interface MessageSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export interface TypingIndicatorProps {
  users: string[] | TypingUser[];
  compact?: boolean;
}

export interface TypingUser {
  clientId: string;
  name?: string;
  timestamp: number;
}

export interface ThemeConfig {
  colors: {
    primary: string;
    primaryForeground: string;
    background: string;
    backgroundSecondary: string;
    foreground: string;
    border: string;
    userMessage: string;
    userMessageText: string;
    agentMessage: string;
    agentMessageText: string;
    inputBackground: string;
    muted: string;
    mutedForeground: string;
    secondary: string;
    secondaryForeground: string;
    outgoingMessage: string;
    outgoingMessageForeground: string;
    incomingMessage: string;
    incomingMessageForeground: string;
  };
  position?: 'left' | 'right';
  compact?: boolean;
  labels?: {
    welcomeTitle?: string;
    welcomeSubtitle?: string;
    askQuestionButton?: string;
    recentMessagesTitle?: string;
    noMessagesText?: string;
    messagePlaceholder?: string;
  };
}

export interface EnhancedConversationViewProps {
  conversationId: string;
  showSearch?: boolean;
  showAttachments?: boolean;
  showReactions?: boolean;
  showReadReceipts?: boolean;
  encrypted?: boolean;
}

export interface ConversationViewProps {
  conversationId: string;
  showAvatars?: boolean;
  onSendMessage?: (content: string, attachments?: File[]) => void;
  encrypted?: boolean;
  workspaceId?: string;
  onBack?: () => void;
}

export interface ResponsiveConversationViewProps {
  conversationId: string;
  compact?: boolean;
  workspaceId?: string;
  onBack?: () => void;
}
