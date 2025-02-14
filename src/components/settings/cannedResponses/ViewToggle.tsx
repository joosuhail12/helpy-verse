
import { List, Grid } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ViewToggleProps {
  view: 'list' | 'grid';
  onViewChange: (view: 'list' | 'grid') => void;
}

export const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <ToggleGroup 
      type="single" 
      value={view} 
      onValueChange={(v) => onViewChange(v as 'list' | 'grid')}
      className="border-[#9b87f5] transition-all duration-300"
    >
      <ToggleGroupItem 
        value="list" 
        aria-label="List view"
        className="data-[state=on]:bg-[#9b87f5] data-[state=on]:text-white transition-all duration-300 hover:scale-105"
      >
        <List className="h-4 w-4 transition-transform duration-200" />
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="grid" 
        aria-label="Grid view"
        className="data-[state=on]:bg-[#9b87f5] data-[state=on]:text-white transition-all duration-300 hover:scale-105"
      >
        <Grid className="h-4 w-4 transition-transform duration-200" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

