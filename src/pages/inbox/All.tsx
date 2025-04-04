
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import TicketList from '@/components/inbox/TicketList';
import { fetchTickets } from '@/store/slices/inbox/inboxActions';
import { selectTickets, selectInboxLoading } from '@/store/slices/inbox/inboxSlice';
import { CreateTicketDialog } from '@/components/inbox/components/ticket-form';
import { getWorkspaceId } from '@/utils/auth/tokenManager';

/**
 * AllTickets component displays all tickets in the inbox
 */
const AllTickets: React.FC = () => {
  const dispatch = useAppDispatch();
  const tickets = useAppSelector(selectTickets);
  const isLoading = useAppSelector(selectInboxLoading);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    console.log('All tickets component mounted, fetching tickets');
    const workspaceId = getWorkspaceId();
    
    if (workspaceId) {
      console.log('Fetching tickets with workspace ID:', workspaceId);
      dispatch(fetchTickets());
    } else {
      console.error('No workspace ID available, cannot fetch tickets');
    }
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
          onCreateTicket={() => setCreateDialogOpen(true)}
        />
      </div>

      <CreateTicketDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onTicketCreated={(ticket) => {
          setCreateDialogOpen(false);
        }}
      />
    </div>
  );
};

// Make sure we're exporting the component as default
export default AllTickets;
