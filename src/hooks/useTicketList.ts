
import { useState, useMemo } from 'react';
import type { Ticket } from '@/types/ticket';

export type SortField = 'createdAt' | 'updatedAt' | 'priority' | 'status' | 'subject' | 'customer' | 'company' | 'assignee';

export const useTicketList = (initialTickets: Ticket[]) => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return tickets;
    
    return tickets.filter(ticket => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      
      const customerSearch = typeof ticket.customer === 'string' 
        ? ticket.customer.toLowerCase().includes(lowerCaseQuery)
        : ticket.customer.name.toLowerCase().includes(lowerCaseQuery);
        
      const messageSearch = ticket.lastMessage ? 
        ticket.lastMessage.toLowerCase().includes(lowerCaseQuery) : false;
        
      const companySearch = typeof ticket.company === 'string'
        ? ticket.company.toLowerCase().includes(lowerCaseQuery)
        : ticket.company?.name.toLowerCase().includes(lowerCaseQuery);
        
      const assigneeSearch = ticket.assignee 
        ? (typeof ticket.assignee === 'string'
            ? ticket.assignee.toLowerCase().includes(lowerCaseQuery)
            : ticket.assignee.name.toLowerCase().includes(lowerCaseQuery))
        : false;
      
      return (
        ticket.subject.toLowerCase().includes(lowerCaseQuery) ||
        customerSearch ||
        messageSearch ||
        companySearch ||
        assigneeSearch
      );
    });
  }, [tickets, searchQuery]);

  const sortedTickets = useMemo(() => {
    return [...filteredTickets].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'subject':
          comparison = a.subject.localeCompare(b.subject);
          break;
        case 'customer':
          const customerA = typeof a.customer === 'string' ? a.customer : a.customer.name;
          const customerB = typeof b.customer === 'string' ? b.customer : b.customer.name;
          comparison = customerA.localeCompare(customerB);
          break;
        case 'company':
          const companyA = typeof a.company === 'string' ? a.company : (a.company?.name || '');
          const companyB = typeof b.company === 'string' ? b.company : (b.company?.name || '');
          comparison = companyA.localeCompare(companyB);
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
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'assignee':
          const assigneeA = a.assignee ? (typeof a.assignee === 'string' ? a.assignee : a.assignee.name) : '';
          const assigneeB = b.assignee ? (typeof b.assignee === 'string' ? b.assignee : b.assignee.name) : '';
          comparison = assigneeA.localeCompare(assigneeB);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredTickets, sortField, sortDirection]);

  return {
    tickets,
    setTickets,
    selectedTickets,
    sortField,
    sortDirection,
    handleSort,
    searchQuery,
    setSearchQuery,
    handleSelectTicket,
    handleSelectAll,
    sortedTickets,
    filteredTickets,
    allSelected: tickets.length > 0 && selectedTickets.length === tickets.length,
    indeterminate: selectedTickets.length > 0 && selectedTickets.length < tickets.length,
  };
};

export default useTicketList;
