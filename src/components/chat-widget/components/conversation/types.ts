
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: string;
  conversationId: string;
  status?: 'sent' | 'delivered' | 'read' | 'error';
  attachment?: {
    url: string;
    name: string;
    type: string;
    size: number;
  };
  reactions?: {
    type: string;
    count: number;
    userReacted: boolean;
  }[];
}

export interface TypingUser {
  clientId: string;
  name?: string;
}
