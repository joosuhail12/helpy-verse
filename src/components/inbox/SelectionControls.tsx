
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash, Share } from 'lucide-react';

interface SelectionControlsProps {
  onSelectAll: (checked: boolean) => void;
  selectedCount?: number;
  totalCount?: number;
  allSelected?: boolean;
  indeterminate?: boolean;
}

const SelectionControls = ({
  onSelectAll,
  selectedCount = 0,
  totalCount = 0,
  allSelected = false,
  indeterminate = false
}: SelectionControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="select-all-checkbox"
        checked={allSelected}
        data-state={indeterminate ? 'indeterminate' : allSelected ? 'checked' : 'unchecked'}
        onCheckedChange={onSelectAll}
      />
      
      <label
        htmlFor="select-all-checkbox"
        className="text-sm text-gray-700 cursor-pointer select-none"
      >
        {selectedCount === 0
          ? 'Select All'
          : `Selected ${selectedCount} of ${totalCount}`}
      </label>
      
      {selectedCount > 0 && (
        <div className="flex gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash className="h-4 w-4 mr-1" />
            <span className="sr-only sm:not-sr-only">Delete</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Share className="h-4 w-4 mr-1" />
            <span className="sr-only sm:not-sr-only">Share</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SelectionControls;
