
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
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
  onTicketCreated?: (ticket: Ticket) => void;
  onCreateTicket?: () => void;
}

const TicketList = ({ 
  tickets: initialTickets, 
  isLoading = false, 
  onTicketCreated,
  onCreateTicket 
}: TicketListProps) => {
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

  const handleCreateTicketClick = () => {
    if (onCreateTicket) {
      onCreateTicket();
    } else {
      setCreateDialogOpen(true);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (tickets.length === 0 && !isLoading) {
    return (
      <EmptyTicketState onCreateTicket={handleCreateTicketClick} />
    );
  }

  return (
    <div className="flex h-full w-full overflow-hidden">
      {selectedTicket ? (
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full h-full transition-all duration-300 ease-in-out"
        >
          <ResizablePanel 
            defaultSize={40} 
            minSize={25}
            className="flex flex-col overflow-hidden"
          >
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
                    onClick={handleCreateTicketClick}
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
                    className="cursor-pointer transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md"
                  >
                    <TicketListItem
                      ticket={ticket}
                      isSelected={selectedTickets.includes(ticket.id)}
                      isActive={selectedTicket?.id === ticket.id} // Mark as active if this is the selected ticket
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
          </ResizablePanel>

          <ResizableHandle withHandle className="transition-opacity duration-300 hover:opacity-100 opacity-40" />

          <ResizablePanel defaultSize={60} minSize={30}>
            <ConversationPanelContainer 
              selectedTicket={selectedTicket} 
              onClose={handleCloseConversation} 
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
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
                  onClick={handleCreateTicketClick}
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
                  className="cursor-pointer transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md"
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
      )}

      {!onCreateTicket && (
        <CreateTicketDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onTicketCreated={handleTicketCreated}
        />
      )}
    </div>
  );
};

export default TicketList;
