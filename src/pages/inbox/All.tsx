import { useEffect, useState } from 'react';
import TicketList from '@/components/inbox/TicketList';
import { setClientId } from '@/utils/helpers/helpers';
import { HttpClient } from '@/api/services/HttpClient';
import type { Ticket as TicketListType } from '@/types/ticket';

const ITEMS_PER_PAGE = 5;

// API response ticket type
type ApiTicket = {
  id: string;
  sno?: number;
  subject: string;
  customerId: string;
  lastMessage: string;
  assignee: string | null;
  company: string | null;
  workspaceId?: string;
  clientId?: string;
  tags: string[];
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  isUnread?: boolean;
  hasNotification?: boolean;
  notificationType?: 'mention' | 'update' | 'assignment' | null;
  recipients?: string[];
};

type TicketResponse = {
  status: string;
  message: string;
  data: {
    docs: ApiTicket[];
  };
};

const AllTickets = () => {
  const [tickets, setTickets] = useState<TicketListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await HttpClient.apiClient.get<TicketResponse>('/ticket');

        if (response.data.status === 'success') {
          // Map API tickets to include the customer field and sno that TicketList needs
          const fetchedTickets = response.data.data.docs.map(apiTicket => ({
            ...apiTicket,
            // Make sure we preserve the sno value for ticket fetching
            sno: apiTicket.sno,
            // Set customer to customerId for legacy support or as an object for embedded data
            customer: apiTicket.customerId
          })) as TicketListType[];

          console.log('Fetched tickets with SNOs:', fetchedTickets.map(t => t.sno || t.id));
          setTickets(fetchedTickets);

          // Extract clientId from the first API ticket if it exists
          const clientId = response.data.data.docs[0]?.clientId;

          // Store ID in cookie
          if (clientId) {
            setClientId(clientId);
          }
        } else {
          setError('Failed to fetch tickets');
        }
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Error connecting to the server');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            {error}
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No tickets found
          </div>
        ) : (
          <TicketList tickets={tickets} isLoading={loading} />
        )}
      </div>
    </div>
  );
};

export default AllTickets;
