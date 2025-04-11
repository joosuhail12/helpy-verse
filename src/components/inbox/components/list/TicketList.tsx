import { useState, useEffect } from 'react';
import FilterBar from '../../FilterBar';
import EmptyTicketState from '../../EmptyTicketState';
import SortingControls from '../../SortingControls';
import SelectionControls from '../../SelectionControls';
import { useTicketList } from '../../hooks/useTicketList';
import { useTicketShortcuts } from '../../hooks/useTicketShortcuts';
import { useRealtimeTickets } from '../../hooks/useRealtimeTickets';
import LoadingState from '../LoadingState';
import TicketActions from '../TicketActions';
import MainContent from './MainContent';
import ConversationPanelContainer from './ConversationPanelContainer';
import type { Ticket } from '@/types/ticket';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTicketsBySno } from '@/store/slices/tickets/ticketsSlice';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// Remove the hardcoded sample SNOs
// const SAMPLE_TICKET_SNOS = [23, 24, 25, 26, 27];
const ITEMS_PER_PAGE = 5;

interface TicketListProps {
  tickets?: Ticket[];
  isLoading?: boolean;
  hideQuickFilters?: boolean;
}

const TicketList = ({
  tickets: propTickets = [],
  isLoading: propLoading = false,
  hideQuickFilters = false
}: TicketListProps) => {
  const dispatch = useAppDispatch();
  const { ticketDetails, loading: storeLoading, error } = useAppSelector(state => state.tickets);

  const [selectedTicketForChat, setSelectedTicketForChat] = useState<Ticket | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Get SNOs from props tickets
  const [ticketSnos, setTicketSnos] = useState<(string | number)[]>([]);

  // Extract SNOs from propTickets when they change
  useEffect(() => {
    if (propTickets.length > 0) {
      // Extract SNO or ID values from the tickets
      const extractedSnos = propTickets
        .map(ticket => ticket.sno || ticket.id)
        .filter(Boolean); // Filter out undefined/null values

      console.log('Extracted ticket SNOs:', extractedSnos);
      setTicketSnos(extractedSnos);
    }
  }, [propTickets]);

  // Determine whether to use tickets from props or from the redux store
  const useStoreTickets = Object.keys(ticketDetails).length > 0;
  const tickets = useStoreTickets
    ? Object.values(ticketDetails)
    : propTickets;

  const isLoading = useStoreTickets ? storeLoading : propLoading;

  // Fetch ticket details by SNos from the backend
  useEffect(() => {
    if (ticketSnos.length > 0) {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const pageTicketIdentifiers = ticketSnos.slice(startIndex, endIndex);

      console.log(`Fetching tickets for page ${currentPage}: Identifiers ${pageTicketIdentifiers.join(', ')}`);
      dispatch(fetchTicketsBySno(pageTicketIdentifiers));
    }
  }, [dispatch, ticketSnos, currentPage]);

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

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 font-medium">Error loading tickets: {error}</div>
      </div>
    );
  }

  if (tickets.length === 0 && !isLoading) {
    return <EmptyTicketState />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          {hideQuickFilters ? "Mentions" : "All Tickets"}
        </h2>
      </div>

      <div className="flex flex-1 min-h-0">
        <MainContent
          isLoading={isLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          sortField={sortField}
          sortDirection={sortDirection}
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedTickets={selectedTickets}
          handleSort={handleSort}
          handleTicketSelection={handleTicketSelection}
          handleSelectAll={handleSelectAll}
          sortedAndFilteredTickets={sortedAndFilteredTickets}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          loadingStates={loadingStates}
          markAsRead={markAsRead}
          markAsUnread={markAsUnread}
          onTicketClick={setSelectedTicketForChat}
          selectedTicketForChat={selectedTicketForChat}
          hideQuickFilters={hideQuickFilters}
        />

        <ConversationPanelContainer
          selectedTicket={selectedTicketForChat}
          onClose={() => setSelectedTicketForChat(null)}
        />
      </div>

      {/* Pagination for tickets */}
      <div className="px-6 py-4 border-t bg-white">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>

            {Array.from({ length: Math.ceil(ticketSnos.length / ITEMS_PER_PAGE) }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(ticketSnos.length / ITEMS_PER_PAGE), prev + 1))}
                aria-disabled={currentPage === Math.ceil(ticketSnos.length / ITEMS_PER_PAGE)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default TicketList;
