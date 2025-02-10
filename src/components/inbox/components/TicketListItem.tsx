import { Loader2, Bell, AtSign, UserPlus, MessageCircle } from 'lucide-react';
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

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'mention':
      return <AtSign className="h-4 w-4" />;
    case 'assignment':
      return <UserPlus className="h-4 w-4" />;
    case 'new_response':
      return <MessageCircle className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getNotificationText = (type: string) => {
  switch (type) {
    case 'mention':
      return 'You were mentioned in this ticket';
    case 'assignment':
      return 'You were assigned to this ticket';
    case 'new_response':
      return 'New response on this ticket';
    default:
      return 'This ticket has been updated';
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'mention':
      return 'text-blue-500 bg-blue-50 ring-2 ring-blue-100';
    case 'assignment':
      return 'text-purple-500 bg-purple-50 ring-2 ring-purple-100';
    case 'new_response':
      return 'text-green-500 bg-green-50 ring-2 ring-green-100';
    case 'new_ticket':
      return 'text-amber-500 bg-amber-50 ring-2 ring-amber-100';
    default:
      return 'text-gray-500 bg-gray-50 ring-2 ring-gray-100';
  }
};

const getCardBackground = (type: string | undefined) => {
  if (!type) return '';
  
  switch (type) {
    case 'mention':
      return 'bg-gradient-to-br from-blue-50 to-white border-blue-100';
    case 'assignment':
      return 'bg-gradient-to-br from-purple-50 to-white border-purple-100';
    case 'new_response':
      return 'bg-gradient-to-br from-green-50 to-white border-green-100';
    case 'new_ticket':
      return 'bg-gradient-to-br from-amber-50 to-white border-amber-100';
    default:
      return '';
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
    <div className="group relative px-2">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(ticket.id)}
          aria-label={`Select ticket ${ticket.id}`}
        />
      </div>
      
      <div 
        className={`pl-10 group relative rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 
          ${ticket.isUnread ? 'bg-gradient-to-br from-blue-50/70 to-white border-blue-100' : 'border-gray-100'}
          ${ticket.hasNotification ? getCardBackground(ticket.notificationType) : 'bg-white border-gray-100'}
          focus-within:ring-2 focus-within:ring-primary/50`}
        tabIndex={0}
        role="article"
        aria-label={`Ticket from ${ticket.customer}: ${ticket.subject}`}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-lg z-20">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}
        
        <div className="relative">
          <TicketCard 
            ticket={ticket} 
            viewMode={viewMode}
            onCopyId={() => onCopyId(ticket.id)}
          />
          
          {ticket.hasNotification && ticket.notificationType && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`p-1.5 rounded-full transition-transform hover:scale-110 ${getNotificationColor(ticket.notificationType)}`}>
                      {getNotificationIcon(ticket.notificationType)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{getNotificationText(ticket.notificationType)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketListItem;
