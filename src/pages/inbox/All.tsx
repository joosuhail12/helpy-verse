import { useEffect, useState } from 'react';
import TicketList from '@/components/inbox/TicketList';
import { setWorkspaceId } from '@/utils/helpers/helpers';
const ITEMS_PER_PAGE = 5;

const tickets = [
  {
    id: '1',
    subject: 'Cannot access my account',
    customer: '7206e9f7-010d-41f1-a592-1aa89cb77e95',
    lastMessage: "I've been trying to log in for the past hour but keep getting an error message. Can someone help?",
    assignee: 'Sarah Wilson',
    company: 'Acme Corp',
    workspaceId: '6c22b22f-7bdf-43db-b7c1-9c5884125c63',
    clientId: 'e63d6f79-3966-4716-9231-f4a312e247e1',
    tags: ['login', 'urgent'],
    status: 'open',
    priority: 'high',
    createdAt: '2024-03-15T10:00:00Z',
    isUnread: true,
    hasNotification: true,
    notificationType: 'mention',
  },
  {
    id: '2',
    subject: 'How do I reset my password?',
    customer: 'Jane Smith',
    lastMessage: "I forgot my password and need help resetting it. I've tried the 'forgot password' link but haven't received any email.",
    assignee: null,
    company: 'TechStart Inc',
    workspaceId: '6c22b22f-7bdf-43db-b7c1-9c5884125c63',
    clientId: 'e63d6f79-3966-4716-9231-f4a312e247e1',
    tags: ['password-reset'],
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-03-14T15:30:00Z',
    isUnread: false,
    hasNotification: true,
    notificationType: 'assignment',
  },
  {
    id: '3',
    subject: 'Billing inquiry',
    customer: 'Robert Johnson',
    lastMessage: 'I have a question about my last invoice. There seems to be a discrepancy in the charges.',
    assignee: 'Mike Thompson',
    company: 'Global Solutions',
    workspaceId: '6c22b22f-7bdf-43db-b7c1-9c5884125c63',
    clientId: 'e63d6f79-3966-4716-9231-f4a312e247e1',
    tags: ['billing', 'invoice'],
    status: 'closed',
    priority: 'low',
    createdAt: '2024-03-13T09:15:00Z',
    isUnread: false,
  },
  {
    id: '4',
    subject: 'Feature request: Dark mode',
    customer: 'Emily Chen',
    lastMessage: 'Would it be possible to add a dark mode option to the dashboard? It would help reduce eye strain during night shifts.',
    assignee: null,
    company: 'NightWatch Security',
    workspaceId: '6c22b22f-7bdf-43db-b7c1-9c5884125c63',
    clientId: 'e63d6f79-3966-4716-9231-f4a312e247e1',
    tags: ['feature-request', 'ui'],
    status: 'open',
    priority: 'low',
    createdAt: '2024-03-12T22:45:00Z',
    isUnread: true,
  },
  {
    id: '5',
    subject: 'Integration issues with API',
    customer: 'David Lee',
    lastMessage: 'The API endpoints are returning 404 errors since this morning. This is blocking our development process.',
    assignee: null,
    company: 'DevTech Solutions',
    workspaceId: '6c22b22f-7bdf-43db-b7c1-9c5884125c63',
    clientId: 'e63d6f79-3966-4716-9231-f4a312e247e1',
    tags: ['api', 'urgent', 'bug'],
    status: 'open',
    priority: 'high',
    createdAt: '2024-03-15T08:15:00Z',
    isUnread: true,
  },
  {
    id: '6',
    subject: 'Export functionality not working',
    customer: 'Maria Garcia',
    lastMessage: 'When trying to export reports to CSV, nothing happens. This worked yesterday.',
    assignee: 'Tom Wilson',
    company: 'DataAnalytics Pro',
    workspaceId: '6c22b22f-7bdf-43db-b7c1-9c5884125c63',
    clientId: 'e63d6f79-3966-4716-9231-f4a312e247e1',
    tags: ['bug', 'export', 'reports'],
    status: 'pending',
    priority: 'high',
    createdAt: '2024-03-15T09:30:00Z',
    isUnread: true,
  },
  {
    id: '7',
    subject: 'Thank you for the quick response',
    customer: 'Alex Kim',
    lastMessage: 'Just wanted to say thanks for resolving my issue so quickly. Great service!',
    assignee: 'Sarah Wilson',
    company: 'StartupHub',
    workspaceId: '6c22b22f-7bdf-43db-b7c1-9c5884125c63',
    clientId: 'e63d6f79-3966-4716-9231-f4a312e247e1',
    tags: ['feedback', 'positive'],
    status: 'closed',
    priority: 'low',
    createdAt: '2024-03-14T16:45:00Z',
    isUnread: false,
  },
  {
    id: '8',
    subject: 'Mobile app crashes on startup',
    customer: '7206e9f7-010d-41f1-a592-1aa89cb77e95',
    lastMessage: 'After the latest update, the mobile app crashes immediately when opened. Using iPhone 14 Pro.',
    assignee: null,
    company: 'MobileFirst Ltd',
    workspaceId: '6c22b22f-7bdf-43db-b7c1-9c5884125c63',
    clientId: 'e63d6f79-3966-4716-9231-f4a312e247e1',
    tags: ['mobile', 'crash', 'urgent'],
    status: 'open',
    priority: 'high',
    createdAt: '2024-03-15T11:20:00Z',
    isUnread: true,
  }
] satisfies Ticket[];

type Ticket = {
  id: string;
  subject: string;
  customer: string;
  lastMessage: string;
  assignee: string | null;
  company: string;
  workspaceId: string;
  clientId: string;
  tags: string[];
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  isUnread?: boolean;
  hasNotification?: boolean;
  notificationType?: 'mention' | 'update' | 'assignment';
};

const AllTickets = () => {


  useEffect(() => {
    // Extract workspaceId from the first ticket (Currently 1 workspaceId works)
    const workspaceId = tickets[0]?.workspaceId;
    const clientId = tickets[0].clientId;

    if (workspaceId && clientId) {
      // Store the workspaceId in cookies
      setWorkspaceId(workspaceId);

      // Store the workspaceId in cookies
      // setClientId(clientId);
    }
  }, []);

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 overflow-hidden">
        <TicketList tickets={tickets} />
      </div>
    </div>
  );
};

export default AllTickets;
