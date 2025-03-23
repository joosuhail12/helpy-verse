
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, SearchX } from 'lucide-react';

export interface EmptyTicketStateProps {
  title: string;
  description: string;
  onCreateTicket: () => void;
}

const EmptyTicketState = ({ 
  title = "No tickets found", 
  description = "There are no tickets matching your current filters.",
  onCreateTicket 
}: EmptyTicketStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="bg-muted rounded-full p-3 mb-4">
        <SearchX className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      <Button onClick={onCreateTicket}>
        <Plus className="h-4 w-4 mr-2" />
        Create New Ticket
      </Button>
    </div>
  );
};

export default EmptyTicketState;
