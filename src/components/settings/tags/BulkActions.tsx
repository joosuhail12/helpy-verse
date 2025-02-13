
import { Button } from "@/components/ui/button";

interface BulkActionsProps {
  selectedCount: number;
  onEditSelected: () => void;
  onDeleteSelected: () => void;
}

const BulkActions = ({ selectedCount, onEditSelected, onDeleteSelected }: BulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="mb-4 flex items-center justify-between bg-gray-50 p-4 rounded-lg">
      <span className="text-sm text-gray-600">{selectedCount} tags selected</span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onEditSelected}
        >
          Edit selected
        </Button>
        <Button
          variant="destructive"
          onClick={onDeleteSelected}
        >
          Delete selected
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;
