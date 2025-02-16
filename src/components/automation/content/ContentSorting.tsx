
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setSortField, setSortDirection, type SortField } from '@/store/slices/content/contentSlice';

export const ContentSorting = () => {
  const dispatch = useAppDispatch();
  const sort = useAppSelector((state) => state.content.sort);

  const handleSort = (field: SortField) => {
    if (sort.field === field) {
      dispatch(setSortDirection(sort.direction === 'asc' ? 'desc' : 'asc'));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortDirection('asc'));
    }
  };

  const renderSortButton = (field: SortField, label: string) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className={`flex items-center gap-1 ${
        sort.field === field ? 'text-purple-600' : 'text-gray-600'
      }`}
    >
      {label}
      {sort.field === field && (
        sort.direction === 'asc' ? (
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
