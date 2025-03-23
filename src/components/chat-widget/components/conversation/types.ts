
export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  conversationId: string;
}
