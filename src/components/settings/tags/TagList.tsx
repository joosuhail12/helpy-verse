import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import type { Tag, SortField, FilterEntity } from '@/types/tag';
import { useTagShortcuts } from '@/hooks/useTagShortcuts';
import {
  fetchTags,
  selectTags,
  selectTagsTotal,
  selectTagsLoading,
  selectTagsError,
  selectSelectedTags,
  setPage,
  setSort,
  setFilter,
  selectTag,
  selectAllTags,
} from '@/store/slices/tagsSlice';
import EditTagDialog from './EditTagDialog';
import DeleteTagDialog from './DeleteTagDialog';
import BulkActions from './BulkActions';
import TagTable from './TagTable';
import TagListControls from './TagListControls';
import TagPagination from './TagPagination';
import { useToast } from '@/components/ui/use-toast';

interface TagListProps {
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const TagList = ({ searchQuery, currentPage, itemsPerPage, onPageChange }: TagListProps) => {
  const dispatch = useAppDispatch();
  const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterEntity, setFilterEntity] = useState<FilterEntity>('all');
  
  const tags = useAppSelector(selectTags);
  const total = useAppSelector(selectTagsTotal);
  const isLoading = useAppSelector(selectTagsLoading);
  const error = useAppSelector(selectTagsError);
  const selectedTags = useAppSelector(selectSelectedTags);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchTags({
      searchQuery,
      filterEntity,
      sortField,
      sortDirection,
      page: currentPage,
      limit: itemsPerPage,
    }));
  }, [dispatch, searchQuery, filterEntity, sortField, sortDirection, currentPage, itemsPerPage]);

  useTagShortcuts({
    onCreateTag: () => {}, // Handled at the page level
    onBulkEdit: () => selectedTags.length > 0 && handleBulkEdit(),
    onBulkDelete: () => selectedTags.length > 0 && handleBulkDelete(),
    hasSelection: selectedTags.length > 0,
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    dispatch(selectAllTags(tags.map(tag => tag.id)));
  };

  const handleSelectTag = (tagId: string) => {
    dispatch(selectTag(tagId));
  };

  const handleBulkDelete = () => {
    const bulkDeleteTag: Tag = {
      id: selectedTags.join(','),
      name: `${selectedTags.length} tags`,
      color: '',
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      trend: 'stable',
      counts: { tickets: 0, contacts: 0, companies: 0 },
      history: [],
      preview: []
    };
    setTagToDelete(bulkDeleteTag);
  };

  const handleBulkEdit = () => {
    const bulkEditTag: Tag = {
      id: selectedTags.join(','),
      name: '',
      color: '',
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      trend: 'stable',
      counts: { tickets: 0, contacts: 0, companies: 0 },
      history: [],
      preview: []
    };
    setTagToEdit(bulkEditTag);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading tags...
      </div>
    );
  }

  if (error) {
    throw error; // This will be caught by the error boundary
  }

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div>
      <TagListControls
        totalTags={total}
        filterEntity={filterEntity}
        onFilterChange={setFilterEntity}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      <BulkActions
        selectedCount={selectedTags.length}
        onEditSelected={handleBulkEdit}
        onDeleteSelected={handleBulkDelete}
      />

      {tags.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No tags found matching your search.
        </div>
      ) : (
        <>
          <TagTable
            tags={tags}
            selectedTags={selectedTags}
            onSelectAll={handleSelectAll}
            onSelectTag={handleSelectTag}
            onEditTag={setTagToEdit}
            onDeleteTag={setTagToDelete}
          />

          <TagPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}

      {tagToEdit && (
        <EditTagDialog
          tag={tagToEdit}
          open={!!tagToEdit}
          onOpenChange={() => setTagToEdit(null)}
        />
      )}

      {tagToDelete && (
        <DeleteTagDialog
          tag={tagToDelete}
          open={!!tagToDelete}
          onOpenChange={() => setTagToDelete(null)}
        />
      )}
    </div>
  );
};

export default TagList;
