
import TicketList from '@/components/inbox/TicketList';

const tickets = [
  {
    id: '1',
    subject: 'Cannot access my account',
    customer: 'John Doe',
    status: 'open',
    priority: 'high',
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    subject: 'How do I reset my password?',
    customer: 'Jane Smith',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-03-14T15:30:00Z',
  },
  {
    id: '3',
    subject: 'Billing inquiry',
    customer: 'Robert Johnson',
    status: 'closed',
    priority: 'low',
    createdAt: '2024-03-13T09:15:00Z',
  },
] satisfies Ticket[];

type Ticket = {
  id: string;
  subject: string;
  customer: string;
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
};

const AllTickets = () => {
  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">All Tickets</h2>
      </div>
      
      <TicketList tickets={tickets} />
    </div>
  );
};

export default AllTickets;
