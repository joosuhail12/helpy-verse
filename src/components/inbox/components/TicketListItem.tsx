
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
        className={`pl-12 group relative focus-within:ring-2 focus-within:ring-primary/50 focus-within:rounded-lg ${
          ticket.isUnread ? 'bg-blue-50/30' : ''
        }`}
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
