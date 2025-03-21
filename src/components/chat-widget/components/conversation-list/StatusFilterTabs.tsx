
import React from 'react';

interface StatusFilterTabsProps {
  selectedStatus?: 'all' | 'open' | 'closed';
  statusFilter?: 'all' | 'ongoing' | 'resolved';
  onStatusChange?: (status: 'all' | 'open' | 'closed') => void;
  onFilterChange?: (status: 'all' | 'ongoing' | 'resolved') => void;
  accentColor?: string;
}

/**
 * Component for filtering conversations by status
 */
const StatusFilterTabs: React.FC<StatusFilterTabsProps> = ({ 
  selectedStatus = 'all', 
  statusFilter = 'all',
  onStatusChange,
  onFilterChange,
  accentColor = '#1f2937'
}) => {
  const status = selectedStatus || statusFilter;
  
  const handleStatusChange = (newStatus: 'all' | 'open' | 'closed' | 'ongoing' | 'resolved') => {
    if (onStatusChange && (newStatus === 'all' || newStatus === 'open' || newStatus === 'closed')) {
      onStatusChange(newStatus);
    }
    
    if (onFilterChange && (newStatus === 'all' || newStatus === 'ongoing' || newStatus === 'resolved')) {
      onFilterChange(newStatus);
    }
  };

  // Map between different status naming conventions
  const getButtonActiveState = (buttonStatus: string, currentStatus: string) => {
    if (buttonStatus === currentStatus) return true;
    if (buttonStatus === 'open' && currentStatus === 'ongoing') return true;
    if (buttonStatus === 'ongoing' && currentStatus === 'open') return true;
    if (buttonStatus === 'closed' && currentStatus === 'resolved') return true;
    if (buttonStatus === 'resolved' && currentStatus === 'closed') return true;
    return false;
  };

  return (
    <div className="flex border-b border-gray-100">
      <button
        onClick={() => handleStatusChange('all')}
        className={`flex-1 p-2 text-sm font-medium border-b-2 ${
          status === 'all' 
            ? 'border-current' 
            : 'border-transparent text-gray-500'
        }`}
        style={{ color: status === 'all' ? accentColor : undefined }}
      >
        All
      </button>
      <button
        onClick={() => handleStatusChange(onFilterChange ? 'ongoing' : 'open')}
        className={`flex-1 p-2 text-sm font-medium border-b-2 ${
          getButtonActiveState('open', status) || getButtonActiveState('ongoing', status)
            ? 'border-current' 
            : 'border-transparent text-gray-500'
        }`}
        style={{ color: (getButtonActiveState('open', status) || getButtonActiveState('ongoing', status)) ? accentColor : undefined }}
      >
        Open
      </button>
      <button
        onClick={() => handleStatusChange(onFilterChange ? 'resolved' : 'closed')}
        className={`flex-1 p-2 text-sm font-medium border-b-2 ${
          getButtonActiveState('closed', status) || getButtonActiveState('resolved', status)
            ? 'border-current' 
            : 'border-transparent text-gray-500'
        }`}
        style={{ color: (getButtonActiveState('closed', status) || getButtonActiveState('resolved', status)) ? accentColor : undefined }}
      >
        Closed
      </button>
    </div>
  );
};

export default StatusFilterTabs;
