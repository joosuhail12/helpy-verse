
import React from 'react';
import { Button } from '@/components/ui/button';
import { Inbox, Plus } from 'lucide-react';

interface EmptyTicketStateProps {
  title: string;
  description: string;
  onCreateTicket: () => void;
}

const EmptyTicketState = ({ title, description, onCreateTicket }: EmptyTicketStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <Inbox className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      <Button onClick={onCreateTicket}>
        <Plus className="h-4 w-4 mr-2" />
        Create New Ticket
      </Button>
    </div>
  );
};

export default EmptyTicketState;
