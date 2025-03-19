import { useState, useCallback, useMemo } from 'react';
import type { Ticket, SortField, SortDirection, ViewMode } from '@/types/ticket';

// This is a custom hook to manage ticket list state
export const useTicketList = (initialTickets: Ticket[] = []) => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const [filterAssignee, setFilterAssignee] = useState<string[]>([]);
  
  const handleSort = useCallback((field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  const handleSelectTicket = useCallback((ticketId: string) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId]
    );
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedTickets(tickets.map((ticket) => ticket.id));
    } else {
      setSelectedTickets([]);
    }
  }, [tickets]);

  const allSelected = useMemo(() => {
    return tickets.length > 0 && selectedTickets.length === tickets.length;
  }, [selectedTickets.length, tickets.length]);

  const indeterminate = useMemo(() => {
    return selectedTickets.length > 0 && selectedTickets.length < tickets.length;
  }, [selectedTickets.length, tickets.length]);

  // Sort tickets based on current sort field and direction
  const sortedTickets = useMemo(() => {
    if (!tickets.length) return [];
    
    return [...tickets].sort((a, b) => {
      if (sortField === 'createdAt') {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (sortField === 'priority') {
        const priorityValues = { high: 3, medium: 2, low: 1 };
        const priorityA = priorityValues[a.priority as keyof typeof priorityValues];
        const priorityB = priorityValues[b.priority as keyof typeof priorityValues];
        return sortDirection === 'asc' ? priorityA - priorityB : priorityB - priorityA;
      }
      
      // For string comparisons
      const valueA = String(a[sortField]).toLowerCase();
      const valueB = String(b[sortField]).toLowerCase();
      
      if (sortDirection === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
  }, [tickets, sortField, sortDirection]);
  
  const filteredTickets = useMemo(() => {
    let filtered = sortedTickets;

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.subject.toLowerCase().includes(lowerCaseQuery) ||
        ticket.customer.toLowerCase().includes(lowerCaseQuery)
      );
    }

    if (filterStatus.length > 0) {
      filtered = filtered.filter(ticket => filterStatus.includes(ticket.status));
    }

    if (filterPriority.length > 0) {
      filtered = filtered.filter(ticket => filterPriority.includes(ticket.priority));
    }

    if (filterAssignee.length > 0) {
      filtered = filtered.filter(ticket => filterAssignee.includes(ticket.assignee || 'unassigned'));
    }

    return filtered;
  }, [sortedTickets, searchQuery, filterStatus, filterPriority, filterAssignee]);

  return {
    tickets,
    setTickets,
    selectedTickets,
    setSelectedTickets,
    sortField,
    sortDirection,
    handleSort,
    viewMode, 
    setViewMode,
    handleSelectTicket,
    handleSelectAll,
    allSelected,
    indeterminate,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filterAssignee,
    setFilterAssignee,
    filteredTickets,
  };
};
