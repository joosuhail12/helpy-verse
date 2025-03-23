
import { useState } from 'react';
import TicketList from '@/components/inbox/TicketList';
import { Ticket } from '@/types/ticket';

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
    recipients: ['john.doe@acmecorp.com']
  },
  {
    id: '2',
    subject: 'Feature request discussion',
    customer: 'Emily Chen',
    lastMessage: "Would it be possible to schedule a call to discuss the dark mode implementation timeline?",
    assignee: 'Sarah Wilson',
    company: 'NightWatch Security',
    tags: ['feature-request', 'ui'],
    status: 'open',
    priority: 'medium',
    createdAt: '2024-03-16T09:30:00Z',
    isUnread: false,
    recipients: ['emily.chen@nightwatch.com']
  }
];

const YourInbox = () => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [isLoading, setIsLoading] = useState(false);

  const handleTicketCreated = (newTicket: Ticket) => {
    setTickets(prevTickets => [newTicket, ...prevTickets]);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="flex-none p-4 border-b bg-white">
        <h1 className="text-xl font-semibold">Your Inbox</h1>
        <p className="text-sm text-gray-500">Tickets assigned to you</p>
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

export default YourInbox;
