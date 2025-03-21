
import React, { useState, useEffect } from 'react';
import { Clock, Search } from 'lucide-react';
import { getAblyChannel } from '@/utils/ably';

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

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6">
        <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading conversations...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-gray-800 font-semibold">No messages yet</h3>
        <p className="text-gray-500 text-center mt-2 mb-6 max-w-[250px]">
          Start your first conversation with our support team
        </p>
        <input
          type="text"
          placeholder="Type or hum what your looking for"
          className="w-full border-t border-b border-gray-200 py-3 px-4 text-sm focus:outline-none"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Date header */}
      <div className="text-center py-2 text-xs text-gray-500 border-b border-gray-100">
        April 2024
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <div 
            key={conversation.id}
            className="border-b border-gray-100 cursor-pointer"
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">
                  {conversation.title}
                </h3>
                <div className={`text-xs px-3 py-1 rounded-full font-medium ${
                  conversation.status === 'resolved' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {conversation.status === 'resolved' ? 'Resolved' : 'Ongoing'}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {conversation.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 p-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Type or hum what your looking for"
            className="w-full border border-gray-200 rounded-md py-2 pr-10 pl-4 text-sm"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600">
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationList;
