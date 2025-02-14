
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare, Trash2, FileDown } from 'lucide-react';

interface DomainBulkActionsProps {
  selectedCount: number;
  onVerify: () => void;
  onDelete: () => void;
  onExport: () => void;
}

export const DomainBulkActions = ({
  selectedCount,
  onVerify,
  onDelete,
  onExport,
}: DomainBulkActionsProps) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
      <div className="flex items-center gap-2">
        <CheckSquare className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {selectedCount} {selectedCount === 1 ? 'domain' : 'domains'} selected
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onVerify}
        >
          Verify Selected
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
};
