import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TicketList from '@/components/inbox/TicketList';
import { getUserId } from '@/utils/helpers/helpers';
import { mentionsService, Mention } from '@/api/services/mentionsService';
import type { Ticket } from '@/types/ticket';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Convert Mention to Ticket format expected by TicketList
const convertMentionToTicket = (mention: Mention): Ticket => {
  // Map priority from string or number to the expected format
  const getPriority = (priority: string | number | undefined): 'low' | 'medium' | 'high' => {
    if (priority === 'low' || priority === 1) return 'low';
    if (priority === 'medium' || priority === 2) return 'medium';
    if (priority === 'high' || priority === 3) return 'high';
    return 'medium'; // default
  };

  // Ensure status is one of the expected values
  const getTicketStatus = (status: string | undefined): 'open' | 'closed' | 'pending' => {
    if (status === 'open') return 'open';
    if (status === 'closed') return 'closed';
    if (status === 'pending') return 'pending';
    return 'open'; // default
  };

  // Format the customer data correctly
  const formatCustomer = () => {
    if (!mention.ticket?.customer) return undefined;

    // Return the customer ID as a string instead of the full object
    // This prevents React from trying to render the customer object directly
    return mention.ticket.customerId || mention.ticket.customer.id;
  };

  return {
    id: mention.id,
    sno: mention.ticket?.sno || 0,
    subject: mention.ticket?.title || 'New Mention',
    lastMessage: mention.content || '',
    assignee: null,
    // Include mentioner's name if available
    company: mention.mentioner?.name || mention.mentionedBy || 'Unknown',
    // Use ticket status or default to open
    status: mention.ticket ? getTicketStatus(mention.ticket.status) : 'open',
    // Convert priority to the expected format
    priority: getPriority(mention.ticket?.priority),
    tags: [],
    // Get the most accurate date available
    createdAt: mention.mentionedAt || mention.updatedAt || mention.createdAt || new Date().toISOString(),
    isUnread: !mention.isRead,
    hasNotification: !mention.isRead,
    notificationType: 'mention',
    // Store ticketId as threadId since Ticket type doesn't have ticketId
    threadId: mention.ticketId,
    // Format customer data to avoid React object rendering errors
    customer: formatCustomer(),
    // Store customerId separately for reference
    customerId: mention.ticket?.customerId || mention.ticket?.customer?.id,
    // Add externalId to store original ticketId for filtering
    externalId: mention.ticketId
  };
};

// Filter out duplicate tickets based on ticketId, keeping the most recent mention for each ticket
const filterDuplicateTickets = (tickets: Ticket[]): Ticket[] => {
  const ticketMap = new Map<string, Ticket>();

  // Sort mentions by date (newest first) before filtering
  const sortedTickets = [...tickets].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Add each ticket to the map using the ticketId as the key
  // This will automatically keep only the latest mention for each ticket
  sortedTickets.forEach(ticket => {
    const ticketId = ticket.externalId || ticket.threadId;
    if (ticketId && !ticketMap.has(ticketId)) {
      ticketMap.set(ticketId, ticket);
    }
  });

  // Convert the map values back to an array
  return Array.from(ticketMap.values());
};

const MentionsPage = () => {
  const [allMentions, setAllMentions] = useState<Mention[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState('all'); // 'all', 'unread', 'read'
  const navigate = useNavigate();

  const fetchMentions = async () => {
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

      const response = await mentionsService.getMentions({
        user_id: userId
      });

      if (response.status === 'success' && response.data) {
        setAllMentions(response.data);

        // Convert mentions to tickets for display
        const mentionTickets = response.data.map(convertMentionToTicket);
        // Filter out duplicate tickets by ticketId
        const uniqueTickets = filterDuplicateTickets(mentionTickets);
        setTickets(uniqueTickets);
      } else {
        setError('Failed to fetch mentions');
      }
    } catch (err) {
      console.error('Error fetching mentions:', err);
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

    fetchMentions();
  }, [navigate]);

  // Filter tickets based on current tab selection
  useEffect(() => {
    if (allMentions.length === 0) return;

    let filteredMentions: Mention[];
    switch (currentTab) {
      case 'unread':
        filteredMentions = allMentions.filter(mention => !mention.isRead);
        break;
      case 'read':
        filteredMentions = allMentions.filter(mention => mention.isRead);
        break;
      default: // 'all'
        filteredMentions = allMentions;
    }

    const filteredTickets = filteredMentions.map(convertMentionToTicket);
    // Filter out duplicate tickets by ticketId
    const uniqueTickets = filterDuplicateTickets(filteredTickets);
    setTickets(uniqueTickets);
  }, [currentTab, allMentions]);

  // Mark a mention as read when selected
  const handleMarkAsRead = async (mentionId: string) => {
    try {
      await mentionsService.markMentionAsRead(mentionId);

      // Update local state
      setAllMentions(prev =>
        prev.map(mention =>
          mention.id === mentionId
            ? { ...mention, isRead: true }
            : mention
        )
      );
    } catch (err) {
      console.error('Error marking mention as read:', err);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
      <div className="border-b border-gray-200 px-4">
        <Tabs defaultValue="all" onValueChange={setCurrentTab}>
          <TabsList className="flex h-10">
            <TabsTrigger value="all" className="flex-1">
              All Mentions
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">
              Unread
            </TabsTrigger>
            <TabsTrigger value="read" className="flex-1">
              Read
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all"></TabsContent>
          <TabsContent value="unread"></TabsContent>
          <TabsContent value="read"></TabsContent>
        </Tabs>
      </div>

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
            No mentions found
          </div>
        ) : (
          <TicketList
            tickets={tickets}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default MentionsPage;
