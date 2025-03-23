
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, InboxIcon } from 'lucide-react';
import type { Ticket } from '@/types/ticket';

interface EmptyTicketStateProps {
  onCreateTicket?: (ticket: Ticket) => void;
}

const EmptyTicketState = ({ onCreateTicket }: EmptyTicketStateProps) => {
  const handleCreateTicket = () => {
    if (onCreateTicket) {
      // This would typically open a modal or form
      console.log('Create ticket button clicked');
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <InboxIcon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-semibold mb-2">No tickets found</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        There are currently no tickets in this inbox. Create a new ticket to get started.
      </p>
      {onCreateTicket && (
        <Button onClick={handleCreateTicket}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Ticket
        </Button>
      )}
    </div>
  );
};

export default EmptyTicketState;
