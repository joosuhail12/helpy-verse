
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
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <h2 className="text-xl font-semibold text-gray-900">All Tickets</h2>
      </div>

      <div className="flex flex-1 min-h-0 bg-gray-50/30">
        <div className={`flex flex-col transition-all duration-300 ${
          selectedTicketForChat 
            ? 'w-full md:w-3/5 lg:w-2/5' 
            : 'w-full'
        }`}>
          <div className="flex-1 overflow-auto px-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 mt-6">
              <div className="p-4 space-y-6">
                <FilterBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  priorityFilter={priorityFilter}
                  setPriorityFilter={setPriorityFilter}
                />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t">
                  <SelectionControls
                    selectedCount={selectedTickets.length}
                    totalCount={tickets.length}
                    onSelectAll={handleSelectAll}
                  />
                  
                  <div className="flex items-center gap-4">
                    <TicketActions
                      selectedTickets={selectedTickets}
                      markAsRead={markAsRead}
                      markAsUnread={markAsUnread}
                    />
                    <SortingControls
                      sortField={sortField}
                      sortDirection={sortDirection}
                      viewMode={viewMode}
                      onSort={handleSort}
                      onViewModeChange={setViewMode}
                    />
                  </div>
                </div>
              </div>
            </div>

            {isLoading ? (
              <LoadingState />
            ) : (
              <div className="space-y-3 animate-fade-in pb-6">
                <div className="space-y-2">
                  {paginatedTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => handleTicketClick(ticket)}
                      className="transform transition-all duration-200 hover:-translate-y-0.5"
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
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
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
          <div className="hidden md:block md:flex-1 border-l bg-white">
            <ConversationPanel
              ticket={selectedTicketForChat}
              onClose={() => setSelectedTicketForChat(null)}
            />
          </div>
        )}

        {/* Mobile conversation panel */}
        {selectedTicketForChat && (
          <div className="fixed inset-0 z-50 md:hidden bg-white">
            <ConversationPanel
              ticket={selectedTicketForChat}
              onClose={() => setSelectedTicketForChat(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketList;

