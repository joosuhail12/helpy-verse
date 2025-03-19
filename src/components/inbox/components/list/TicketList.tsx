
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTicketList } from '../../hooks/useTicketList';
import SortingControls from '../../SortingControls';
import ViewToggle from './ViewToggle';
import { Ticket } from '@/types/ticket';
import TicketListItem from '../TicketListItem';
import EmptyTicketState from '../../EmptyTicketState';
import SelectionControls from '../../SelectionControls';
import { CreateTicketDialog } from '../../components/ticket-form';

interface TicketListProps {
  tickets: Ticket[];
}

const TicketList = ({ tickets: initialTickets }: TicketListProps) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
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

  const handleTicketCreated = (newTicket: Ticket) => {
    setTickets([newTicket, ...tickets]);
    setCreateDialogOpen(false);
  };

  if (tickets.length === 0) {
    return (
      <EmptyTicketState onCreateTicket={() => setCreateDialogOpen(true)} />
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 px-4 py-2">
        <div className="flex items-center gap-2">
          <SelectionControls
            onSelectAll={(checked: boolean) => handleSelectAll(checked)}
            allSelected={allSelected}
            indeterminate={indeterminate}
            selectedCount={selectedTickets.length}
          />
          {selectedTickets.length > 0 && (
            <span className="text-sm text-gray-500">{selectedTickets.length} selected</span>
          )}
        </div>
        <div className="flex items-center gap-2">
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
            className="ml-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create Ticket
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {tickets.map((ticket) => (
          <TicketListItem
            key={ticket.id}
            ticket={ticket}
            isSelected={selectedTickets.includes(ticket.id)}
            onSelect={() => handleSelectTicket(ticket.id)}
            viewMode={viewMode}
          />
        ))}
      </div>

      <CreateTicketDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onTicketCreated={handleTicketCreated}
      />
    </div>
  );
};

export default TicketList;
