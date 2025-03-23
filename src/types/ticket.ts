
export interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'closed' | 'pending' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: TeamMember | null;
  customer: Customer;
  company?: Company;
  createdAt: string;
  updatedAt: string;
  lastActivity?: string;
  tags?: string[];
  channel?: string;
  firstResponseTime?: number;
  responseCount?: number;
  messageCount?: number;
  // Additional properties used in UI components
  lastMessage?: string;
  isUnread?: boolean;
  hasNotification?: boolean;
  notificationType?: 'mention' | 'assignment';
  recipients?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  teamId?: string;
  teamName?: string;
  // Add toString method for comparison operations
  toString(): string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  toString(): string;
}

export interface Company {
  id: string;
  name: string;
  toString(): string;
}

export type ViewMode = 'compact' | 'detailed' | 'list';
export type SortField = 'createdAt' | 'updatedAt' | 'priority' | 'status' | 'subject' | 'customer' | 'company' | 'assignee';

// Helper function to convert simple string to Customer object
export const stringToCustomer = (str: string): Customer => {
  return {
    id: str,
    name: str,
    email: `${str.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    toString() { return this.name; }
  };
};

// Helper function to convert simple string to Company object
export const stringToCompany = (str: string): Company => {
  return {
    id: str,
    name: str,
    toString() { return this.name; }
  };
};

// Helper function to convert simple string to TeamMember object
export const stringToTeamMember = (str: string): TeamMember => {
  return {
    id: str,
    name: str,
    email: `${str.toLowerCase().replace(/\s+/g, '.')}@company.com`,
    toString() { return this.name; }
  };
};
