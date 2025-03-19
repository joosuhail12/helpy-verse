
export type SortField = 'date' | 'priority' | 'status';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'expanded' | 'compact';

export interface Ticket {
  id: string;
  subject: string;
  customer: string;
  lastMessage: string;
  assignee: string | null;
  company: string;
  tags: string[];
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  isUnread?: boolean;
  hasNotification?: boolean;
  notificationType?: 'mention' | 'update' | 'assignment';
}
