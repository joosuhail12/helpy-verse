
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { Ticket, SortField, SortDirection, ViewMode } from '@/types/ticket';

export const useTicketList = (initialTickets: Ticket[]) => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState(initialTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('expanded');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Update tickets when initialTickets changes
  useEffect(() => {
    setTickets(initialTickets);
  }, [initialTickets]);

  const updateTicket = useCallback((updatedTicket: Ticket) => {
    setTickets(currentTickets => 
      currentTickets.map(ticket => 
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
  }, []);

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
    // Set loading state for affected tickets
    setLoadingStates(prev => {
      const newStates = { ...prev };
      ticketIds.forEach(id => {
        newStates[id] = true;
      });
      return newStates;
    });

    try {
      // Update tickets locally
      setTickets(currentTickets =>
        currentTickets.map(ticket =>
          ticketIds.includes(ticket.id)
            ? { ...ticket, isUnread: false }
            : ticket
        )
      );

      toast({
        description: `${ticketIds.length} ticket(s) marked as read`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update ticket status",
      });
    } finally {
      // Clear loading states
      setLoadingStates(prev => {
        const newStates = { ...prev };
        ticketIds.forEach(id => {
          delete newStates[id];
        });
        return newStates;
      });
    }
  }, [toast]);

  const markAsUnread = useCallback(async (ticketIds: string[]) => {
    setLoadingStates(prev => {
      const newStates = { ...prev };
      ticketIds.forEach(id => {
        newStates[id] = true;
      });
      return newStates;
    });

    try {
      setTickets(currentTickets =>
        currentTickets.map(ticket =>
          ticketIds.includes(ticket.id)
            ? { ...ticket, isUnread: true }
            : ticket
        )
      );

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
  }, [toast]);

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
