
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Ticket, SortField } from '@/types/ticket';

export const useTicketList = (initialTickets: Ticket[]) => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTickets(prev => {
      if (prev.includes(ticketId)) {
        return prev.filter(id => id !== ticketId);
      } else {
        return [...prev, ticketId];
      }
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedTickets(tickets.map(ticket => ticket.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSetActiveTicket = (ticketId: string | null) => {
    setActiveTicketId(ticketId);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterByStatus = (status: string | null) => {
    setStatusFilter(status);
  };

  const handleCopyTicketId = (ticketId: string) => {
    navigator.clipboard.writeText(ticketId).then(() => {
      toast({
        description: 'Ticket ID copied to clipboard',
      });
    });
  };

  const handleRemoveTickets = async () => {
    if (selectedTickets.length === 0) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove tickets from local state
      setTickets(tickets.filter(ticket => !selectedTickets.includes(ticket.id)));
      setSelectedTickets([]);
      
      toast({
        description: `${selectedTickets.length} ticket(s) deleted successfully`,
      });
    } catch (error) {
      console.error('Error removing tickets:', error);
      toast({
        variant: "destructive",
        description: "Failed to delete tickets. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTickets = tickets
    .filter(ticket => {
      // Apply status filter
      if (statusFilter && ticket.status !== statusFilter) {
        return false;
      }
      
      // Apply search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          ticket.subject.toLowerCase().includes(query) ||
          ticket.customer.toLowerCase().includes(query) ||
          ticket.lastMessage.toLowerCase().includes(query) ||
          ticket.company.toLowerCase().includes(query) ||
          (ticket.assignee && ticket.assignee.toLowerCase().includes(query)) ||
          ticket.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      const compareResult = (() => {
        if (aValue === null) return 1;
        if (bValue === null) return -1;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue);
        }
        
        return 0;
      })();
      
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });

  return {
    tickets: filteredTickets,
    selectedTickets,
    activeTicketId,
    sortField,
    sortDirection,
    searchQuery,
    statusFilter,
    isLoading,
    handleSelectTicket,
    handleSelectAll,
    handleSetActiveTicket,
    handleSort,
    handleSearch,
    handleFilterByStatus,
    handleCopyTicketId,
    handleRemoveTickets,
  };
};
