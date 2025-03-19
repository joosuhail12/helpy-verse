
import { useState } from 'react';
import TicketList from '@/components/inbox/TicketList';
import { Ticket } from '@/types/ticket';
import { Card } from '@/components/ui/card';

const initialTickets: Ticket[] = [
  {
    id: '1',
    subject: 'Cannot access my account',
    customer: 'John Doe',
    lastMessage: "I've been trying to log in for the past hour but keep getting an error message. Can someone help?",
    assignee: 'Sarah Wilson',
    company: 'Acme Corp',
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
    tags: ['feedback', 'positive'],
    status: 'closed',
    priority: 'low',
    createdAt: '2024-03-14T16:45:00Z',
    isUnread: false,
  },
  {
    id: '8',
    subject: 'Mobile app crashes on startup',
    customer: 'Chris Taylor',
    lastMessage: 'After the latest update, the mobile app crashes immediately when opened. Using iPhone 14 Pro.',
    assignee: null,
    company: 'MobileFirst Ltd',
    tags: ['mobile', 'crash', 'urgent'],
    status: 'open',
    priority: 'high',
    createdAt: '2024-03-15T11:20:00Z',
    isUnread: true,
  }
] satisfies Ticket[];

const AllTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  const handleTicketCreated = (newTicket: Ticket) => {
    setTickets(prevTickets => [newTicket, ...prevTickets]);
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] p-4">
      <Card className="h-full overflow-hidden bg-white shadow-sm">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold">All Tickets</h1>
            <p className="text-sm text-gray-500">View and manage all support tickets</p>
          </div>
          
          <div className="flex-1 overflow-auto">
            <TicketList 
              tickets={tickets} 
              onTicketCreated={handleTicketCreated}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AllTickets;
