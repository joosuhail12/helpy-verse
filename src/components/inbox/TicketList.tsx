
import ListComponent from './components/list/TicketList';
import type { Ticket } from '@/types/ticket';

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
  onTicketCreated?: (ticket: Ticket) => void;
}

const TicketList = (props: TicketListProps) => {
  return <ListComponent {...props} />;
};

export default TicketList;
