
import { useState } from 'react';
import TicketList from '@/components/inbox/TicketList';
import { Ticket } from '@/types/ticket';

const initialTickets: Ticket[] = [
  {
    id: '1',
    subject: 'Cannot access my account',
    customer: 'John Doe',
    lastMessage: "@Sarah, could you look into this login issue when you get a chance?",
    assignee: 'Mike Thompson',
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
    id: '5',
    subject: 'Integration issues with API',
    customer: 'David Lee',
    lastMessage: "The API endpoints are returning 404 errors. @Sarah can you please check with the backend team?",
    assignee: 'Tom Wilson',
    company: 'DevTech Solutions',
    tags: ['api', 'urgent', 'bug'],
    status: 'open',
    priority: 'high',
    createdAt: '2024-03-15T08:15:00Z',
    isUnread: true,
    hasNotification: true,
    notificationType: 'mention',
    recipients: ['david.lee@devtech.com']
  }
];

const Mentions = () => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [isLoading, setIsLoading] = useState(false);

  const handleTicketCreated = (newTicket: Ticket) => {
    setTickets(prevTickets => [newTicket, ...prevTickets]);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="flex-none p-4 border-b bg-white">
        <h1 className="text-xl font-semibold">Mentions</h1>
        <p className="text-sm text-gray-500">Tickets where you were mentioned</p>
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

export default Mentions;
