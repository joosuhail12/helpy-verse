
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTicketList } from '../../hooks/useTicketList';
import SortingControls from '../../SortingControls';
import ViewToggle from './ViewToggle';
import { Ticket, ViewMode } from '@/types/ticket';
import TicketListItem from '../TicketListItem';
import EmptyTicketState from '../../EmptyTicketState';
import SelectionControls from '../../SelectionControls';
import { CreateTicketDialog } from '../../components/ticket-form';
import ConversationPanelContainer from './ConversationPanelContainer';
import LoadingState from '../LoadingState';

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
  onTicketCreated?: (ticket: Ticket) => void;
}

const TicketList = ({ tickets: initialTickets, isLoading = false, onTicketCreated }: TicketListProps) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  const {
    tickets,
    setTickets,
    selectedTickets,
    sortField,
    sortDirection,
    handleSort,
    viewMode,
    setViewMode,
    handleSelectTicket,
    handleSelectAll,
    allSelected,
    indeterminate,
  } = useTicketList(initialTickets);

  console.log('TicketList rendering with tickets:', tickets.length, 'isLoading:', isLoading);

  const handleTicketCreated = (newTicket: Ticket) => {
    setTickets([newTicket, ...tickets]);
    setCreateDialogOpen(false);
    onTicketCreated?.(newTicket);
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseConversation = () => {
    setSelectedTicket(null);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (tickets.length === 0 && !isLoading) {
    return (
      <EmptyTicketState onCreateTicket={() => setCreateDialogOpen(true)} />
    );
  }

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className={`flex-1 flex flex-col overflow-hidden ${
        selectedTicket ? 'hidden md:flex md:w-2/5' : 'w-full'
      }`}>
        <div className="flex-none bg-white z-10 border-b p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <SelectionControls
                onSelectAll={handleSelectAll}
                allSelected={allSelected}
                indeterminate={indeterminate}
                selectedCount={selectedTickets.length}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <SortingControls
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                compact
              />
              <ViewToggle viewMode={viewMode} onChangeViewMode={setViewMode} />
              <Button
                onClick={() => setCreateDialogOpen(true)}
                size="sm"
                className="ml-auto sm:ml-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Ticket
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-2">
            {tickets.map((ticket) => (
              <div 
                key={ticket.id} 
                onClick={() => handleTicketClick(ticket)}
                className="cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-md"
              >
                <TicketListItem
                  ticket={ticket}
                  isSelected={selectedTickets.includes(ticket.id)}
                  onSelect={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleSelectTicket(ticket.id);
                  }}
                  viewMode={viewMode}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedTicket && (
        <div className="flex-1 md:w-3/5 border-l h-full overflow-hidden">
          <ConversationPanelContainer 
            selectedTicket={selectedTicket} 
            onClose={handleCloseConversation} 
          />
        </div>
      )}

      <CreateTicketDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onTicketCreated={handleTicketCreated}
      />
    </div>
  );
};

export default TicketList;
