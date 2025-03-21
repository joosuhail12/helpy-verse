
export interface Ticket {
  id: string;
  subject: string;
  customer: string;
  lastMessage: string;
  assignee: string | null;
  tags: string[];
  status: 'open' | 'pending' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt?: string;
  isUnread: boolean;
  recipients: string[];
  channel?: string;
  
  // Additional properties needed by components
  company?: string;
  hasNotification?: boolean;
  notificationType?: 'mention' | 'assignment';
  categories?: string[];
}

// Add types referenced in the code but not defined
export type SortField = 'createdAt' | 'priority' | 'status' | 'customer';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'list' | 'card' | 'compact';
