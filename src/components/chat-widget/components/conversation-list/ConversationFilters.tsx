
import React from 'react';
import ConversationSearchBar from '../conversation/ConversationSearchBar';
import StatusFilterTabs from './StatusFilterTabs';
import { FilterState } from './types';

interface ConversationFiltersProps {
  filters: FilterState;
  onFilterChange: (filterState: Partial<FilterState>) => void;
}

/**
 * Container for conversation filters (search and status)
 */
const ConversationFilters: React.FC<ConversationFiltersProps> = ({ 
  filters, 
  onFilterChange 
}) => {
  const handleSearch = (term: string) => {
    onFilterChange({ searchTerm: term });
  };

  const handleStatusFilter = (status: 'all' | 'ongoing' | 'resolved') => {
    onFilterChange({ statusFilter: status });
  };

  return (
    <div className="p-4 border-b">
      <ConversationSearchBar 
        onSearch={handleSearch} 
        value={filters.searchTerm}
      />
      
      <StatusFilterTabs 
        statusFilter={filters.statusFilter}
        onFilterChange={handleStatusFilter}
      />
    </div>
  );
};

export default ConversationFilters;
