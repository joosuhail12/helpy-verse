
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SortField, FilterEntity } from '@/types/tag';
import SortingControls from '@/components/inbox/SortingControls';

interface TagListControlsProps {
  totalTags: number;
  filterEntity: FilterEntity;
  onFilterChange: (value: FilterEntity) => void;
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
}

const TagListControls = ({
  totalTags,
  filterEntity,
  onFilterChange,
  sortField,
  sortDirection,
  onSort,
}: TagListControlsProps) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="text-sm text-gray-500">
        {totalTags} {totalTags === 1 ? 'tag' : 'tags'} total
      </div>
      <div className="flex items-center gap-4">
        <Select
          value={filterEntity}
          onValueChange={onFilterChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by entity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tags</SelectItem>
            <SelectItem value="tickets">Used in tickets</SelectItem>
            <SelectItem value="contacts">Used in contacts</SelectItem>
            <SelectItem value="companies">Used in companies</SelectItem>
          </SelectContent>
        </Select>
        <SortingControls
          sortField={sortField as any}
          sortDirection={sortDirection}
          onSort={onSort as any}
          compact
        />
      </div>
    </div>
  );
};

export default TagListControls;
