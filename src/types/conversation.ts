
export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageTimestamp?: string;
  unreadCount: number;
  type?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  conversationId: string;
  readBy?: string[];
}
