
import React from 'react';
import ListComponent from './components/list/TicketList';
import type { Ticket } from '@/types/ticket';

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
  onTicketCreated?: (ticket: Ticket) => void;
}

const TicketList = (props: TicketListProps) => {
  console.log('TicketList props:', props);
  return <ListComponent {...props} />;
};

export default TicketList;
