
import { Inbox, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyTicketStateProps {
  onCreateTicket: () => void;
}

const EmptyTicketState = ({ onCreateTicket }: EmptyTicketStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Inbox className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">No tickets yet</h3>
      <p className="text-gray-500 max-w-md mb-6">
        When customers contact you, their tickets will appear here. You can also create tickets manually.
      </p>
      <Button onClick={onCreateTicket}>
        <Plus className="h-4 w-4 mr-2" />
        Create Ticket
      </Button>
    </div>
  );
};

export default EmptyTicketState;
