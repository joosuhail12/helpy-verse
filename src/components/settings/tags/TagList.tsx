
import { useState, useEffect } from 'react';
import { MoreHorizontal, Tag as TagIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import EditTagDialog from './EditTagDialog';
import DeleteTagDialog from './DeleteTagDialog';

interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
}

// More realistic mock data with various colors and categories
const mockTags: Tag[] = [
  { id: '1', name: 'Bug', color: '#EF4444', count: 23 },
  { id: '2', name: 'Feature Request', color: '#3B82F6', count: 15 },
  { id: '3', name: 'Support', color: '#10B981', count: 45 },
  { id: '4', name: 'Documentation', color: '#F59E0B', count: 8 },
  { id: '5', name: 'Design', color: '#8B5CF6', count: 12 },
  { id: '6', name: 'Security', color: '#DC2626', count: 5 },
  { id: '7', name: 'Performance', color: '#6366F1', count: 19 },
  { id: '8', name: 'Question', color: '#2DD4BF', count: 31 },
  { id: '9', name: 'Enhancement', color: '#EC4899', count: 27 },
  { id: '10', name: 'Invalid', color: '#9CA3AF', count: 3 }
];

interface TagListProps {
  searchQuery: string;
}

const TagList = ({ searchQuery }: TagListProps) => {
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="divide-y divide-gray-100">
      {filteredTags.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No tags found matching your search.
        </div>
      ) : (
        filteredTags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: tag.color }}
              />
              <span className="font-medium text-gray-900">{tag.name}</span>
              <span className="text-sm text-gray-500">
                {tag.count} {tag.count === 1 ? 'ticket' : 'tickets'}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTagToEdit(tag)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => setTagToDelete(tag)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))
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
