
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Toggle } from "@/components/ui/toggle";
import type { SortField, ViewMode } from '@/types/ticket';

interface SortingControlsProps {
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  viewMode: ViewMode;
  onSort: (field: SortField) => void;
  onViewModeChange: (mode: ViewMode) => void;
}

const SortingControls = ({
  sortField,
  sortDirection,
  viewMode,
  onSort,
  onViewModeChange,
}: SortingControlsProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2" role="group" aria-label="Sort options">
        <button
          onClick={() => onSort('date')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            sortField === 'date' ? 'text-primary' : 'text-gray-600'
          }`}
          aria-pressed={sortField === 'date'}
        >
          Date {sortField === 'date' && (sortDirection === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />)}
        </button>
        <button
          onClick={() => onSort('priority')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            sortField === 'priority' ? 'text-primary' : 'text-gray-600'
          }`}
          aria-pressed={sortField === 'priority'}
        >
          Priority {sortField === 'priority' && (sortDirection === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />)}
        </button>
        <button
          onClick={() => onSort('status')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            sortField === 'status' ? 'text-primary' : 'text-gray-600'
          }`}
          aria-pressed={sortField === 'status'}
        >
          Status {sortField === 'status' && (sortDirection === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />)}
        </button>
      </div>

      <Toggle
        pressed={viewMode === 'compact'}
        onPressedChange={(pressed) => onViewModeChange(pressed ? 'compact' : 'expanded')}
        aria-label="Toggle view mode"
      >
        {viewMode === 'compact' ? 'Expanded' : 'Compact'} View
      </Toggle>
    </div>
  );
};

export default SortingControls;
