
import { useState } from 'react';
import TicketList from '@/components/inbox/TicketList';
import { Ticket } from '@/types/ticket';

const initialTickets: Ticket[] = [
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
  }
];

const Unassigned = () => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [isLoading, setIsLoading] = useState(false);

  const handleTicketCreated = (newTicket: Ticket) => {
    setTickets(prevTickets => [newTicket, ...prevTickets]);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="flex-none p-4 border-b bg-white">
        <h1 className="text-xl font-semibold">Unassigned Tickets</h1>
        <p className="text-sm text-gray-500">Tickets that haven't been assigned to an agent</p>
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

export default Unassigned;
