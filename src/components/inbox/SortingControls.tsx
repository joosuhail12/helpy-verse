
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import type { SortField, ViewMode } from '@/types/ticket';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SortingControlsProps {
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  viewMode: ViewMode;
  onSort: (field: SortField) => void;
  onViewModeChange: (mode: ViewMode) => void;
  compact?: boolean;
}

const SortingControls = ({
  sortField,
  sortDirection,
  onSort,
  compact = false,
}: Omit<SortingControlsProps, 'viewMode' | 'onViewModeChange'>) => {
  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onSort('date')}>
            Date {sortField === 'date' && (sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />)}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort('priority')}>
            Priority {sortField === 'priority' && (sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />)}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort('status')}>
            Status {sortField === 'status' && (sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />)}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

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
    </div>
  );
};

export default SortingControls;
