
import { Checkbox } from "@/components/ui/checkbox";

interface SelectionControlsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
}

const SelectionControls = ({
  selectedCount,
  totalCount,
  onSelectAll,
}: SelectionControlsProps) => {
  if (totalCount === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-4">
      <Checkbox
        checked={selectedCount === totalCount}
        onCheckedChange={onSelectAll}
        aria-label="Select all tickets"
      />
      <span className="text-sm text-gray-600">
        {selectedCount} selected
      </span>
    </div>
  );
};

export default SelectionControls;
