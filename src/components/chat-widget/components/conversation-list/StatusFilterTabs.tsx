
import React from 'react';

interface StatusFilterTabsProps {
  selectedStatus: 'all' | 'open' | 'closed';
  onStatusChange: (status: 'all' | 'open' | 'closed') => void;
  accentColor?: string;
}

/**
 * Component for filtering conversations by status
 */
const StatusFilterTabs: React.FC<StatusFilterTabsProps> = ({ 
  selectedStatus, 
  onStatusChange,
  accentColor = '#1f2937'
}) => {
  return (
    <div className="flex border-b border-gray-100">
      <button
        onClick={() => onStatusChange('all')}
        className={`flex-1 p-2 text-sm font-medium border-b-2 ${
          selectedStatus === 'all' 
            ? 'border-current' 
            : 'border-transparent text-gray-500'
        }`}
        style={{ color: selectedStatus === 'all' ? accentColor : undefined }}
      >
        All
      </button>
      <button
        onClick={() => onStatusChange('open')}
        className={`flex-1 p-2 text-sm font-medium border-b-2 ${
          selectedStatus === 'open' 
            ? 'border-current' 
            : 'border-transparent text-gray-500'
        }`}
        style={{ color: selectedStatus === 'open' ? accentColor : undefined }}
      >
        Open
      </button>
      <button
        onClick={() => onStatusChange('closed')}
        className={`flex-1 p-2 text-sm font-medium border-b-2 ${
          selectedStatus === 'closed' 
            ? 'border-current' 
            : 'border-transparent text-gray-500'
        }`}
        style={{ color: selectedStatus === 'closed' ? accentColor : undefined }}
      >
        Closed
      </button>
    </div>
  );
};

export default StatusFilterTabs;
