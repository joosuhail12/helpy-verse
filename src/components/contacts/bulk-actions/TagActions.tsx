
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContact, clearSelection } from '@/store/slices/contacts/contactsSlice';
import { ChevronDown, Tags, Plus, X } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';

interface TagActionsProps {
  selectedContactIds: string[];
}

export const TagActions: React.FC<TagActionsProps> = ({ selectedContactIds }) => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const tags = useAppSelector((state) => state.tags.items);

  const handleAddTag = async (tag: string) => {
    try {
      // Update each contact
      for (const contactId of selectedContactIds) {
        await dispatch(updateContact({
          contactId,
          data: { tags: [tag] }
        })).unwrap();
      }

      toast({
        title: "Tags updated",
        description: `Added tag to ${selectedContactIds.length} contacts`,
      });

      dispatch(clearSelection());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact tags",
        variant: "destructive",
      });
    }
  };

  const handleRemoveTag = async (tag: string) => {
    try {
      // Update each contact with removed tag
      // This would need to be improved to get the current tags for each contact
      for (const contactId of selectedContactIds) {
        await dispatch(updateContact({
          contactId,
          data: { tags: [] }
        })).unwrap();
      }

      toast({
        title: "Tags updated",
        description: `Removed tag from ${selectedContactIds.length} contacts`,
      });

      dispatch(clearSelection());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact tags",
        variant: "destructive",
      });
    }
  };

  if (selectedContactIds.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Tags className="mr-2 h-4 w-4" /> Manage Tags <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="px-2 py-1.5 text-sm font-semibold">Add Tag</div>
        {tags.map((tag) => (
          <DropdownMenuItem key={`add-${tag.id}`} onClick={() => handleAddTag(tag.id)}>
            <Plus className="mr-2 h-4 w-4 text-green-500" />
            {tag.name}
          </DropdownMenuItem>
        ))}
        <div className="px-2 py-1.5 text-sm font-semibold border-t mt-2 pt-2">Remove Tag</div>
        {tags.map((tag) => (
          <DropdownMenuItem key={`remove-${tag.id}`} onClick={() => handleRemoveTag(tag.id)}>
            <X className="mr-2 h-4 w-4 text-red-500" />
            {tag.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
