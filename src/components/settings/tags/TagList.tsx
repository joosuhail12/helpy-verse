
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { 
  fetchTags, 
  updateTag, 
  deleteTags 
} from '@/store/slices/tags/tagsSlice';
import { Tag, SortField } from '@/types/tag';
import TagTable from './TagTable';
import { Button } from '@/components/ui/button';
import { Tag as TagIcon, Plus, AlertTriangle } from 'lucide-react';
import EditTagDialog from './EditTagDialog';
import DeleteTagDialog from './DeleteTagDialog';
import TagPagination from './TagPagination';
import BulkActions from './BulkActions';
import { TagUsageStats } from './TagUsageStats';

// Define props interface for TagList
interface TagListProps {
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const TagList: React.FC<TagListProps> = ({ 
  searchQuery, 
  currentPage, 
  itemsPerPage, 
  onPageChange 
}) => {
  const dispatch = useAppDispatch();
  const { tags, loading, error, total } = useAppSelector(state => state.tags);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState<Tag | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    dispatch(fetchTags({ page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage, itemsPerPage]);

  // Filter tags based on search query
  const filteredTags = searchQuery 
    ? tags.filter(tag => 
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tags;

  // Sort the filtered tags
  const sortedTags = [...filteredTags].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    // Add other sort fields as needed
    return 0;
  });

  const handleEditTag = (tag: Tag) => {
    setCurrentTag(tag);
    setIsEditDialogOpen(true);
  };

  const handleDeleteTag = (tag: Tag) => {
    setCurrentTag(tag);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateTag = (id: string, tag: Partial<Tag>) => {
    dispatch(updateTag({ id, tag }));
    setIsEditDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (currentTag) {
      dispatch(deleteTags([currentTag.id]));
    }
    setIsDeleteDialogOpen(false);
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  if (loading && tags.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2.5"></div>
          <div className="h-10 bg-gray-200 rounded w-full mb-2.5"></div>
          <div className="h-10 bg-gray-200 rounded w-full mb-2.5"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-xl font-medium mb-2">Error loading tags</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => dispatch(fetchTags({ page: currentPage, limit: itemsPerPage }))}>
          Try Again
        </Button>
      </div>
    );
  }

  if (filteredTags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <TagIcon className="h-8 w-8 text-gray-500" />
        </div>
        {searchQuery ? (
          <>
            <h3 className="text-xl font-medium mb-2">No tags match your search</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search term or create a new tag.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-xl font-medium mb-2">No tags yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first tag to organize your content.
            </p>
          </>
        )}
        <Button onClick={() => {/* Open create tag dialog */}}>
          <Plus className="mr-2 h-4 w-4" />
          Create Tag
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedTagIds.length > 0 ? (
        <BulkActions 
          selectedCount={selectedTagIds.length} 
          onClearSelection={() => setSelectedTagIds([])} 
        />
      ) : (
        <TagUsageStats />
      )}
      
      <TagTable 
        tags={sortedTags} 
        onEdit={handleEditTag}
        onDelete={handleDeleteTag}
        selectedTagIds={selectedTagIds}
        setSelectedTagIds={setSelectedTagIds}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={(field) => {
          if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
          } else {
            setSortField(field);
            setSortDirection('asc');
          }
        }}
      />
      
      {totalPages > 1 && (
        <TagPagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={onPageChange}
          totalItems={total}
          itemsPerPage={itemsPerPage}
        />
      )}
      
      {currentTag && (
        <>
          <EditTagDialog 
            open={isEditDialogOpen} 
            onOpenChange={setIsEditDialogOpen}
            tag={currentTag}
            onUpdate={(data) => handleUpdateTag(currentTag.id, data)}
          />
          
          <DeleteTagDialog 
            open={isDeleteDialogOpen} 
            onOpenChange={setIsDeleteDialogOpen}
            tagName={currentTag.name}
            onConfirm={handleConfirmDelete}
          />
        </>
      )}
    </div>
  );
};

export default TagList;
