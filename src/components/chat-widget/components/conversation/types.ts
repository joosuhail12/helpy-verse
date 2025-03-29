
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'system';
  timestamp: Date | string;
  conversationId: string;
  attachments?: {
    id: string;
    url: string;
    name: string;
    type: string;
    size: number;
  }[];
  metadata?: Record<string, any>;
}

export interface ConversationViewProps {
  conversationId: string;
  workspaceId: string;
  onBack?: () => void;
}
