
import { useToast } from "@/hooks/use-toast";
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

  useTicketShortcuts({
    handleTicketSelection,
    handleSort,
    setViewMode,
    markAsRead,
    selectedTickets,
  });

  // Use the new hook for realtime functionality
  useRealtimeTickets(updateTicket);

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
          
          {sortedAndFilteredTickets.map((ticket) => (
            <TicketListItem
              key={ticket.id}
              ticket={ticket}
              viewMode={viewMode}
              isSelected={selectedTickets.includes(ticket.id)}
              isLoading={!!loadingStates[ticket.id]}
              onSelect={handleTicketSelection}
              onCopyId={handleCopyTicketId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList;
