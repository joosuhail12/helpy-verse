
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TicketList from '@/components/inbox/TicketList';
import type { Ticket } from '@/types/ticket';

// Mock data for testing
const mockTickets: Ticket[] = [
  {
    id: '1',
    subject: 'Cannot access my account',
    customer: 'John Doe',
    lastMessage: 'I've been trying to log in but keep getting an error message.',
    assignee: 'Sarah Wilson',
    company: 'Acme Corp',
    tags: ['account', 'login'],
    status: 'open',
    priority: 'high',
    createdAt: '2024-03-10T10:00:00Z',
    isUnread: true,
    hasNotification: true,
    notificationType: 'new_response'
  },
  {
    id: '2',
    subject: 'Feature request: Dark mode',
    customer: 'Jane Smith',
    lastMessage: 'Would love to see a dark mode option in the next update.',
    assignee: null,
    company: 'Tech Solutions Inc',
    tags: ['feature', 'ui'],
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-03-09T15:30:00Z',
    isUnread: false
  },
  {
    id: '3',
    subject: 'Billing discrepancy',
    customer: 'Robert Johnson',
    lastMessage: 'The latest invoice shows incorrect charges.',
    assignee: 'Mike Brown',
    company: 'Global Services Ltd',
    tags: ['billing', 'urgent'],
    status: 'open',
    priority: 'high',
    createdAt: '2024-03-08T09:15:00Z',
    isUnread: true,
    hasNotification: true,
    notificationType: 'mention'
  }
];

const AllTickets = () => {
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockTickets;
    },
    // Disable automatic background refetching since we'll use Ably for real-time updates
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col transition-all duration-300">
      <div className="flex-1 overflow-hidden">
        <TicketList tickets={tickets} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default AllTickets;
