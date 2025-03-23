
export interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'closed' | 'pending' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: TeamMember | null;
  customer: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  company?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  lastActivity?: string;
  tags?: string[];
  channel?: string;
  firstResponseTime?: number;
  responseCount?: number;
  messageCount?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  teamId?: string;
  teamName?: string;
}
