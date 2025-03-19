
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
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import CreateTicketDialog from '../CreateTicketDialog';
import type { Ticket } from '@/types/ticket';

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
  onTicketCreated?: (ticket: Ticket) => void;
}

const TicketList = ({ tickets = [], isLoading = false, onTicketCreated }: TicketListProps) => {
  const [selectedTicketForChat, setSelectedTicketForChat] = useState<Ticket | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
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
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <EmptyTicketState />
        <div className="mt-6">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>
        </div>
        <CreateTicketDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen} 
          onTicketCreated={onTicketCreated}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b">
        <h2 className="text-xl font-semibold text-gray-900">All Tickets</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
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
      
      <CreateTicketDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
        onTicketCreated={onTicketCreated}
      />
    </div>
  );
};

export default TicketList;
