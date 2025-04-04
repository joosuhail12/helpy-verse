
import { useEffect } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import TicketList from '@/components/inbox/TicketList';
import { fetchTickets } from '@/store/slices/inbox/inboxActions';
import { selectTickets, selectInboxLoading } from '@/store/slices/inbox/inboxSlice';

const AllTickets = () => {
  const dispatch = useAppDispatch();
  const tickets = useAppSelector(selectTickets);
  const isLoading = useAppSelector(selectInboxLoading);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="flex-none p-4 border-b bg-white">
        <h1 className="text-xl font-semibold">All Tickets</h1>
        <p className="text-sm text-gray-500">View and manage all support tickets</p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <TicketList 
          tickets={tickets} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AllTickets;
