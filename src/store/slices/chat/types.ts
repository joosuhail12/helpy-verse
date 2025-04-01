
export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  type?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date | string;
  status?: 'sent' | 'delivered' | 'read';
  attachments?: string[];
  readBy?: string[];
  reactions?: Record<string, string[]>;
}

export interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  messages: Record<string, ChatMessage[]>;
  loading: boolean;
  error: string | null;
  workspaceId?: string;
}

// Add type for typing indicators
export interface TypingUser {
  clientId: string;
  name?: string;
}
