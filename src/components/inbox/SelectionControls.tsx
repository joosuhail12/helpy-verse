
import { Checkbox } from "@/components/ui/checkbox";

interface SelectionControlsProps {
  selectedCount?: number;
  totalCount?: number;
  allSelected?: boolean;
  indeterminate?: boolean;
  onSelectAll: (checked: boolean) => void;
}

const SelectionControls = ({ 
  selectedCount = 0, 
  totalCount = 0, 
  allSelected = false, 
  indeterminate = false, 
  onSelectAll 
}: SelectionControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox 
        checked={allSelected}
        data-state={indeterminate ? "indeterminate" : allSelected ? "checked" : "unchecked"}
        onCheckedChange={onSelectAll}
        aria-label={`Select all ${totalCount} items`}
      />
      {selectedCount > 0 && (
        <span className="text-sm text-gray-600">
          {selectedCount} selected
        </span>
      )}
    </div>
  );
};

export default SelectionControls;
