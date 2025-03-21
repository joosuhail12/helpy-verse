
import { useState, useEffect } from 'react';
import { isAuthenticated, getUserId } from '@/utils/auth/tokenManager';
import { Conversation, FilterState } from '../types';

/**
 * Custom hook to manage conversations data, filtering, and grouping
 */
export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    statusFilter: 'all'
  });

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
    if (filters.searchTerm) {
      filtered = filtered.filter(
        conv => 
          conv.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          conv.lastMessage.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filters.statusFilter !== 'all') {
      filtered = filtered.filter(conv => conv.status === filters.statusFilter);
    }
    
    setFilteredConversations(filtered);
  }, [filters.searchTerm, filters.statusFilter, conversations]);

  // Group conversations by date
  const groupedConversations = () => {
    const grouped: Record<string, Conversation[]> = {};
    
    filteredConversations.forEach(conv => {
      if (!grouped[conv.date]) {
        grouped[conv.date] = [];
      }
      grouped[conv.date].push(conv);
    });
    
    return grouped;
  };

  // Handle filter changes
  const updateFilters = (filterUpdates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...filterUpdates }));
  };

  return {
    conversations,
    filteredConversations,
    groupedConversations: groupedConversations(),
    loading,
    filters,
    updateFilters
  };
};

export default useConversations;
