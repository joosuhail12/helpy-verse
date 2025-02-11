
import { ChevronUp, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { SortField, ViewMode } from '@/types/ticket';

interface SortingControlsProps {
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
}

const SortingControls = ({
  sortField,
  sortDirection,
  onSort,
}: SortingControlsProps) => {
  const getSortIcon = () => {
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          Sort
          {getSortIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSort('date')} className="gap-2">
          Date {sortField === 'date' && getSortIcon()}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort('priority')} className="gap-2">
          Priority {sortField === 'priority' && getSortIcon()}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort('status')} className="gap-2">
          Status {sortField === 'status' && getSortIcon()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortingControls;

