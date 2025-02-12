
import { useState } from 'react';
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

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
}

const TicketList = ({ tickets = [], isLoading = false }: TicketListProps) => {
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

  if (tickets.length === 0 && !isLoading) {
    return <EmptyTicketState />;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b">
        <h2 className="text-xl font-semibold text-gray-900">All Tickets</h2>
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
        />
        
        <ConversationPanelContainer
          selectedTicket={selectedTicketForChat}
          onClose={() => setSelectedTicketForChat(null)}
        />
      </div>
    </div>
  );
};

export default TicketList;
