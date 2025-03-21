
import { useState, useEffect } from 'react';
import { Conversation } from '../types';

// Import in your real API fetching logic
const fetchConversations = async (workspaceId: string): Promise<Conversation[]> => {
  // This would be replaced with your actual API call
  console.log('Fetching conversations for workspace:', workspaceId);
  
  // Mock data for development
  return [
    {
      id: '1',
      title: 'Product Question',
      lastMessage: 'I have a question about your product features...',
      date: new Date().toISOString(),
      timestamp: '10:30 AM',
      status: 'ongoing',
      unread: true,
    },
    {
      id: '2',
      title: 'Billing Support',
      lastMessage: 'My last invoice seems incorrect...',
      date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      timestamp: '2:15 PM',
      status: 'resolved',
      unread: false,
    },
    {
      id: '3',
      title: 'Feature Request',
      lastMessage: 'Would it be possible to add...',
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      timestamp: '9:45 AM',
      status: 'ongoing',
      unread: true,
    }
  ];
};

export interface FilterState {
  status: 'all' | 'open' | 'closed';
  searchQuery: string;
  statusFilter?: 'all' | 'ongoing' | 'resolved';
}

const useConversations = (workspaceId: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    searchQuery: '',
  });

  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      
      try {
        const data = await fetchConversations(workspaceId);
        setConversations(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [workspaceId]);

  // Update filters
  const updateFilters = (filterUpdates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...filterUpdates }));
  };

  // Map between status types (for backward compatibility)
  const mapStatusFilter = (statusFilter: 'all' | 'open' | 'closed' | 'ongoing' | 'resolved') => {
    if (statusFilter === 'all') return 'all';
    if (statusFilter === 'open' || statusFilter === 'ongoing') return 'ongoing';
    if (statusFilter === 'closed' || statusFilter === 'resolved') return 'resolved';
    return 'all';
  };

  // Apply filters to conversations
  const filteredConversations = conversations.filter(conversation => {
    // Filter by status
    const statusToCheck = filters.statusFilter || filters.status;
    const mappedStatus = mapStatusFilter(statusToCheck);
    
    if (mappedStatus !== 'all' && conversation.status !== mappedStatus) {
      return false;
    }
    
    // Filter by search query
    if (
      filters.searchQuery && 
      !conversation.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !conversation.lastMessage.toLowerCase().includes(filters.searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });

  // Group conversations by date
  const groupedConversations = filteredConversations.reduce((groups, conversation) => {
    const date = new Date(conversation.date);
    
    // Simple grouping logic - today, yesterday, older
    let groupKey: string;
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      groupKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Yesterday';
    } else {
      groupKey = 'Older';
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    
    groups[groupKey].push(conversation);
    return groups;
  }, {} as Record<string, Conversation[]>);

  return {
    conversations,
    filteredConversations,
    groupedConversations,
    loading,
    error,
    filters,
    updateFilters,
  };
};

export default useConversations;
