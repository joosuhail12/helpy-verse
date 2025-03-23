
import React, { useState } from 'react';
import { Ticket } from '@/types/ticket';
import TicketList from '@/components/inbox/TicketList';

const YourInbox = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="flex-none p-4 border-b bg-white">
        <h1 className="text-xl font-semibold">Your Inbox</h1>
        <p className="text-sm text-gray-500">View and manage tickets assigned to you</p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <TicketList 
          tickets={tickets} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default YourInbox;
