
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import type { Tag } from '@/types/tag';

interface TagActionsProps {
  tag: Tag;
  onEdit: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
}

const TagActions = ({ tag, onEdit, onDelete }: TagActionsProps) => {
  return (
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
              <DropdownMenuItem onClick={() => onEdit(tag)}>
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
                onClick={() => onDelete(tag)}
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
  );
};

export default TagActions;
