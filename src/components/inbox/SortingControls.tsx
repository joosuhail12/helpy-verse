
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { SortField } from '@/types/ticket';

interface SortingControlsProps {
  sortField?: SortField;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: SortField) => void;
  compact?: boolean;
}

export const SortingControls = ({ sortField = 'createdAt', sortDirection = 'desc', onSort, compact = false }: SortingControlsProps) => {
  const sortOptions: { label: string; value: SortField }[] = [
    { label: 'Created Date', value: 'createdAt' },
    { label: 'Updated Date', value: 'updatedAt' },
    { label: 'Priority', value: 'priority' },
    { label: 'Status', value: 'status' },
    { label: 'Subject', value: 'subject' },
    { label: 'Customer', value: 'customer' },
    { label: 'Company', value: 'company' },
    { label: 'Assignee', value: 'assignee' },
  ];

  const getSortIcon = () => {
    if (sortDirection === 'asc') return <ArrowUp className="h-4 w-4" />;
    return <ArrowDown className="h-4 w-4" />;
  };

  const handleSortClick = (field: SortField) => {
    if (onSort) onSort(field);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center">
          {compact ? (
            <ArrowUpDown className="h-4 w-4" />
          ) : (
            <>
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <span>Sort by: {sortOptions.find(o => o.value === sortField)?.label || 'Created Date'}</span>
              {getSortIcon()}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sortOptions.map((option) => (
          <DropdownMenuItem 
            key={option.value} 
            onClick={() => handleSortClick(option.value)}
            className={sortField === option.value ? 'bg-primary/10 font-medium' : ''}
          >
            {option.label}
            {sortField === option.value && getSortIcon()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
