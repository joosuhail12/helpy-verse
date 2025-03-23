
import { Button } from '@/components/ui/button';
import { LayoutList, MenuSquare } from 'lucide-react';
import type { ViewMode } from '@/types/ticket';

interface ViewToggleProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
}

const ViewToggle = ({ viewMode, onChangeViewMode }: ViewToggleProps) => {
  return (
    <div className="flex border rounded-md overflow-hidden">
      <Button
        variant="ghost"
        size="sm"
        className={`rounded-none ${
          viewMode === 'detailed'
            ? 'bg-primary/10 text-primary hover:bg-primary/20'
            : ''
        }`}
        onClick={() => onChangeViewMode('detailed')}
      >
        <LayoutList className="h-4 w-4 mr-1" />
        <span className="sr-only sm:not-sr-only">Detailed</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className={`rounded-none ${
          viewMode === 'compact'
            ? 'bg-primary/10 text-primary hover:bg-primary/20'
            : ''
        }`}
        onClick={() => onChangeViewMode('compact')}
      >
        <MenuSquare className="h-4 w-4 mr-1" />
        <span className="sr-only sm:not-sr-only">Compact</span>
      </Button>
    </div>
  );
};

export default ViewToggle;
