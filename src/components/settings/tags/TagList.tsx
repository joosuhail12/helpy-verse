
import { useState } from 'react';
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

// Temporary mock data - replace with actual data fetching
const mockTags: Tag[] = [
  { id: '1', name: 'Bug', color: '#EF4444', count: 23 },
  { id: '2', name: 'Feature Request', color: '#3B82F6', count: 15 },
  { id: '3', name: 'Support', color: '#10B981', count: 45 },
];

interface TagListProps {
  searchQuery: string;
}

const TagList = ({ searchQuery }: TagListProps) => {
  const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);

  const filteredTags = mockTags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="divide-y divide-gray-100">
      {filteredTags.map((tag) => (
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
              {tag.count} tickets
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
      ))}

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
