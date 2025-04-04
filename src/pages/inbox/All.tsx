import { useState } from 'react';
import TicketList from '@/components/inbox/TicketList';
import { Ticket } from '@/types/ticket';

/**
 * Displays all tickets in the inbox
 */
const AllTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([
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
      recipients: ['john.doe@acmecorp.com']
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
      recipients: ['jane.smith@techstart.com']
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
      recipients: ['robert.johnson@globalsolutions.com']
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
      recipients: ['emily.chen@nightwatch.com']
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
      recipients: ['david.lee@devtech.com']
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
      recipients: ['maria.garcia@dataanalytics.com']
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
      recipients: ['alex.kim@startuphub.com']
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
      recipients: ['chris.taylor@mobilefirst.com']
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTicketCreated = (newTicket: Ticket) => {
    setTickets(prevTickets => [newTicket, ...prevTickets]);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="flex-none p-4 border-b bg-white">
        <h1 className="text-xl font-semibold">All Tickets</h1>
        <p className="text-sm text-gray-500">View and manage all support tickets</p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <TicketList 
          tickets={tickets} 
          isLoading={isLoading}
          onTicketCreated={handleTicketCreated}
        />
      </div>
    </div>
  );
};

export default AllTickets;
