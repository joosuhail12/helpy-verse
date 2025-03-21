
import React, { useState, useEffect } from 'react';
import ConversationListItem from './components/conversation/ConversationListItem';
import ConversationListEmpty from './components/conversation/ConversationListEmpty';
import ConversationListLoading from './components/conversation/ConversationListLoading';
import ConversationSearchBar from './components/conversation/ConversationSearchBar';
import { isAuthenticated, getUserId } from '@/utils/auth/tokenManager';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  date: string;
  unread: boolean;
  status: 'resolved' | 'ongoing';
}

interface ConversationListProps {
  onNewChat: () => void;
  onSelectConversation: (conversationId: string) => void;
}

/**
 * List of user conversations
 */
const ConversationList: React.FC<ConversationListProps> = ({ 
  onNewChat,
  onSelectConversation
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'resolved'>('all');

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      
      // In a real implementation, we would fetch conversations from your API
      // This is a mock implementation that simulates fetching data with a random
      // number of conversations or an empty state
      setTimeout(() => {
        if (Math.random() > 0.2) { // 80% chance to show conversations
          const mockConversations: Conversation[] = Array.from({ length: 10 }, (_, i) => {
            const isResolved = Math.random() > 0.6;
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            return {
              id: `conv-${Date.now()}-${i}`,
              title: `Support Request ${i + 1}`,
              lastMessage: `This is the last message in conversation ${i + 1}. It might be a longer message that gets truncated.`,
              timestamp: i === 0 ? '5m ago' : i === 1 ? '1h ago' : `${i}d ago`,
              date: date.toISOString().split('T')[0],
              unread: i < 2 && Math.random() > 0.5,
              status: isResolved ? 'resolved' : 'ongoing'
            };
          });
          
          setConversations(mockConversations);
          setFilteredConversations(mockConversations);
        } else {
          // Empty state
          setConversations([]);
          setFilteredConversations([]);
        }
        
        setLoading(false);
      }, 1000);
    };
    
    fetchConversations();
  }, []);

  // Filter conversations based on search term and status filter
  useEffect(() => {
    let filtered = [...conversations];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        conv => 
          conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(conv => conv.status === statusFilter);
    }
    
    setFilteredConversations(filtered);
  }, [searchTerm, statusFilter, conversations]);

  // Handle search input change
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Handle status filter change
  const handleStatusFilter = (status: 'all' | 'ongoing' | 'resolved') => {
    setStatusFilter(status);
  };

  if (loading) {
    return <ConversationListLoading />;
  }

  if (conversations.length === 0) {
    return <ConversationListEmpty onNewChat={onNewChat} />;
  }

  // Group conversations by date
  const groupedConversations: Record<string, Conversation[]> = {};
  filteredConversations.forEach(conv => {
    if (!groupedConversations[conv.date]) {
      groupedConversations[conv.date] = [];
    }
    groupedConversations[conv.date].push(conv);
  });

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b">
        <ConversationSearchBar 
          onSearch={handleSearch} 
          value={searchTerm}
        />
        
        {/* Status filter tabs */}
        <div className="flex mt-3 border-b">
          <button
            onClick={() => handleStatusFilter('all')}
            className={`pb-2 px-3 text-sm font-medium ${
              statusFilter === 'all' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleStatusFilter('ongoing')}
            className={`pb-2 px-3 text-sm font-medium ${
              statusFilter === 'ongoing' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Ongoing
          </button>
          <button
            onClick={() => handleStatusFilter('resolved')}
            className={`pb-2 px-3 text-sm font-medium ${
              statusFilter === 'resolved' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-gray-800 font-semibold">No results found</h3>
            <p className="text-gray-500 text-center mt-2">
              Try adjusting your search or filter to find what you're looking for
            </p>
          </div>
        ) : (
          <div>
            {Object.keys(groupedConversations).map(date => (
              <div key={date}>
                <div className="sticky top-0 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 border-y">
                  {new Date(date).toLocaleDateString(undefined, { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                {groupedConversations[date].map(conversation => (
                  <ConversationListItem
                    key={conversation.id}
                    conversation={conversation}
                    onSelect={() => onSelectConversation(conversation.id)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="border-t p-4">
        <button
          onClick={onNewChat}
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          Start New Conversation
        </button>
      </div>
    </div>
  );
};

export default ConversationList;
