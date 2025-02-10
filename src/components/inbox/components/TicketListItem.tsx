
import { Loader2, Bell, AtSign, UserPlus, MessageCircle } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, Suspense, lazy } from 'react';
import type { Ticket, ViewMode } from '@/types/ticket';

// Lazy load the TicketCard component
const TicketCard = lazy(() => import('../TicketCard'));

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
      return <AtSign className="h-3 w-3" />;
    case 'assignment':
      return <UserPlus className="h-3 w-3" />;
    case 'new_response':
      return <MessageCircle className="h-3 w-3" />;
    default:
      return <Bell className="h-3 w-3" />;
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
      return 'text-blue-500 bg-blue-50 ring-1 ring-blue-100';
    case 'assignment':
      return 'text-purple-500 bg-purple-50 ring-1 ring-purple-100';
    case 'new_response':
      return 'text-green-500 bg-green-50 ring-1 ring-green-100';
    case 'new_ticket':
      return 'text-amber-500 bg-amber-50 ring-1 ring-amber-100';
    default:
      return 'text-gray-500 bg-gray-50 ring-1 ring-gray-100';
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
  const [isVisible, setIsVisible] = useState(false);

  // Use Intersection Observer to detect when the item is visible
  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    });
  };

  // Set up the Intersection Observer when the component mounts
  const itemRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '100px', // Start loading slightly before the item comes into view
      threshold: 0.1
    });

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="group relative px-1 py-0.5" ref={itemRef}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(ticket.id)}
          aria-label={`Select ticket ${ticket.id}`}
          className="h-3.5 w-3.5"
        />
      </div>
      
      <div 
        className={`pl-7 group relative rounded-md border shadow-sm hover:shadow-md transition-all duration-200 
          ${ticket.isUnread ? 'bg-gradient-to-br from-blue-50/70 to-white border-blue-100' : 'border-gray-100'}
          ${ticket.hasNotification ? getCardBackground(ticket.notificationType) : 'bg-white border-gray-100'}
          focus-within:ring-1 focus-within:ring-primary/50`}
        tabIndex={0}
        role="article"
        aria-label={`Ticket from ${ticket.customer}: ${ticket.subject}`}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-md z-20">
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
          </div>
        )}
        
        <div className="relative">
          {isVisible ? (
            <Suspense fallback={
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            }>
              <TicketCard 
                ticket={ticket} 
                viewMode={viewMode}
                onCopyId={() => onCopyId(ticket.id)}
              />
            </Suspense>
          ) : (
            <div className="animate-pulse p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          )}
          
          {ticket.hasNotification && ticket.notificationType && (
            <div className="absolute right-2 top-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`p-1 rounded-full transition-transform hover:scale-110 ${getNotificationColor(ticket.notificationType)}`}>
                      {getNotificationIcon(ticket.notificationType)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{getNotificationText(ticket.notificationType)}</p>
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

