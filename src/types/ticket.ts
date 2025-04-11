import { Message } from "@/components/inbox/types";

export interface Ticket {
  id: string;
  ticket_sno?: string;
  sno?: number;
  subject: string;
  customer?: string;
  customerId?: string;
  lastMessage: string;
  assignee: string | null;
  assigneeId?: string;
  company: string;
  tags: string[];
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  isUnread?: boolean;
  updatedAt?: string;
  assigneeAvatar?: string;
  categories?: string[];
  hasNotification?: boolean;
  notificationType?: 'mention' | 'update' | 'assignment' | 'new_response' | 'new_ticket';
  language?: string;
  typeId?: string;
  teamId?: string;
  externalId?: string;
  description?: string;
  summary?: string;
  conversation?: Message[];
}

export type SortField = 'date' | 'priority' | 'status';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'compact' | 'expanded';
