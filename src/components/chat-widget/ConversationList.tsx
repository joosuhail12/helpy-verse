
import React, { useState, useEffect } from 'react';
import { Clock, Check, MessageSquare, Search } from 'lucide-react';
import { getAblyChannel } from '@/utils/ably';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  status: 'active' | 'resolved';
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

  useEffect(() => {
    // In a real implementation, we would fetch conversations from Ably
    const fetchConversations = async () => {
      setLoading(true);
      try {
        // Mock data - in real implementation this would come from Ably
        const mockConversations: Conversation[] = [
          {
            id: '1',
            title: 'Billing Question',
            lastMessage: 'Thank you for your help with my invoice question.',
            timestamp: '2 hours ago',
            unread: false,
            status: 'resolved'
          },
          {
            id: '2',
            title: 'Product Support',
            lastMessage: 'I need help setting up the integration with our CRM.',
            timestamp: '1 day ago',
            unread: true,
            status: 'active'
          }
        ];

        // Simulate API delay
        setTimeout(() => {
          setConversations(mockConversations);
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
        <div className="w-10 h-10 border-t-2 border-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading conversations...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <MessageSquare className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-gray-800 font-semibold text-lg">No conversations yet</h3>
        <p className="text-gray-500 text-center mt-2 mb-6 max-w-[250px]">
          Start your first conversation with our support team
        </p>
        <button 
          onClick={onNewChat}
          className="bg-primary text-white px-5 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          New Conversation
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <h2 className="font-semibold text-gray-800 mb-3">Recent Conversations</h2>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations matching your search
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div 
              key={conversation.id}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${conversation.unread ? 'bg-blue-50/50' : ''}`}
            >
              <div className="flex justify-between items-start">
                <h3 className={`font-medium ${conversation.unread ? 'text-blue-700' : 'text-gray-800'}`}>
                  {conversation.title}
                </h3>
                <span className="text-xs text-gray-500 flex items-center gap-1 whitespace-nowrap">
                  <Clock className="h-3 w-3" />
                  {conversation.timestamp}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{conversation.lastMessage}</p>
              <div className="flex justify-between items-center mt-2">
                <span className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 
                  ${conversation.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {conversation.status === 'active' ? 'Active' : 'Resolved'}
                  {conversation.status === 'resolved' && <Check className="h-3 w-3" />}
                </span>
                {conversation.unread && (
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
