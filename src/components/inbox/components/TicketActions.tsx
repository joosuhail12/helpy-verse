
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Tag, User } from 'lucide-react';

interface TicketActionsProps {
  selectedTickets: string[];
  markAsRead: (ids: string[]) => void;
  markAsUnread: (ids: string[]) => void;
}

const TicketActions = ({
  selectedTickets,
  markAsRead,
  markAsUnread
}: TicketActionsProps) => {
  if (selectedTickets.length === 0) return null;

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => markAsRead(selectedTickets)}
        className="flex items-center"
      >
        <CheckCircle className="h-4 w-4 mr-1" />
        <span className="sr-only sm:not-sr-only">Mark Read</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => markAsUnread(selectedTickets)}
        className="flex items-center"
      >
        <AlertCircle className="h-4 w-4 mr-1" />
        <span className="sr-only sm:not-sr-only">Mark Unread</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center"
      >
        <Tag className="h-4 w-4 mr-1" />
        <span className="sr-only sm:not-sr-only">Add Tag</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center"
      >
        <User className="h-4 w-4 mr-1" />
        <span className="sr-only sm:not-sr-only">Assign</span>
      </Button>
    </div>
  );
};

export default TicketActions;
