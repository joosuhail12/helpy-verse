export interface Ticket {
  id: string;
  subject: string;
  customer?: string;
  customerId?: string;
  lastMessage: string;
  assignee: string | null;
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
}

export type SortField = 'date' | 'priority' | 'status';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'compact' | 'expanded';
