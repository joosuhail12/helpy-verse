
export interface Ticket {
  id: string;
  subject: string;
  customer: string;
  lastMessage: string;
  assignee: string | null;
  company?: string;
  tags: string[];
  status: 'open' | 'pending' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  isUnread?: boolean;
  hasNotification?: boolean;
  notificationType?: 'mention' | 'assignment';
  recipients?: string[]; 
}

// Add missing type exports
export type SortField = 'createdAt' | 'lastMessage' | 'customer' | 'subject' | 'priority' | 'status';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'list' | 'card';

