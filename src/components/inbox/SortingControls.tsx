
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
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
  compact = false,
}: SortingControlsProps) => {
  if (compact) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="h-10 w-10 border-gray-200">
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48" align="end">
          <div className="space-y-1">
            <Button
              variant="ghost"
              onClick={() => onSort('date')}
              className={`w-full justify-between ${sortField === 'date' ? 'text-primary' : ''}`}
            >
              Date {sortField === 'date' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
            </Button>
            <Button
              variant="ghost"
              onClick={() => onSort('priority')}
              className={`w-full justify-between ${sortField === 'priority' ? 'text-primary' : ''}`}
            >
              Priority {sortField === 'priority' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
            </Button>
            <Button
              variant="ghost"
              onClick={() => onSort('status')}
              className={`w-full justify-between ${sortField === 'status' ? 'text-primary' : ''}`}
            >
              Status {sortField === 'status' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
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
