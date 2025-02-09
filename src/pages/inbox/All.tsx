
import { useState } from 'react';
import TicketList from '@/components/inbox/TicketList';

const ITEMS_PER_PAGE = 5;

const tickets = [
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
  },
] satisfies Ticket[];

type Ticket = {
  id: string;
  subject: string;
  customer: string;
  lastMessage: string;
  assignee: string | null;
  company: string;
  tags: string[];
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
};

const AllTickets = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(tickets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTickets = tickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full space-y-6 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">All Tickets</h2>
      </div>
      
      <TicketList tickets={paginatedTickets} />

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-md ${
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTickets;
