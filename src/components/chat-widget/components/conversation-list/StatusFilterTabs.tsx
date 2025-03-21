
import React from 'react';

interface StatusFilterTabsProps {
  statusFilter: 'all' | 'ongoing' | 'resolved';
  onFilterChange: (status: 'all' | 'ongoing' | 'resolved') => void;
}

/**
 * Tabs for filtering conversations by status
 */
const StatusFilterTabs: React.FC<StatusFilterTabsProps> = ({ 
  statusFilter, 
  onFilterChange 
}) => {
  return (
    <div className="flex mt-3 border-b">
      <button
        onClick={() => onFilterChange('all')}
        className={`pb-2 px-3 text-sm font-medium ${
          statusFilter === 'all' 
            ? 'text-primary border-b-2 border-primary' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        All
      </button>
      <button
        onClick={() => onFilterChange('ongoing')}
        className={`pb-2 px-3 text-sm font-medium ${
          statusFilter === 'ongoing' 
            ? 'text-primary border-b-2 border-primary' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Ongoing
      </button>
      <button
        onClick={() => onFilterChange('resolved')}
        className={`pb-2 px-3 text-sm font-medium ${
          statusFilter === 'resolved' 
            ? 'text-primary border-b-2 border-primary' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Resolved
      </button>
    </div>
  );
};

export default StatusFilterTabs;
