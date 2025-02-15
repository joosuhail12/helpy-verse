
import { Button } from '@/components/ui/button';

interface BulkActionsProps {
  selectedCount: number;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
  onBulkDelete: () => void;
}

export function BulkActions({ 
  selectedCount, 
  onBulkActivate, 
  onBulkDeactivate, 
  onBulkDelete 
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg animate-fadeSlideIn">
      <span className="text-sm font-medium">{selectedCount} selected</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkActivate}
        >
          Activate Selected
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkDeactivate}
        >
          Deactivate Selected
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onBulkDelete}
        >
          Delete Selected
        </Button>
      </div>
    </div>
  );
}
