
import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { getAblyChannel } from '@/utils/ably';
import ConversationListItem from './components/conversation/ConversationListItem';
import ConversationListEmpty from './components/conversation/ConversationListEmpty';
import ConversationListLoading from './components/conversation/ConversationListLoading';
import ConversationDateHeader from './components/conversation/ConversationDateHeader';
import ConversationSearchBar from './components/conversation/ConversationSearchBar';
import { Button } from '@/components/ui/button';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  status: 'resolved' | 'ongoing';
  date: string;
}

interface ConversationListProps {
  onNewChat: () => void;
}

/**
 * List of existing conversations for the chat widget
 */
const ConversationList = ({ onNewChat }: ConversationListProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupedConversations, setGroupedConversations] = useState<{[key: string]: Conversation[]}>({});
  const [filter, setFilter] = useState<'all' | 'ongoing' | 'resolved'>('all');

  useEffect(() => {
    // In a real implementation, we would fetch conversations from Ably
    const fetchConversations = async () => {
      setLoading(true);
      try {
        // Mock data - in real implementation this would come from Ably
        const mockConversations: Conversation[] = [
          {
            id: '1',
            title: 'Purchase Query',
            lastMessage: 'I need help with my recent purchase.',
            timestamp: 'Today',
            unread: true,
            status: 'ongoing',
            date: 'April 2024'
          },
          {
            id: '2',
            title: 'Membership renewal',
            lastMessage: 'When does my membership expire?',
            timestamp: 'Yesterday',
            unread: false,
            status: 'resolved',
            date: 'April 2024'
          },
          {
            id: '3',
            title: 'Copyrights',
            lastMessage: 'I need information about copyright policy.',
            timestamp: '24/4/24',
            unread: true,
            status: 'ongoing',
            date: 'April 2024'
          },
          {
            id: '4',
            title: 'Cancellation policy',
            lastMessage: 'How can I cancel my subscription?',
            timestamp: '20/4/24',
            unread: false,
            status: 'resolved',
            date: 'April 2024'
          },
          {
            id: '5',
            title: 'Music Search',
            lastMessage: 'I can\'t find the song I\'m looking for.',
            timestamp: '15/4/24',
            unread: false,
            status: 'resolved',
            date: 'March 2024'
          }
        ];

        // Simulate API delay
        setTimeout(() => {
          setConversations(mockConversations);
          
          // Group conversations by date
          const grouped = mockConversations.reduce((acc, conversation) => {
            if (!acc[conversation.date]) {
              acc[conversation.date] = [];
            }
            acc[conversation.date].push(conversation);
            return acc;
          }, {} as {[key: string]: Conversation[]});
          
          setGroupedConversations(grouped);
          setLoading(false);
        }, 500);

        // Example of how we would subscribe to real-time updates with Ably
        const channel = await getAblyChannel('user-conversations');
        channel.subscribe('new-message', (message: any) => {
          // Update conversations with new message
          console.log('New message received:', message);
        });

        return () => {
          channel.unsubscribe();
        };
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Apply filters and search
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filter === 'all' || conversation.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Group filtered conversations by date
  const filteredGroupedConversations = filteredConversations.reduce((acc, conversation) => {
    if (!acc[conversation.date]) {
      acc[conversation.date] = [];
    }
    acc[conversation.date].push(conversation);
    return acc;
  }, {} as {[key: string]: Conversation[]});

  // Render loading state
  if (loading) {
    return <ConversationListLoading />;
  }

  // Render empty state
  if (conversations.length === 0) {
    return <ConversationListEmpty onNewChat={onNewChat} />;
  }

  // No results after filtering
  if (filteredConversations.length === 0) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="p-4 flex justify-between items-center border-b border-gray-100">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-2 text-gray-500"
            onClick={() => setFilter(filter === 'all' ? 'ongoing' : filter === 'ongoing' ? 'resolved' : 'all')}
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
          <div className="bg-gray-50 rounded-full p-4 mb-4">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-gray-800 font-semibold">No conversations found</h3>
          <p className="text-gray-500 text-sm mt-1 mb-4">Try adjusting your search or filter</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => { setSearchQuery(''); setFilter('all'); }}
            className="text-sm"
          >
            Clear filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 flex justify-between items-center border-b border-gray-100">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`ml-2 ${filter !== 'all' ? 'text-indigo-600' : 'text-gray-500'}`}
          onClick={() => setFilter(filter === 'all' ? 'ongoing' : filter === 'ongoing' ? 'resolved' : 'all')}
          title={filter === 'all' ? 'All conversations' : filter === 'ongoing' ? 'Ongoing only' : 'Resolved only'}
        >
          <Filter className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-1 text-indigo-600"
          onClick={onNewChat}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {filter !== 'all' && (
        <div className="text-xs text-center py-2 bg-gray-50 text-gray-600 border-b border-gray-100">
          Showing {filter === 'ongoing' ? 'ongoing' : 'resolved'} conversations
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {Object.keys(filteredGroupedConversations).map(date => (
          <React.Fragment key={date}>
            <ConversationDateHeader date={date} />
            
            {filteredGroupedConversations[date].map((conversation) => (
              <ConversationListItem 
                key={conversation.id} 
                conversation={conversation} 
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
