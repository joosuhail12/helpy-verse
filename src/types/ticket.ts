
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'pending' | 'closed' | 'resolved';
export type SortField = 'subject' | 'customer' | 'company' | 'priority' | 'status' | 'createdAt' | 'updatedAt' | 'assignee';
export type ViewMode = 'detailed' | 'compact';
export type NotificationType = 'mention' | 'assignment' | 'update';

export interface Customer {
  id?: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Company {
  id?: string;
  name: string;
  logo?: string;
}

export interface TeamMember {
  id?: string;
  name: string;
  email?: string;
  avatar?: string;
  teamId?: string;
  teamName?: string;
}

export interface Ticket {
  id: string;
  subject: string;
  customer: Customer | string;
  lastMessage: string;
  assignee: TeamMember | string | null;
  company: Company | string;
  tags: string[];
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  isUnread: boolean;
  hasNotification?: boolean;
  notificationType?: NotificationType;
  recipients: string[];
  channel?: string;
}

export interface Message {
  id: string;
  ticketId: string;
  content: string;
  sender: TeamMember | Customer | string;
  timestamp: string;
  isInternalNote?: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface ConversationPanelProps {
  ticket: Ticket;
  onClose: () => void;
}

export const stringToCustomer = (name: string): Customer => {
  return {
    id: name.toLowerCase().replace(' ', '-'),
    name,
    email: name.toLowerCase().replace(' ', '.') + '@example.com'
  };
};

export const stringToCompany = (name: string): Company => {
  return {
    id: name.toLowerCase().replace(' ', '-'),
    name
  };
};

export const stringToTeamMember = (name: string): TeamMember => {
  return {
    id: name.toLowerCase().replace(' ', '-'),
    name,
    email: name.toLowerCase().replace(' ', '.') + '@company.com'
  };
};
