
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useEffect } from 'react';
import FilterBar from './FilterBar';
import EmptyTicketState from './EmptyTicketState';
import TicketCard from './TicketCard';
import SortingControls from './SortingControls';
import SelectionControls from './SelectionControls';
import { useTicketList } from './hooks/useTicketList';
import { useTicketShortcuts } from './hooks/useTicketShortcuts';
import { getAblyChannel } from '@/utils/ably';
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import type { Ticket } from '@/types/ticket';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
}

const TicketList = ({ tickets = [], isLoading = false }: TicketListProps) => {
  const { toast } = useToast();
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortField,
    sortDirection,
    viewMode,
    setViewMode,
    selectedTickets,
    handleSort,
    handleTicketSelection,
    handleSelectAll,
    sortedAndFilteredTickets,
    updateTicket,
    markAsRead,
    markAsUnread,
    loadingStates,
  } = useTicketList(tickets);

  // Set up keyboard shortcuts
  useTicketShortcuts({
    handleTicketSelection,
    handleSort,
    setViewMode,
    markAsRead,
    selectedTickets,
  });

  useEffect(() => {
    let channel: any;

    const setupRealtime = async () => {
      try {
        channel = await getAblyChannel('tickets');
        
        channel.subscribe('ticket:update', (message: any) => {
          const updatedTicket = message.data;
          updateTicket(updatedTicket);
          
          toast({
            title: "Ticket Updated",
            description: `Ticket ${updatedTicket.id} has been updated.`,
          });
        });

        channel.subscribe('ticket:new', (message: any) => {
          const newTicket = message.data;
          toast({
            title: "New Ticket",
            description: `New ticket created: ${newTicket.subject}`,
          });
        });

      } catch (error) {
        console.error('Error setting up realtime:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to real-time updates",
          variant: "destructive",
        });
      }
    };

    setupRealtime();

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [toast, updateTicket]);

  const handleCopyTicketId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    toast({
      description: "Ticket ID copied to clipboard",
      duration: 2000,
    });
  };

  if (tickets.length === 0 && !isLoading) {
    return <EmptyTicketState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />
        
        <SortingControls
          sortField={sortField}
          sortDirection={sortDirection}
          viewMode={viewMode}
          onSort={handleSort}
          onViewModeChange={setViewMode}
        />
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-fade-in">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-lg border border-purple-100 p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <SelectionControls
              selectedCount={selectedTickets.length}
              totalCount={tickets.length}
              onSelectAll={handleSelectAll}
            />
            
            {selectedTickets.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => markAsRead?.(selectedTickets)}>
                    Mark as Read
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => markAsUnread?.(selectedTickets)}>
                    Mark as Unread
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {sortedAndFilteredTickets.map((ticket) => (
            <div key={ticket.id} className="group relative">
              <div className="absolute left-4 top-4 z-10">
                <Checkbox
                  checked={selectedTickets.includes(ticket.id)}
                  onCheckedChange={() => handleTicketSelection(ticket.id)}
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
                {loadingStates[ticket.id] && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg z-20">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
                <TicketCard 
                  ticket={ticket} 
                  viewMode={viewMode}
                  onCopyId={() => handleCopyTicketId(ticket.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList;
