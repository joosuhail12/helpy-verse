
export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  attachments?: string[];
}

export interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  messages: Record<string, ChatMessage[]>;
  loading: boolean;
  error: string | null;
}
