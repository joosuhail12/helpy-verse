
import { useState } from 'react';
import { Loader2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import FilterBar from './FilterBar';
import EmptyTicketState from './EmptyTicketState';
import TicketCard from './TicketCard';
import { Skeleton } from "@/components/ui/skeleton";
import { Toggle } from "@/components/ui/toggle";
import { Checkbox } from "@/components/ui/checkbox";
import type { Ticket, SortField, SortDirection, ViewMode } from '@/types/ticket';

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
}

const TicketList = ({ tickets = [], isLoading = false }: TicketListProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('expanded');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleCopyTicketId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    toast({
      description: "Ticket ID copied to clipboard",
      duration: 2000,
    });
  };

  const handleTicketSelection = (ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTickets(prev => 
      prev.length === tickets.length ? [] : tickets.map(t => t.id)
    );
  };

  const sortedAndFilteredTickets = tickets
    .filter(ticket => {
      const matchesSearch = 
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      switch (sortField) {
        case 'date':
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction;
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[a.priority] - priorityOrder[b.priority]) * direction;
        }
        case 'status': {
          const statusOrder = { open: 3, pending: 2, closed: 1 };
          return (statusOrder[a.status] - statusOrder[b.status]) * direction;
        }
        default:
          return 0;
      }
    });

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
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2" role="group" aria-label="Sort options">
            <button
              onClick={() => handleSort('date')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                sortField === 'date' ? 'text-primary' : 'text-gray-600'
              }`}
              aria-pressed={sortField === 'date'}
            >
              Date {sortField === 'date' && (sortDirection === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />)}
            </button>
            <button
              onClick={() => handleSort('priority')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                sortField === 'priority' ? 'text-primary' : 'text-gray-600'
              }`}
              aria-pressed={sortField === 'priority'}
            >
              Priority {sortField === 'priority' && (sortDirection === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />)}
            </button>
            <button
              onClick={() => handleSort('status')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                sortField === 'status' ? 'text-primary' : 'text-gray-600'
              }`}
              aria-pressed={sortField === 'status'}
            >
              Status {sortField === 'status' && (sortDirection === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />)}
            </button>
          </div>

          <Toggle
            pressed={viewMode === 'compact'}
            onPressedChange={(pressed) => setViewMode(pressed ? 'compact' : 'expanded')}
            aria-label="Toggle view mode"
          >
            {viewMode === 'compact' ? 'Expanded' : 'Compact'} View
          </Toggle>
        </div>
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
          {tickets.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Checkbox
                checked={selectedTickets.length === tickets.length}
                onCheckedChange={handleSelectAll}
                aria-label="Select all tickets"
              />
              <span className="text-sm text-gray-600">
                {selectedTickets.length} selected
              </span>
            </div>
          )}
          
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

