
import { useState } from 'react';
import { Plus, Search, Tag as TagIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TagList from '@/components/settings/tags/TagList';
import CreateTagDialog from '@/components/settings/tags/CreateTagDialog';
import { useTagShortcuts } from '@/hooks/useTagShortcuts';
import TagsErrorBoundary from '@/components/settings/tags/TagsErrorBoundary';

const ITEMS_PER_PAGE = 10;

const Tags = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useTagShortcuts({
    onCreateTag: () => setIsCreateDialogOpen(true),
    hasSelection: false,
  });
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage tags to organize and categorize tickets
            <span className="ml-2 text-gray-400">
              (Press Ctrl/Cmd + N to create a new tag)
            </span>
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Tag
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <TagsErrorBoundary>
          <TagList 
            searchQuery={searchQuery}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </TagsErrorBoundary>
      </div>

      <CreateTagDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default Tags;
