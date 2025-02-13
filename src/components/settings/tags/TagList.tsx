
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Tag, SortField, FilterEntity } from '@/types/tag';
import { useTagShortcuts } from '@/hooks/useTagShortcuts';
import { fetchTags } from '@/api/tagsApi';
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
  const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterEntity, setFilterEntity] = useState<FilterEntity>('all');
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['tags', searchQuery, filterEntity, sortField, sortDirection, currentPage, itemsPerPage],
    queryFn: () => fetchTags(searchQuery, filterEntity, sortField, sortDirection, currentPage, itemsPerPage),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    keepPreviousData: true,
    meta: {
      onError: (error: Error) => {
        toast({
          title: 'Error loading tags',
          description: error.message,
          variant: 'destructive',
        });
      },
    },
  });

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
    if (!data) return;
    if (selectedTags.length === data.tags.length) {
      setSelectedTags([]);
    } else {
      setSelectedTags(data.tags.map(tag => tag.id));
    }
  };

  const handleSelectTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
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

  if (!data) {
    return null;
  }

  const totalPages = Math.ceil(data.total / itemsPerPage);

  return (
    <div>
      <TagListControls
        totalTags={data.total}
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

      {data.tags.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No tags found matching your search.
        </div>
      ) : (
        <>
          <TagTable
            tags={data.tags}
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
