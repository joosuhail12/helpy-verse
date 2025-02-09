
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import FilterBar from './FilterBar';
import EmptyTicketState from './EmptyTicketState';
import TicketCard from './TicketCard';
import SortingControls from './SortingControls';
import SelectionControls from './SelectionControls';
import { useTicketList } from './hooks/useTicketList';
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import type { Ticket, ViewMode } from '@/types/ticket';

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
  } = useTicketList(tickets);

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
        <div className="space-y-4 animate-fade-in">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-lg border border-purple-100 p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <SelectionControls
            selectedCount={selectedTickets.length}
            totalCount={tickets.length}
            onSelectAll={handleSelectAll}
          />
          
          {sortedAndFilteredTickets.map((ticket) => (
            <div key={ticket.id} className="group relative">
              <div className="absolute left-4 top-4 z-10">
                <Checkbox
                  checked={selectedTickets.includes(ticket.id)}
                  onCheckedChange={() => handleTicketSelection(ticket.id)}
                  aria-label={`Select ticket ${ticket.id}`}
                />
              </div>
              
              <div 
                className="pl-12 group relative focus-within:ring-2 focus-within:ring-primary/50 focus-within:rounded-lg"
                tabIndex={0}
              >
                <TicketCard 
                  ticket={ticket} 
                  viewMode={viewMode}
                  onCopyId={() => handleCopyTicketId(ticket.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList;
