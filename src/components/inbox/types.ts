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

export interface ReadReceipt {
  userId: string;
  name: string;
  readAt: string;
}

export interface Message {
  id: string;
  content: string;
  sender: string;
  senderName?: string;
  timestamp: string;
  isCustomer: boolean;
  readBy?: Array<ReadReceipt | string>;
  lastReadAt?: string;
  reactions?: Record<string, string[]>;
  type?: 'message' | 'internal_note';
}

export interface ConversationPanelProps {
  ticket: Ticket;
  onClose: () => void;
}
