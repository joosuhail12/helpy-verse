
import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import EditTagDialog from './EditTagDialog';
import DeleteTagDialog from './DeleteTagDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <div>
      <div className="mb-4 text-sm text-gray-500">
        {filteredTags.length} {filteredTags.length === 1 ? 'tag' : 'tags'} total
      </div>

      {filteredTags.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No tags found matching your search.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded flex-shrink-0 transition-all duration-200 hover:scale-110 cursor-pointer"
                      style={{ 
                        backgroundColor: tag.color,
                        boxShadow: `0 0 0 4px ${tag.color}15`
                      }}
                      title={`Color: ${tag.color}`}
                    />
                    <span className="font-medium text-gray-900">{tag.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-3 text-sm">
                    <span className="text-indigo-600/70">{tag.counts.tickets} tickets</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-purple-600/70">{tag.counts.contacts} contacts</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-blue-600/70">{tag.counts.companies} companies</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Tag actions</p>
                        </TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent align="end">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuItem onClick={() => setTagToEdit(tag)}>
                              Edit
                            </DropdownMenuItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit tag details</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setTagToDelete(tag)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete this tag</p>
                          </TooltipContent>
                        </Tooltip>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

