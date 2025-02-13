
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
  counts: {
    tickets: number;
    contacts: number;
    companies: number;
  };
}

// Updated mock data to include counts for different entities
const mockTags: Tag[] = [
  { 
    id: '1', 
    name: 'Bug', 
    color: '#EF4444', 
    counts: { tickets: 23, contacts: 5, companies: 2 } 
  },
  { 
    id: '2', 
    name: 'Feature Request', 
    color: '#3B82F6', 
    counts: { tickets: 15, contacts: 3, companies: 1 } 
  },
  { 
    id: '3', 
    name: 'Support', 
    color: '#10B981', 
    counts: { tickets: 45, contacts: 12, companies: 8 } 
  },
  { 
    id: '4', 
    name: 'Documentation', 
    color: '#F59E0B', 
    counts: { tickets: 8, contacts: 0, companies: 1 } 
  },
  { 
    id: '5', 
    name: 'Design', 
    color: '#8B5CF6', 
    counts: { tickets: 12, contacts: 4, companies: 2 } 
  }
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
              <div className="flex gap-3 text-sm text-gray-500">
                <span>{tag.counts.tickets} tickets</span>
                <span>•</span>
                <span>{tag.counts.contacts} contacts</span>
                <span>•</span>
                <span>{tag.counts.companies} companies</span>
              </div>
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
