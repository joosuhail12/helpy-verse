
// Define ticket types
export type SortField = 'subject' | 'customer' | 'priority' | 'status' | 'createdAt' | 'assignee' | 'company';
export type ViewMode = 'detailed' | 'compact' | 'list';

export interface Ticket {
  id: string;
  subject: string;
  customer: string;
  lastMessage: string;
  assignee: string | null;
  company: string;
  tags: string[];
  status: 'open' | 'pending' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt?: string;
  isUnread?: boolean;
  hasNotification?: boolean;
  notificationType?: 'mention' | 'assignment';
  recipients: string[];
  categories?: string[];
  channel?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  teamId: string;
  teamName: string;
}
