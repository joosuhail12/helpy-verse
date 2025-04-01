
import { ThemeConfig } from '@/context/ThemeContext';

export type View = 'home' | 'messages' | 'conversation';

export interface ChatWidgetSettings {
  appearance: {
    primaryColor: string;
    position: 'left' | 'right';
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
  }
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageTimestamp: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
  attachments?: Array<{
    id: string;
    filename: string;
    url: string;
    type: string;
  }>;
  isRead?: boolean;
}
