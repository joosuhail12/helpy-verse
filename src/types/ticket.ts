
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
  recipients?: string[]; // Added recipients field
}
