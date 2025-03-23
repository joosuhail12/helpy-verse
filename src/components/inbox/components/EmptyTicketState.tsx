
import { Button } from '@/components/ui/button';
import { Inbox, Plus } from 'lucide-react';

interface EmptyTicketStateProps {
  onCreateTicket: () => void;
}

const EmptyTicketState = ({ onCreateTicket }: EmptyTicketStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <div className="bg-gray-100 p-6 rounded-full mb-4">
        <Inbox className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No tickets found</h3>
      <p className="text-gray-500 max-w-md mb-6">
        There are no tickets that match your current filters or this view doesn't have any tickets yet.
      </p>
      <Button onClick={onCreateTicket}>
        <Plus className="h-4 w-4 mr-2" />
        Create New Ticket
      </Button>
    </div>
  );
};

export default EmptyTicketState;
