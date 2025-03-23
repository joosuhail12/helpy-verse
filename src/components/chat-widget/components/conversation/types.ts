
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
}

export interface ConversationViewProps {
  conversationId: string;
  onBack?: () => void;
}
