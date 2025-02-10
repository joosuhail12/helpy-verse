
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
      return 'text-blue-500 bg-blue-50';
    case 'assignment':
      return 'text-purple-500 bg-purple-50';
    case 'new_response':
      return 'text-green-500 bg-green-50';
    case 'new_ticket':
      return 'text-amber-500 bg-amber-50';
    default:
      return 'text-gray-500 bg-gray-50';
  }
};

const getCardBackground = (type: string | undefined) => {
  if (!type) return '';
  
  switch (type) {
    case 'mention':
      return 'bg-blue-50/30';
    case 'assignment':
      return 'bg-purple-50/30';
    case 'new_response':
      return 'bg-green-50/30';
    case 'new_ticket':
      return 'bg-amber-50/30';
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
    <div className="group relative">
      <div className="absolute left-4 top-4 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(ticket.id)}
          aria-label={`Select ticket ${ticket.id}`}
        />
      </div>
      
      <div 
        className={`pl-12 group relative focus-within:ring-2 focus-within:ring-primary/50 focus-within:rounded-lg transition-colors duration-200 
          ${ticket.isUnread ? 'bg-blue-50/30' : ''}
          ${ticket.hasNotification ? getCardBackground(ticket.notificationType) : ''}`}
        tabIndex={0}
        role="article"
        aria-label={`Ticket from ${ticket.customer}: ${ticket.subject}`}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg z-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        
        <div className="relative">
          <TicketCard 
            ticket={ticket} 
            viewMode={viewMode}
            onCopyId={() => onCopyId(ticket.id)}
          />
          
          {ticket.hasNotification && ticket.notificationType && (
            <div className="absolute right-4 top-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`p-1.5 rounded-full ${getNotificationColor(ticket.notificationType)}`}>
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
