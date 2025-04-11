import { Message } from "@/components/inbox/types";

export interface Ticket {
  id: string;
  ticket_sno?: string;
  sno?: number;
  subject: string;
  description?: string | null;
  customer?: string | {
    id?: string;
    name?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    type?: string;
    title?: string;
    department?: string;
    company?: string;
    [key: string]: any; // For additional properties
  };
  customerId?: string;
  lastMessage: string;
  assignee: string | null;
  assigneeId?: string;
  company: string;
  tags: string[];
  status: 'open' | 'closed' | 'pending';
  statusType?: string | null;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  isUnread?: boolean;
  updatedAt?: string;
  closedAt?: string | null;
  assigneeAvatar?: string;
  categories?: string[];
  hasNotification?: boolean;
  notificationType?: 'mention' | 'update' | 'assignment' | 'new_response' | 'new_ticket';
  language?: string;
  type?: string;
  typeId?: string;
  teamId?: string;
  lastMessageAt?: string;
  lastMessageBy?: string | null;
  messageCount?: number;
  channel?: string | null;
  device?: string | null;
  externalId?: string;
  threadId?: string;
  intents?: string | null;
  summary?: string;
  conversation?: Message[];
  customFields?: Record<string, any>;
  topicIds?: string[];
  mentionIds?: string[];
  reopenInfo?: any | null;
  recipients?: string[];
  assigneeStatus?: string;
}

export type SortField = 'date' | 'priority' | 'status';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'compact' | 'expanded';
