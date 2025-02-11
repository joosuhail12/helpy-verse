
import { Archive, Ban, CheckCircle2, Clock, Trash2, UserCheck2, UserX2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
        <Button variant="outline" className="flex items-center gap-2">
          Actions
          <span className="px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-md">
            {selectedTickets.length}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => markAsRead(selectedTickets)}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            <span>Mark as Read</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => markAsUnread(selectedTickets)}>
            <Clock className="mr-2 h-4 w-4" />
            <span>Mark as Unread</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserCheck2 className="mr-2 h-4 w-4" />
            <span>Assign to...</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserX2 className="mr-2 h-4 w-4" />
            <span>Unassign</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Archive className="mr-2 h-4 w-4" />
            <span>Archive Tickets</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete Tickets</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TicketActions;

