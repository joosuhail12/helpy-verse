
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutList, LayoutGrid } from 'lucide-react';
import type { ViewMode } from '@/types/ticket';

interface ViewToggleProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
}

const ViewToggle = ({ viewMode, onChangeViewMode }: ViewToggleProps) => {
  return (
    <div className="flex border rounded-md overflow-hidden">
      <Button
        variant={viewMode === 'compact' ? "default" : "ghost"}
        size="sm"
        className="rounded-none px-2"
        onClick={() => onChangeViewMode('compact')}
        title="Compact view"
      >
        <LayoutList className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === 'detailed' ? "default" : "ghost"}
        size="sm"
        className="rounded-none px-2"
        onClick={() => onChangeViewMode('detailed')}
        title="Detailed view"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewToggle;
