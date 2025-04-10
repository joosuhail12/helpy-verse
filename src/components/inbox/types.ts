
import type { Ticket } from '@/types/ticket';

export interface UserPresence {
  userId: string;
  name: string;
  lastActive: string;
  location?: {
    ticketId: string;
    area: string;
  };
}

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isCustomer: boolean;
  readBy?: string[];
  reactions?: Record<string, string[]>;
  type?: 'message' | 'internal_note';
}

export interface ConversationPanelProps {
  ticket: Ticket;
  onClose: () => void;
}
