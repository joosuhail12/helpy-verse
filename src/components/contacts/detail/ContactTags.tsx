
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, X } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContact } from '@/store/slices/contacts/contactsSlice';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ContactTagsProps {
  contactId: string;
  tags: string[];
}

export const ContactTags: React.FC<ContactTagsProps> = ({ contactId, tags }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const allTags = useAppSelector((state) => state.tags.items);
  
  const handleAddTag = (tagId: string) => {
    // Only add if not already in the array
    if (!tags.includes(tagId)) {
      dispatch(updateContact({
        contactId,
        data: { tags: [...tags, tagId] }
      }));
    }
    setOpen(false);
  };
  
  const handleRemoveTag = (tagId: string) => {
    dispatch(updateContact({
      contactId,
      data: { tags: tags.filter(id => id !== tagId) }
    }));
  };
  
  const getTagById = (tagId: string) => {
    return allTags.find(tag => tag.id === tagId);
  };
  
  // Filter out tags that are already assigned
  const availableTags = allTags.filter(tag => !tags.includes(tag.id));
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Tags</h3>
        
        {availableTags.length > 0 && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Tag
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="end" side="bottom">
              <Command>
                <CommandInput placeholder="Search tags..." />
                <CommandList>
                  <CommandEmpty>No tags found.</CommandEmpty>
                  <CommandGroup>
                    {availableTags.map((tag) => (
                      <CommandItem
                        key={tag.id}
                        onSelect={() => handleAddTag(tag.id)}
                      >
                        {tag.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((tagId) => {
            const tag = getTagById(tagId);
            return tag ? (
              <Badge key={tagId} variant="outline" className="flex items-center gap-1 pr-1">
                {tag.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveTag(tagId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ) : null;
          })
        ) : (
          <p className="text-sm text-muted-foreground">No tags assigned</p>
        )}
      </div>
    </div>
  );
};
