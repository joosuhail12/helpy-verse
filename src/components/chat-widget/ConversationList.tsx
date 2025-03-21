
import React, { useState, useEffect } from 'react';
import { Clock, Check, MessageSquare } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="flex flex-col h-64 items-center justify-center p-4">
        <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin"></div>
        <p className="mt-2 text-sm text-gray-500">Loading conversations...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col h-64 items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <MessageSquare className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-gray-700 font-medium">No conversations yet</h3>
        <p className="text-gray-500 text-sm text-center mt-1 mb-4">
          Start your first conversation with our support team
        </p>
        <button 
          onClick={onNewChat}
          className="bg-primary text-white px-4 py-2 rounded-md font-medium"
        >
          New Conversation
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <h2 className="font-medium text-gray-800">Your Conversations</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div 
            key={conversation.id}
            className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${conversation.unread ? 'bg-blue-50/50' : ''}`}
          >
            <div className="flex justify-between items-start">
              <h3 className={`font-medium ${conversation.unread ? 'text-blue-700' : 'text-gray-800'}`}>
                {conversation.title}
              </h3>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {conversation.timestamp}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{conversation.lastMessage}</p>
            <div className="flex justify-between items-center mt-2">
              <span className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 
                ${conversation.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {conversation.status === 'active' ? 'Active' : 'Resolved'}
                {conversation.status === 'resolved' && <Check className="h-3 w-3" />}
              </span>
              {conversation.unread && (
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
