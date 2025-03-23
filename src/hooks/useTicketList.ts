
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
    return [...tickets].sort((ticketA, ticketB) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'subject':
          comparison = ticketA.subject.localeCompare(ticketB.subject);
          break;
        case 'customer':
          const customerA = typeof ticketA.customer === 'string' 
            ? ticketA.customer 
            : ticketA.customer.name;
          const customerB = typeof ticketB.customer === 'string' 
            ? ticketB.customer 
            : ticketB.customer.name;
          comparison = customerA.localeCompare(customerB);
          break;
        case 'company':
          const companyA = typeof ticketA.company === 'string' 
            ? ticketA.company 
            : (ticketA.company?.name || '');
          const companyB = typeof ticketB.company === 'string' 
            ? ticketB.company 
            : (ticketB.company?.name || '');
          comparison = companyA.localeCompare(companyB);
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1, urgent: 4 };
          comparison = priorityOrder[ticketA.priority] - priorityOrder[ticketB.priority];
          break;
        case 'status':
          const statusOrder = { open: 3, pending: 2, closed: 1, resolved: 0 };
          comparison = statusOrder[ticketA.status] - statusOrder[ticketB.status];
          break;
        case 'createdAt':
          comparison = new Date(ticketA.createdAt).getTime() - new Date(ticketB.createdAt).getTime();
          break;
        case 'assignee':
          const assigneeA = ticketA.assignee 
            ? (typeof ticketA.assignee === 'string' 
                ? ticketA.assignee 
                : ticketA.assignee.name) 
            : '';
          const assigneeB = ticketB.assignee 
            ? (typeof ticketB.assignee === 'string' 
                ? ticketB.assignee 
                : ticketB.assignee.name) 
            : '';
          comparison = assigneeA.localeCompare(assigneeB);
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
