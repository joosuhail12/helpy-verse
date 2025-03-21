
import React from 'react';
import NewConversationButton from './components/conversation-list/NewConversationButton';
import ConversationGroup from './components/conversation-list/ConversationGroup';
import ConversationEmptyState from './components/conversation-list/ConversationEmptyState';
import StatusFilterTabs from './components/conversation-list/StatusFilterTabs';
import ConversationSearchBar from './components/conversation/ConversationSearchBar';
import ConversationListLoading from './components/conversation/ConversationListLoading';
import useConversations from './components/conversation-list/hooks/useConversations';
import { useTheme } from './theme/ThemeContext';

interface ConversationListProps {
  onNewChat: () => void;
  onSelectConversation: (conversationId: string) => void;
  workspaceId: string;
}

/**
 * Renders a list of conversations
 */
const ConversationList = ({ 
  onNewChat, 
  onSelectConversation,
  workspaceId
}: ConversationListProps) => {
  const { 
    filteredConversations, 
    groupedConversations, 
    loading, 
    error,
    filters, 
    updateFilters 
  } = useConversations(workspaceId);
  const { theme } = useTheme();

  // Handle search input change
  const handleSearchChange = (value: string) => {
    updateFilters({ searchQuery: value });
  };

  // Handle status filter change
  const handleStatusChange = (status: 'all' | 'open' | 'closed') => {
    updateFilters({ status });
  };

  if (loading) {
    return <ConversationListLoading />;
  }

  if (error) {
    return (
      <div className="flex flex-col h-full p-4">
        <p className="text-red-500 mb-4">Error loading conversations: {error.message}</p>
        <NewConversationButton onNewChat={onNewChat} />
      </div>
    );
  }

  if (filteredConversations.length === 0 && !filters.searchQuery && filters.status === 'all') {
    return <ConversationEmptyState onNewChat={onNewChat} />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-100">
        <ConversationSearchBar 
          value={filters.searchQuery} 
          onChange={handleSearchChange} 
        />
      </div>
      
      <div className="border-b border-gray-100">
        <StatusFilterTabs 
          selectedStatus={filters.status} 
          onStatusChange={handleStatusChange} 
          accentColor={theme.colors.primary}
        />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No conversations found</p>
          </div>
        ) : (
          Object.entries(groupedConversations).map(([date, conversations]) => (
            <ConversationGroup 
              key={date} 
              date={date} 
              conversations={conversations} 
              onSelectConversation={onSelectConversation}
            />
          ))
        )}
      </div>
      
      <div className="p-3 border-t border-gray-100">
        <NewConversationButton onNewChat={onNewChat} />
      </div>
    </div>
  );
};

export default ConversationList;
