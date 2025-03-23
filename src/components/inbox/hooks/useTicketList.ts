
import { useState, useMemo } from 'react';
import type { Ticket, SortField, ViewMode } from '@/types/ticket';

export const useTicketList = (initialTickets: Ticket[]) => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('detailed');

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTickets(prevSelected => {
      if (prevSelected.includes(ticketId)) {
        return prevSelected.filter(id => id !== ticketId);
      } else {
        return [...prevSelected, ticketId];
      }
    });
  };

  const handleSelectAll = (select: boolean) => {
    if (select) {
      setSelectedTickets(tickets.map(ticket => ticket.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'subject':
        case 'customer':
        case 'company':
          comparison = (a[sortField] || '').localeCompare(b[sortField] || '');
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'status':
          const statusOrder = { open: 3, pending: 2, closed: 1 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'assignee':
          const aAssignee = a.assignee || '';
          const bAssignee = b.assignee || '';
          comparison = aAssignee.localeCompare(bAssignee);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [tickets, sortField, sortDirection]);

  // Calculate the ticket data for the SelectionControls component
  const allSelected = tickets.length > 0 && selectedTickets.length === tickets.length;
  const indeterminate = selectedTickets.length > 0 && selectedTickets.length < tickets.length;

  return {
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
    sortedTickets,
    allSelected,
    indeterminate,
  };
};

export default useTicketList;
