
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TicketList from '@/components/inbox/TicketList';
import type { Ticket } from '@/types/ticket';

const AllTickets = () => {
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const response = await fetch('YOUR_NODE_BACKEND_URL/api/tickets');
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      return response.json() as Promise<Ticket[]>;
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
