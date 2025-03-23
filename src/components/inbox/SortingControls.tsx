
import { Button } from '@/components/ui/button';
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Clock,
  MessageSquare,
  AlertCircle,
  User
} from 'lucide-react';
import type { SortField } from '@/types/ticket';

interface SortingControlsProps {
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
  compact?: boolean;
}

const SortingControls = ({
  sortField,
  sortDirection,
  onSort,
  compact = false
}: SortingControlsProps) => {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUpAZ className="h-4 w-4" /> : <ArrowDownAZ className="h-4 w-4" />;
  };

  const getButtonVariant = (field: SortField) => {
    return sortField === field ? 'secondary' : 'ghost';
  };

  return (
    <div className="flex gap-1">
      <Button
        variant={getButtonVariant('createdAt')}
        size="sm"
        onClick={() => onSort('createdAt')}
        className="flex items-center"
      >
        <Clock className="h-4 w-4 mr-1" />
        {!compact && <span>Date</span>}
        {getSortIcon('createdAt')}
      </Button>
      
      <Button
        variant={getButtonVariant('subject')}
        size="sm"
        onClick={() => onSort('subject')}
        className="flex items-center"
      >
        <MessageSquare className="h-4 w-4 mr-1" />
        {!compact && <span>Subject</span>}
        {getSortIcon('subject')}
      </Button>
      
      <Button
        variant={getButtonVariant('priority')}
        size="sm"
        onClick={() => onSort('priority')}
        className="flex items-center"
      >
        <AlertCircle className="h-4 w-4 mr-1" />
        {!compact && <span>Priority</span>}
        {getSortIcon('priority')}
      </Button>
      
      <Button
        variant={getButtonVariant('assignee')}
        size="sm"
        onClick={() => onSort('assignee')}
        className="flex items-center"
      >
        <User className="h-4 w-4 mr-1" />
        {!compact && <span>Assignee</span>}
        {getSortIcon('assignee')}
      </Button>
    </div>
  );
};

export default SortingControls;
