
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare, Square, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SelectionControlsProps {
  selectedCount?: number;
  totalCount?: number;
  onSelectAll?: (checked: boolean) => void;
  allSelected?: boolean;
  indeterminate?: boolean;
}

export const SelectionControls = ({ 
  selectedCount = 0, 
  totalCount = 0,
  onSelectAll, 
  allSelected = false,
  indeterminate = false
}: SelectionControlsProps) => {
  return (
    <div className="flex items-center">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center" 
        onClick={() => onSelectAll && onSelectAll(!allSelected)}
      >
        {indeterminate ? (
          <div className="h-4 w-4 border-2 border-primary flex items-center justify-center rounded">
            <div className="h-2 w-2 bg-primary"></div>
          </div>
        ) : allSelected ? (
          <CheckSquare className="h-4 w-4 text-primary" />
        ) : (
          <Square className="h-4 w-4" />
        )}
        <span className="ml-2 mr-1">Select</span>
        {selectedCount > 0 && (
          <span className="text-xs bg-primary/10 text-primary rounded-full px-1.5 py-0.5">
            {selectedCount}
          </span>
        )}
      </Button>

      {selectedCount > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="px-1">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onSelectAll && onSelectAll(true)}>
              Select All ({totalCount})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSelectAll && onSelectAll(false)}>
              Deselect All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
