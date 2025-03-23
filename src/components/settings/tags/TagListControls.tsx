
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { SortingControls } from "@/components/inbox/SortingControls";
import { SortField, FilterEntity } from "@/types/tag";

interface TagListControlsProps {
  onCreateTag: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalTags?: number;
  filterEntity?: FilterEntity;
  onFilterChange?: (entity: FilterEntity) => void;
  sortField?: SortField;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: SortField) => void;
}

const TagListControls = ({ 
  onCreateTag, 
  searchQuery, 
  onSearchChange,
  totalTags,
  filterEntity,
  onFilterChange,
  sortField,
  sortDirection,
  onSort
}: TagListControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-between">
      <div className="flex flex-1 items-center">
        <Input 
          placeholder="Search tags..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="flex gap-2">
        {sortField && sortDirection && onSort && (
          <SortingControls />
        )}
        <Button onClick={onCreateTag}>
          <Plus className="h-4 w-4 mr-2" />
          Create Tag
        </Button>
      </div>
    </div>
  );
};

export default TagListControls;
