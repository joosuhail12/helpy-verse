
import { useState, useEffect } from 'react';
import TicketList from '@/components/inbox/TicketList';
import { Ticket } from '@/types/ticket';
import { stringToCustomer, stringToCompany, stringToTeamMember } from '@/types/ticket';

const initialTickets: Ticket[] = [
  {
    id: '1',
    subject: 'Cannot access my account',
    customer: stringToCustomer('John Doe'),
    lastMessage: "I've been trying to log in for the past hour but keep getting an error message. Can someone help?",
    assignee: stringToTeamMember('Sarah Wilson'),
    company: stringToCompany('Acme Corp'),
    tags: ['login', 'urgent'],
    status: 'open',
    priority: 'high',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    isUnread: true,
    hasNotification: true,
    notificationType: 'mention',
    recipients: ['john.doe@acmecorp.com']
  },
  {
    id: '2',
    subject: 'How do I reset my password?',
    customer: stringToCustomer('Jane Smith'),
    lastMessage: "I forgot my password and need help resetting it. I've tried the 'forgot password' link but haven't received any email.",
    assignee: null,
    company: stringToCompany('TechStart Inc'),
    tags: ['password-reset'],
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-03-14T15:30:00Z',
    updatedAt: '2024-03-14T15:30:00Z',
    isUnread: false,
    hasNotification: true,
    notificationType: 'assignment',
    recipients: ['jane.smith@techstart.com']
  },
  {
    id: '3',
    subject: 'Billing inquiry',
    customer: stringToCustomer('Robert Johnson'),
    lastMessage: 'I have a question about my last invoice. There seems to be a discrepancy in the charges.',
    assignee: stringToTeamMember('Mike Thompson'),
    company: stringToCompany('Global Solutions'),
    tags: ['billing', 'invoice'],
    status: 'closed',
    priority: 'low',
    createdAt: '2024-03-13T09:15:00Z',
    updatedAt: '2024-03-13T09:15:00Z',
    isUnread: false,
    recipients: ['robert.johnson@globalsolutions.com']
  },
  {
    id: '4',
    subject: 'Feature request: Dark mode',
    customer: stringToCustomer('Emily Chen'),
    lastMessage: 'Would it be possible to add a dark mode option to the dashboard? It would help reduce eye strain during night shifts.',
    assignee: null,
    company: stringToCompany('NightWatch Security'),
    tags: ['feature-request', 'ui'],
    status: 'open',
    priority: 'low',
    createdAt: '2024-03-12T22:45:00Z',
    updatedAt: '2024-03-12T22:45:00Z',
    isUnread: true,
    recipients: ['emily.chen@nightwatch.com']
  },
  {
    id: '5',
    subject: 'Integration issues with API',
    customer: stringToCustomer('David Lee'),
    lastMessage: 'The API endpoints are returning 404 errors since this morning. This is blocking our development process.',
    assignee: null,
    company: stringToCompany('DevTech Solutions'),
    tags: ['api', 'urgent', 'bug'],
    status: 'open',
    priority: 'high',
    createdAt: '2024-03-15T08:15:00Z',
    updatedAt: '2024-03-15T08:15:00Z',
    isUnread: true,
    recipients: ['david.lee@devtech.com']
  }
];

const AllTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    console.log('AllTickets page loaded with', tickets.length, 'tickets');
  }, [tickets]);

  const handleTicketCreated = (newTicket: Ticket) => {
    setTickets(prevTickets => [newTicket, ...prevTickets]);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-background">
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
