
import React from 'react';
import ConversationListLoading from './components/conversation/ConversationListLoading';
import ConversationEmptyState from './components/conversation-list/ConversationEmptyState';
import NoResultsFound from './components/conversation-list/NoResultsFound';
import ConversationFilters from './components/conversation-list/ConversationFilters';
import ConversationGroup from './components/conversation-list/ConversationGroup';
import NewConversationButton from './components/conversation-list/NewConversationButton';
import useConversations from './components/conversation-list/hooks/useConversations';
import { ConversationListProps } from './components/conversation-list/types';

/**
 * List of user conversations
 */
const ConversationList: React.FC<ConversationListProps> = ({ 
  onNewChat,
  onSelectConversation
}) => {
  const { 
    conversations, 
    filteredConversations, 
    groupedConversations, 
    loading, 
    filters, 
    updateFilters 
  } = useConversations();

  // Render loading state
  if (loading) {
    return <ConversationListLoading />;
  }

  // Render empty state when no conversations exist
  if (conversations.length === 0) {
    return <ConversationEmptyState onNewChat={onNewChat} />;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Filters section */}
      <ConversationFilters 
        filters={filters}
        onFilterChange={updateFilters}
      />
      
      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <NoResultsFound />
        ) : (
          <div>
            {Object.keys(groupedConversations).map(date => (
              <ConversationGroup
                key={date}
                date={date}
                conversations={groupedConversations[date]}
                onSelectConversation={onSelectConversation}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* New conversation button */}
      <NewConversationButton onNewChat={onNewChat} />
    </div>
  );
};

export default ConversationList;
