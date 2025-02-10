
import { Loader2, Bell, AtSign, UserPlus } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TicketCard from '../TicketCard';
import type { Ticket, ViewMode } from '@/types/ticket';

interface TicketListItemProps {
  ticket: Ticket;
  viewMode: ViewMode;
  isSelected: boolean;
  isLoading: boolean;
  onSelect: (ticketId: string) => void;
  onCopyId: (id: string) => void;
}

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'mention':
      return <AtSign className="h-4 w-4 text-blue-500" />;
    case 'assignment':
      return <UserPlus className="h-4 w-4 text-purple-500" />;
    default:
      return <Bell className="h-4 w-4 text-amber-500" />;
  }
};

const getNotificationText = (type: string) => {
  switch (type) {
    case 'mention':
      return 'You were mentioned in this ticket';
    case 'assignment':
      return 'You were assigned to this ticket';
    default:
      return 'This ticket has been updated';
  }
};

const TicketListItem = ({
  ticket,
  viewMode,
  isSelected,
  isLoading,
  onSelect,
  onCopyId,
}: TicketListItemProps) => {
  return (
    <div className="group relative">
      <div className="absolute left-4 top-4 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(ticket.id)}
          aria-label={`Select ticket ${ticket.id}`}
        />
      </div>
      
      {ticket.hasNotification && ticket.notificationType && (
        <div className="absolute right-4 top-4 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-white p-1 rounded-full shadow-sm hover:bg-gray-50">
                  <NotificationIcon type={ticket.notificationType} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getNotificationText(ticket.notificationType)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
      <div 
        className={`pl-12 group relative focus-within:ring-2 focus-within:ring-primary/50 focus-within:rounded-lg ${
          ticket.isUnread ? 'bg-blue-50/30' : ''
        } ${ticket.hasNotification ? 'pr-12' : ''}`}
        tabIndex={0}
        role="article"
        aria-label={`Ticket from ${ticket.customer}: ${ticket.subject}`}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg z-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        <TicketCard 
          ticket={ticket} 
          viewMode={viewMode}
          onCopyId={() => onCopyId(ticket.id)}
        />
      </div>
    </div>
  );
};

export default TicketListItem;
