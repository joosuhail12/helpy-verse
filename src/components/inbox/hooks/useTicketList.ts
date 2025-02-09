
import { useState, useCallback, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Ticket, SortField, SortDirection, ViewMode } from '@/types/ticket';

// API functions
const fetchTickets = async (): Promise<Ticket[]> => {
  const response = await fetch('/api/tickets');
  if (!response.ok) throw new Error('Failed to fetch tickets');
  return response.json();
};

const updateTicketStatus = async ({ ticketIds, isUnread }: { ticketIds: string[], isUnread: boolean }): Promise<void> => {
  const response = await fetch('/api/tickets/status', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticketIds, isUnread }),
  });
  if (!response.ok) throw new Error('Failed to update ticket status');
};

export const useTicketList = (initialTickets: Ticket[]) => {
  // Initialize React Query hooks first
  const queryClient = useQueryClient();
  const { data: tickets = initialTickets } = useQuery({
    queryKey: ['tickets'],
    queryFn: fetchTickets,
  });

  const updateTicketMutation = useMutation({
    mutationFn: updateTicketStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  // Toast hooks
  const { toast } = useToast();

  // State hooks
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('expanded');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const updateTicket = useCallback((updatedTicket: Ticket) => {
    queryClient.setQueryData(['tickets'], (oldData: Ticket[] | undefined) => 
      oldData?.map(ticket => 
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      ) ?? []
    );
  }, [queryClient]);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  }, [sortField]);

  const handleTicketSelection = useCallback((ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedTickets(prev => 
      prev.length === tickets.length ? [] : tickets.map(t => t.id)
    );
  }, [tickets]);

  const markAsRead = useCallback(async (ticketIds: string[]) => {
    setLoadingStates(prev => {
      const newStates = { ...prev };
      ticketIds.forEach(id => {
        newStates[id] = true;
      });
      return newStates;
    });

    try {
      await updateTicketMutation.mutateAsync({ ticketIds, isUnread: false });
      toast({
        description: `${ticketIds.length} ticket(s) marked as read`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update ticket status",
      });
    } finally {
      setLoadingStates(prev => {
        const newStates = { ...prev };
        ticketIds.forEach(id => {
          delete newStates[id];
        });
        return newStates;
      });
    }
  }, [toast, updateTicketMutation]);

  const markAsUnread = useCallback(async (ticketIds: string[]) => {
    setLoadingStates(prev => {
      const newStates = { ...prev };
      ticketIds.forEach(id => {
        newStates[id] = true;
      });
      return newStates;
    });

    try {
      await updateTicketMutation.mutateAsync({ ticketIds, isUnread: true });
      toast({
        description: `${ticketIds.length} ticket(s) marked as unread`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update ticket status",
      });
    } finally {
      setLoadingStates(prev => {
        const newStates = { ...prev };
        ticketIds.forEach(id => {
          delete newStates[id];
        });
        return newStates;
      });
    }
  }, [toast, updateTicketMutation]);

  const sortedAndFilteredTickets = useMemo(() => {
    return tickets
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
  }, [tickets, searchQuery, statusFilter, priorityFilter, sortField, sortDirection]);

  return {
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
  };
};
