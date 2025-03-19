
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
}
