
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setSortField, setSortDirection } from '@/store/slices/content/contentSlice';
import type { SortField } from '@/types/content';

export const ContentSorting = () => {
  const dispatch = useAppDispatch();
  const { field, direction } = useAppSelector((state) => state.content.sort);

  const handleSort = (sortField: SortField) => {
    if (sortField === field) {
      dispatch(setSortDirection(direction === 'asc' ? 'desc' : 'asc'));
    } else {
      dispatch(setSortField(sortField));
      dispatch(setSortDirection('asc'));
    }
  };

  const renderSortButton = (sortField: SortField, label: string) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(sortField)}
      className={`flex items-center gap-1 ${
        field === sortField ? 'text-purple-600' : 'text-gray-600'
      }`}
    >
      {label}
      {field === sortField && (
        direction === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )
      )}
    </Button>
  );

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Sort by:</span>
      {renderSortButton('lastUpdated', 'Last Updated')}
      {renderSortButton('messageCount', 'Messages')}
      {renderSortButton('title', 'Title')}
    </div>
  );
};
