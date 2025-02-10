
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';
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
import type { Ticket } from '@/types/ticket';

const ITEMS_PER_PAGE = 5;

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
}

const TicketList = ({ tickets = [], isLoading = false }: TicketListProps) => {
  const { toast } = useToast();
  const [selectedTicketForChat, setSelectedTicketForChat] = useState<Ticket | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
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

  const totalPages = Math.ceil(sortedAndFilteredTickets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTickets = sortedAndFilteredTickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (tickets.length === 0 && !isLoading) {
    return <EmptyTicketState />;
  }

  return (
    <div className="flex h-full">
      <div className={`flex flex-col h-full transition-all duration-300 ${selectedTicketForChat ? 'w-2/5' : 'w-full'}`}>
        <div className="flex items-center justify-between mb-4 px-6 py-4 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">All Tickets</h2>
        </div>

        <div className="flex-1 overflow-auto px-6">
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
              
              {paginatedTickets.map((ticket) => (
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

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4 mb-6">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {selectedTicketForChat && (
        <div className="w-3/5 h-full border-l">
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
