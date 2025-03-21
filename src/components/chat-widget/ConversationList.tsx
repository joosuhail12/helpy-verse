import React, { useState, useEffect } from 'react';
import { useConversations } from './components/conversation-list/hooks/useConversations';
import ConversationFilters from './components/conversation-list/ConversationFilters';
import ConversationGroup from './components/conversation-list/ConversationGroup';
import NewConversationButton from './components/conversation-list/NewConversationButton';
import ConversationEmptyState from './components/conversation-list/ConversationEmptyState';
import NoResultsFound from './components/conversation-list/NoResultsFound';
import ConversationListLoading from './components/conversation/ConversationListLoading';
import { FilterState } from './components/conversation-list/types';

interface ConversationListProps {
  onNewChat: () => void;
  onSelectConversation: (conversationId: string) => void;
  workspaceId?: string;
}

/**
 * List of conversations/tickets for the chat widget
 */
const ConversationList: React.FC<ConversationListProps> = ({ 
  onNewChat, 
  onSelectConversation,
  workspaceId 
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    statusFilter: 'all'
  });
  
  const { conversations, loading, error } = useConversations(workspaceId);
  const [filteredGroups, setFilteredGroups] = useState<Record<string, any>>({});
  const [hasResults, setHasResults] = useState(true);

  useEffect(() => {
    if (!conversations) return;

    const filtered = conversations.filter(conv => {
      const matchesSearch = filters.searchTerm 
        ? conv.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          conv.lastMessage.toLowerCase().includes(filters.searchTerm.toLowerCase())
        : true;
      
      const matchesStatus = filters.statusFilter === 'all' 
        ? true 
        : conv.status === filters.statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    const groups = filtered.reduce((acc, conv) => {
      if (!acc[conv.date]) {
        acc[conv.date] = [];
      }
      acc[conv.date].push(conv);
      return acc;
    }, {} as Record<string, any>);

    setFilteredGroups(groups);
    setHasResults(Object.keys(groups).length > 0);
  }, [conversations, filters]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters({
      ...filters,
      ...newFilters
    });
  };
  
  if (loading) {
    return <ConversationListLoading />;
  }
  
  if (error) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <NewConversationButton onNewChat={onNewChat} />
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading conversations</p>
            <p className="text-gray-500 text-sm">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!conversations || conversations.length === 0) {
    return <ConversationEmptyState onNewChat={onNewChat} />;
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <NewConversationButton onNewChat={onNewChat} />
      </div>
      
      <ConversationFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      <div className="flex-1 overflow-y-auto">
        {hasResults ? (
          Object.keys(filteredGroups)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .map(date => (
              <ConversationGroup 
                key={date}
                date={date}
                conversations={filteredGroups[date]}
                onSelectConversation={onSelectConversation}
              />
            ))
        ) : (
          <NoResultsFound />
        )}
      </div>
    </div>
  );
};

export default ConversationList;
