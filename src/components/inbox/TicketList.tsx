
import { useToast } from "@/hooks/use-toast";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import FilterBar from './FilterBar';
import EmptyTicketState from './EmptyTicketState';
import SortingControls from './SortingControls';
import SelectionControls from './SelectionControls';
import { useTicketList } from './hooks/useTicketList';
import { useTicketShortcuts } from './hooks/useTicketShortcuts';
import { useRealtimeTickets } from './hooks/useRealtimeTickets';
import LoadingState from './components/LoadingState';
import TicketActions from './components/TicketActions';
import TicketListItem from './components/TicketListItem';
import type { Ticket } from '@/types/ticket';

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
}

const TICKET_HEIGHT = 120; // Approximate height of each ticket item

const TicketList = ({ tickets = [], isLoading = false }: TicketListProps) => {
  const { toast } = useToast();
  const parentRef = useRef<HTMLDivElement>(null);

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

  useTicketShortcuts({
    handleTicketSelection,
    handleSort,
    setViewMode,
    markAsRead,
    selectedTickets,
  });

  // Use the new hook for realtime functionality
  useRealtimeTickets(updateTicket);

  const virtualizer = useVirtualizer({
    count: sortedAndFilteredTickets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => TICKET_HEIGHT,
    overscan: 5, // Number of items to render above/below the visible area
  });

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
        <LoadingState />
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <SelectionControls
              selectedCount={selectedTickets.length}
              totalCount={tickets.length}
              onSelectAll={handleSelectAll}
            />
            
            <TicketActions
              selectedTickets={selectedTickets}
              markAsRead={markAsRead}
              markAsUnread={markAsUnread}
            />
          </div>
          
          <div 
            ref={parentRef} 
            className="h-[calc(100vh-300px)] overflow-auto"
          >
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const ticket = sortedAndFilteredTickets[virtualRow.index];
                return (
                  <div
                    key={ticket.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <TicketListItem
                      ticket={ticket}
                      viewMode={viewMode}
                      isSelected={selectedTickets.includes(ticket.id)}
                      isLoading={!!loadingStates[ticket.id]}
                      onSelect={handleTicketSelection}
                      onCopyId={handleCopyTicketId}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketList;
