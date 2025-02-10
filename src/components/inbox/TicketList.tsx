
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
import ConversationPanel from './ConversationPanel';
import { useState } from 'react';
import type { Ticket } from '@/types/ticket';

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
}

const TicketList = ({ tickets = [], isLoading = false }: TicketListProps) => {
  const { toast } = useToast();
  const [selectedTicketForChat, setSelectedTicketForChat] = useState<Ticket | null>(null);
  
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

  useRealtimeTickets(updateTicket);

  const handleCopyTicketId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    toast({
      description: "Ticket ID copied to clipboard",
      duration: 2000,
    });
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicketForChat(ticket);
  };

  if (tickets.length === 0 && !isLoading) {
    return <EmptyTicketState />;
  }

  return (
    <div className="flex h-full">
      <div className={`space-y-6 transition-all duration-300 ${selectedTicketForChat ? 'w-2/5' : 'w-full'}`}>
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
              <div
                key={ticket.id}
                onClick={() => handleTicketClick(ticket)}
                className="cursor-pointer"
              >
                <TicketListItem
                  ticket={ticket}
                  viewMode={selectedTicketForChat ? 'compact' : viewMode}
                  isSelected={selectedTickets.includes(ticket.id)}
                  isLoading={!!loadingStates[ticket.id]}
                  onSelect={(id) => {
                    // Prevent ticket selection from triggering the conversation panel
                    event?.stopPropagation();
                    handleTicketSelection(id);
                  }}
                  onCopyId={(id) => {
                    event?.stopPropagation();
                    handleCopyTicketId(id);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedTicketForChat && (
        <div className="w-3/5 h-full">
          <ConversationPanel
            ticket={selectedTicketForChat}
            onClose={() => setSelectedTicketForChat(null)}
          />
        </div>
      )}
    </div>
  );
};

export default TicketList;
