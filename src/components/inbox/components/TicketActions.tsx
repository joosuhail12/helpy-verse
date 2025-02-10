
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TicketActionsProps {
  selectedTickets: string[];
  markAsRead: (ticketIds: string[]) => void;
  markAsUnread: (ticketIds: string[]) => void;
}

const TicketActions = ({ selectedTickets, markAsRead, markAsUnread }: TicketActionsProps) => {
  if (selectedTickets.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => markAsRead(selectedTickets)}>
          Mark as Read
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => markAsUnread(selectedTickets)}>
          Mark as Unread
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TicketActions;
