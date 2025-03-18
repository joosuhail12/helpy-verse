
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContact, clearSelection } from '@/store/slices/contacts/contactsSlice';
import { Tag, ChevronDown, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Contact } from '@/types/contact';

interface TagActionsProps {
  selectedContactIds: string[];
  contacts: Contact[];
}

export const TagActions: React.FC<TagActionsProps> = ({ selectedContactIds, contacts }) => {
  const [newTag, setNewTag] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  // Get all existing tags from contacts
  const allTags = Array.from(
    new Set(
      contacts
        .flatMap(contact => contact.tags || [])
        .filter(tag => tag) // Filter out null/undefined
    )
  ).sort();

  const handleAddTag = async (tag: string) => {
    try {
      for (const contactId of selectedContactIds) {
        const contact = contacts.find(c => c.id === contactId);
        if (contact) {
          const existingTags = contact.tags || [];
          if (!existingTags.includes(tag)) {
            await dispatch(updateContact({
              contactId,
              data: { tags: [...existingTags, tag] }
            })).unwrap();
          }
        }
      }

      toast({
        title: "Tags added",
        description: `Added tag "${tag}" to ${selectedContactIds.length} contacts`,
      });
      
      setNewTag('');
      setShowAddTag(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add tags",
        variant: "destructive",
      });
    }
  };

  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      handleAddTag(newTag.trim());
    }
  };

  if (selectedContactIds.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Tag className="mr-2 h-4 w-4" />
          Manage Tags <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {allTags.length > 0 ? (
          <>
            <div className="p-2 text-sm font-medium">Add existing tag</div>
            {allTags.map(tag => (
              <DropdownMenuItem key={tag} onClick={() => handleAddTag(tag)}>
                <span className="text-sm">{tag}</span>
              </DropdownMenuItem>
            ))}
          </>
        ) : (
          <div className="p-2 text-sm text-muted-foreground">No existing tags</div>
        )}
        
        <DropdownMenuSeparator />
        
        {showAddTag ? (
          <form onSubmit={handleCreateTag} className="p-2">
            <Input
              size={1}
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter new tag"
              className="mb-2"
              autoFocus
            />
            <div className="flex gap-2">
              <Button 
                type="submit" 
                variant="outline" 
                size="sm" 
                className="w-full"
                disabled={!newTag.trim()}
              >
                Add
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAddTag(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <DropdownMenuItem onClick={() => setShowAddTag(true)}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Create new tag</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
