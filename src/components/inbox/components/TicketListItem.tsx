import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TicketCard from '../TicketCard';
import { ViewMode, Ticket } from '@/types/ticket';

interface TicketListItemProps {
  ticket: Ticket;
  isSelected: boolean;
  onSelect: () => void;
  viewMode: ViewMode;
}

const TicketListItem = ({ ticket, isSelected, onSelect, viewMode }: TicketListItemProps) => {
  const { toast } = useToast();
  const [showInfo, setShowInfo] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(ticket.id);
    toast({
      title: 'Copied!',
      description: `Ticket ID ${ticket.id} copied to clipboard`,
    });
  };

  const handleOpenTicket = () => {
    // Handle opening the ticket - in a real app this would navigate to ticket detail
    console.log('Opening ticket:', ticket.id);
  };

  return (
    <div
      className="relative flex border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-all group"
      onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
    >
      <div className="p-3 flex items-center">
        <Checkbox 
          checked={isSelected} 
          onCheckedChange={onSelect} 
          onClick={(e) => e.stopPropagation()} 
          aria-label={`Select ticket ${ticket.id}`}
        />
      </div>

      <div className="flex-1" onClick={handleOpenTicket}>
        <TicketCard 
          ticket={{
            id: ticket.id,
            subject: ticket.subject,
            customer: ticket.customer,
            lastMessage: ticket.lastMessage,
            assignee: ticket.assignee,
            company: ticket.company || "",
            tags: ticket.tags,
            status: ticket.status,
            priority: ticket.priority,
            createdAt: ticket.createdAt,
            isUnread: ticket.isUnread,
          }} 
          viewMode={viewMode}
          onCopyId={handleCopyId}
        />
      </div>

      {showInfo && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          <button 
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyId();
            }}
            aria-label="Copy ticket ID"
          >
            <Copy className="h-4 w-4 text-gray-500" />
          </button>
          <button 
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Show more details
            }}
            aria-label="Show more ticket information"
          >
            <Info className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketListItem;
