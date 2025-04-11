import { useEffect, useState } from 'react';
import TicketList from '@/components/inbox/TicketList';
import { HttpClient } from '@/api/services/HttpClient';
import { getUserId } from '@/utils/helpers/helpers';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { Ticket } from '@/types/ticket';

interface ApiTicket {
  id: string;
  sno: number;
  title: string;
  description: string | null;
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  teamId: string;
  customerId: string;
  assigneeId: string | null;
  lastMessage: string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  teams?: {
    id: string;
    name: string;
  };
  users?: any;
  team?: {
    id: string;
    name: string;
    members: Array<{
      id: string;
      name: string;
    }>;
  };
  assignee: any;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

interface ApiResponse {
  status: string;
  message: string;
  data: ApiTicket[];
}

// Convert API response to Ticket format expected by TicketList
const convertApiTicketToTicket = (apiTicket: ApiTicket): Ticket => {
  return {
    id: apiTicket.id,
    sno: apiTicket.sno,
    subject: apiTicket.title,
    description: apiTicket.description,
    lastMessage: apiTicket.lastMessage,
    assignee: apiTicket.assignee?.name || null,
    assigneeId: apiTicket.assigneeId,
    company: apiTicket.customer?.name || '',
    tags: [],
    status: apiTicket.status,
    priority: apiTicket.priority,
    createdAt: apiTicket.createdAt,
    updatedAt: apiTicket.updatedAt,
    lastMessageAt: apiTicket.lastMessageAt,
    customerId: apiTicket.customerId,
    customer: apiTicket.customerId,  // Pass the customer ID as a string
    teamId: apiTicket.teamId,
    hasNotification: false,
    isUnread: false,
    notificationType: null,
    // Add an externalId field to help with filtering
    externalId: apiTicket.id
  };
};

// Filter out duplicate tickets based on ticketId, keeping the most recent one
const filterDuplicateTickets = (tickets: Ticket[]): Ticket[] => {
  const ticketMap = new Map<string, Ticket>();

  // Sort tickets by date (newest first) before filtering
  const sortedTickets = [...tickets].sort((a, b) => {
    // Use the most recent date available (lastMessageAt, updatedAt, or createdAt)
    const dateA = a.lastMessageAt || a.updatedAt || a.createdAt;
    const dateB = b.lastMessageAt || b.updatedAt || b.createdAt;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  // Add each ticket to the map using the ticket ID as the key
  // This will automatically keep only the latest version for each unique ticket
  sortedTickets.forEach(ticket => {
    // Use externalId or id as the unique identifier
    const ticketId = ticket.externalId || ticket.id;
    if (ticketId && !ticketMap.has(ticketId)) {
      ticketMap.set(ticketId, ticket);
    }
  });

  // Convert the map values back to an array
  return Array.from(ticketMap.values());
};

const YourInboxPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const userId = getUserId();

      if (!userId) {
        console.error('User ID not found in localStorage');
        setError('User ID not found. Please log in again.');
        toast.error('Authentication error. Please log in again.');
        navigate('/sign-in');
        return;
      }

      const response = await HttpClient.apiClient.get<ApiResponse>(
        '/team/user/tickets',
        {
          params: {
            // workspace_id is handled automatically by HttpClient
            status: 'open',
            priority: 1,
            skip: 0,
            limit: 10
          }
        }
      );

      if (response.data.status === 'success' && response.data.data) {
        // Convert API response to Ticket format
        const formattedTickets = response.data.data.map(convertApiTicketToTicket);

        // Filter out duplicate tickets to ensure we only show one instance of each ticket
        const uniqueTickets = filterDuplicateTickets(formattedTickets);

        console.log(`Filtered ${formattedTickets.length} tickets to ${uniqueTickets.length} unique tickets`);
        setTickets(uniqueTickets);
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

  useEffect(() => {
    // Check for user authentication before fetching
    const userId = getUserId();
    if (!userId) {
      console.warn('No user ID found, redirecting to login...');
      navigate('/sign-in');
      return;
    }

    fetchTickets();
  }, [navigate]);

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
          <TicketList
            tickets={tickets}
            isLoading={loading}
            hideQuickFilters={true}
          />
        )}
      </div>
    </div>
  );
};

export default YourInboxPage;
