
// Define types for inbox components
export interface UserPresence {
  userId: string;
  name: string;
  lastActive: string;
  location?: {
    ticketId: string;
    area: string;
  };
  isTyping?: boolean;
  lastRead?: string;
}

export interface Message {
  id: string;
  text?: string;
  content?: string;
  sender: {
    id: string;
    name: string;
    type: 'agent' | 'customer' | 'system';
  } | string;
  timestamp: string;
  isCustomer?: boolean;
  type?: 'message' | 'internal_note';
  attachments?: Array<{
    id: string;
    url: string;
    type: string;
    name: string;
    size?: number;
  }>;
  status?: 'sent' | 'delivered' | 'read' | 'failed' | 'pending';
  readBy?: string[];
  reactions?: Record<string, string[]>;
}

export interface ConversationPanelProps {
  ticket: import('@/types/ticket').Ticket;
  onClose: () => void;
}
