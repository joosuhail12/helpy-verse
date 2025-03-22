
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed' | 'sending' | 'queued';
  reactions?: Record<string, string[]>;
  attachments?: Array<{
    url: string;
    type: string;
    name: string;
    size?: number;
  }>;
  richContent?: {
    type: 'form' | 'url' | 'product';
    data: any;
  };
}

export interface ConversationViewProps {
  conversationId: string;
  onBack?: () => void;
}
