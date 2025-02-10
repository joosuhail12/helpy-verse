
import type { Ticket } from '@/types/ticket';

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isCustomer: boolean;
  readBy?: string[];
}

export interface ConversationPanelProps {
  ticket: Ticket;
  onClose: () => void;
}

