
import { Loader2 } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'ring-2 ring-red-500 bg-red-50';
    case 'medium':
      return 'ring-2 ring-amber-500 bg-amber-50';
    case 'low':
      return 'ring-2 ring-blue-500 bg-blue-50';
    default:
      return 'ring-2 ring-gray-300 bg-gray-50';
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
    <div className="group relative px-1 py-0.5">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(ticket.id)}
          aria-label={`Select ticket ${ticket.id}`}
          className="h-4 w-4 transition-all duration-200 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
      </div>
      
      <div 
        className={`pl-10 group relative rounded-lg border transition-all duration-300 ease-out
          ${ticket.isUnread ? 'bg-gradient-to-r from-blue-50/50 to-transparent border-blue-100' : 'bg-white border-gray-100'}
          hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5
          focus-within:ring-2 focus-within:ring-primary/30 cursor-pointer`}
        tabIndex={0}
        role="article"
        aria-label={`Ticket from ${ticket.customer}: ${ticket.subject}`}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-lg z-20">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          </div>
        )}
        
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3">
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${getPriorityColor(ticket.priority)} group-hover:scale-110`} />
          </div>
          
          <TicketCard 
            ticket={ticket} 
            viewMode={viewMode}
            onCopyId={() => onCopyId(ticket.id)}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketListItem;
