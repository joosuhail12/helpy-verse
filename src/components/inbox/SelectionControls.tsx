
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface SelectionControlsProps {
  selectedCount?: number;
  totalCount?: number;
  onSelectAll: (checked: boolean) => void;
  allSelected?: boolean;
  indeterminate?: boolean;
}

const SelectionControls = ({
  selectedCount = 0,
  totalCount = 0,
  onSelectAll,
  allSelected = false,
  indeterminate = false,
}: SelectionControlsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        checked={allSelected}
        onCheckedChange={(checked) => onSelectAll(checked as boolean)}
        data-state={indeterminate ? "indeterminate" : allSelected ? "checked" : "unchecked"}
        className={indeterminate ? "data-[state=indeterminate]:bg-primary" : ""}
      />
      {selectedCount > 0 ? (
        <span className="text-sm">
          Selected <span className="font-medium">{selectedCount}</span> of{" "}
          <span className="font-medium">{totalCount}</span>
        </span>
      ) : (
        <span className="text-sm text-gray-500">Select all</span>
      )}
    </div>
  );
};

export default SelectionControls;
