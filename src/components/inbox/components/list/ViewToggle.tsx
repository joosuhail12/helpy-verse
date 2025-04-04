
import { LayoutList, LayoutGrid } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ViewMode } from '@/types/ticket';

interface ViewToggleProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
}

const ViewToggle = ({ viewMode, onChangeViewMode }: ViewToggleProps) => {
  return (
    <ToggleGroup type="single" value={viewMode} onValueChange={(value) => {
      if (value) onChangeViewMode(value as ViewMode);
    }}>
      <ToggleGroupItem value="list" aria-label="List view">
        <LayoutList className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="card" aria-label="Card view">
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ViewToggle;
