
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SelectionControlsProps {
  selectedCount?: number;
  totalCount?: number;
  onSelectAll?: (selected: boolean) => void;
  isAllSelected?: boolean;
  isIndeterminate?: boolean;
  onAssignSelected?: () => void;
  onMergeSelected?: () => void;
  onCloseSelected?: () => void;
  onDeleteSelected?: () => void;
  disabled?: boolean;
}

export const SelectionControls = ({
  selectedCount = 0,
  totalCount = 0,
  onSelectAll,
  isAllSelected = false,
  isIndeterminate = false,
  onAssignSelected,
  onMergeSelected,
  onCloseSelected,
  onDeleteSelected,
  disabled = false,
}: SelectionControlsProps) => {
  const handleSelectAllChange = (checked: boolean) => {
    if (onSelectAll) {
      onSelectAll(checked);
    }
  };

  return (
    <div className="flex items-center">
      {selectedCount > 0 ? (
        <>
          <div className="flex items-center gap-2 mr-2">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAllChange}
              data-state={isIndeterminate ? 'indeterminate' : isAllSelected ? 'checked' : 'unchecked'}
              disabled={disabled}
            />
            <span className="text-sm">{selectedCount} selected</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={disabled}>
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onAssignSelected}>Assign to...</DropdownMenuItem>
              <DropdownMenuItem onClick={onMergeSelected}>Merge tickets</DropdownMenuItem>
              <DropdownMenuItem onClick={onCloseSelected}>Close tickets</DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDeleteSelected}
                className="text-red-600 focus:text-red-600"
              >
                Delete tickets
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAllChange}
            disabled={disabled || totalCount === 0}
          />
          <span className="text-sm text-muted-foreground">Select all</span>
        </div>
      )}
    </div>
  );
};
