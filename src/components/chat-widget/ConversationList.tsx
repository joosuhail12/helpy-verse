
import React, { useState, useEffect } from 'react';
import { getAblyChannel } from '@/utils/ably';
import ConversationListItem from './components/conversation/ConversationListItem';
import ConversationListEmpty from './components/conversation/ConversationListEmpty';
import ConversationListLoading from './components/conversation/ConversationListLoading';
import ConversationSearchBar from './components/conversation/ConversationSearchBar';
import ConversationDateHeader from './components/conversation/ConversationDateHeader';

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
            unread: false,
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
            unread: false,
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
            date: 'April 2024'
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

  const filteredConversations = conversations.filter(conversation => 
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render loading state
  if (loading) {
    return <ConversationListLoading />;
  }

  // Render empty state
  if (conversations.length === 0) {
    return <ConversationListEmpty />;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {Object.keys(groupedConversations).map(date => (
        <React.Fragment key={date}>
          <ConversationDateHeader date={date} />
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <ConversationListItem 
                key={conversation.id} 
                conversation={conversation} 
              />
            ))}
          </div>
        </React.Fragment>
      ))}

      <ConversationSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
};

export default ConversationList;
