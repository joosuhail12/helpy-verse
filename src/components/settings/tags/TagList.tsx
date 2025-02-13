
import { useState } from 'react';
import type { Tag, SortField, FilterEntity } from '@/types/tag';
import { useTags } from '@/hooks/useTags';
import { useTagShortcuts } from '@/hooks/useTagShortcuts';
import EditTagDialog from './EditTagDialog';
import DeleteTagDialog from './DeleteTagDialog';
import BulkActions from './BulkActions';
import TagTable from './TagTable';
import TagListControls from './TagListControls';
import TagPagination from './TagPagination';

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

  const { tags } = useTags(searchQuery, filterEntity, sortField, sortDirection);

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
    if (selectedTags.length === paginatedTags.length) {
      setSelectedTags([]);
    } else {
      setSelectedTags(paginatedTags.map(tag => tag.id));
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
    setTagToDelete({ id: selectedTags.join(','), name: `${selectedTags.length} tags`, color: '', counts: { tickets: 0, contacts: 0, companies: 0 } });
  };

  const handleBulkEdit = () => {
    setTagToEdit({ id: selectedTags.join(','), name: '', color: '', counts: { tickets: 0, contacts: 0, companies: 0 } });
  };

  const totalPages = Math.ceil(tags.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTags = tags.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <TagListControls
        totalTags={tags.length}
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
            tags={paginatedTags}
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
