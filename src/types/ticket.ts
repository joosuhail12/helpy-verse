
export type SortField = 'subject' | 'customer' | 'assignee' | 'status' | 'priority' | 'createdAt';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'list' | 'grid' | 'compact' | 'card';

export interface Ticket {
  id: string;
  subject: string;
  customer: string;
  lastMessage: string;
  assignee: string | null;
  company: string;
  tags: string[];
  status: 'open' | 'pending' | 'closed';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  isUnread: boolean;
  hasNotification?: boolean;
  notificationType?: 'mention' | 'assignment' | 'reply';
  recipients: string[];
  channel?: string;
}

export interface TicketFormData {
  subject: string;
  message: string;
  recipients: string[];
  priority: string;
  status: string;
  assigneeId?: string;
  channelId?: string;
  tags?: string[];
  attachments?: File[];
}

export interface TicketChannel {
  id: string;
  name: string;
  type: 'email' | 'chat' | 'social';
  icon?: string;
}

export interface TicketFilter {
  status?: string[];
  priority?: string[];
  assignee?: string[];
  tags?: string[];
  dateRange?: [Date | null, Date | null];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  teamId: string;
  teamName: string;
}
