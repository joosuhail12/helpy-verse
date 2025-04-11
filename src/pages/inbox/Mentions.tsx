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
  return {
    id: mention.id,
    sno: 0, // Use 0 as a default SNO
    subject: mention.content || 'New Mention',
    lastMessage: mention.content || '',
    assignee: null,
    company: mention.mentionedBy || 'Unknown',
    status: 'open',
    priority: 'medium',
    tags: [],
    createdAt: mention.updatedAt || mention.createdAt || new Date().toISOString(),
    isUnread: !mention.isRead,
    hasNotification: !mention.isRead,
    notificationType: 'mention',
    // Store ticketId as threadId since Ticket doesn't have ticketId
    threadId: mention.ticketId
  };
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
        setTickets(mentionTickets);
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
  }, []);

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
    setTickets(filteredTickets);
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
