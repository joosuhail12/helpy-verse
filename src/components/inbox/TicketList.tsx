
import { useAppDispatch } from '@/hooks/useAppDispatch';
import ListComponent from './components/list/TicketList';
import type { Ticket } from '@/types/ticket';
import { addTicket } from '@/store/slices/inbox/inboxSlice';

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
  onCreateTicket?: () => void;
}

const TicketList = (props: TicketListProps) => {
  const dispatch = useAppDispatch();
  
  const handleTicketCreated = (ticket: Ticket) => {
    dispatch(addTicket(ticket));
  };
  
  return (
    <ListComponent 
      {...props} 
      onTicketCreated={handleTicketCreated}
    />
  );
};

export default TicketList;
