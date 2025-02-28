
import { useState } from 'react';
import { X, Plus, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { Contact } from '@/types/contact';
import { updateContact } from '@/store/slices/contacts/contactsSlice';
import { useToast } from '@/hooks/use-toast';

interface ContactTagsProps {
  contact: Contact;
}

export const ContactTags = ({ contact }: ContactTagsProps) => {
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const tags = Array.isArray(contact.tags) ? contact.tags : [];

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    if (tags.includes(newTag.trim())) {
      toast({
        title: "Tag already exists",
        description: "This contact already has this tag.",
        variant: "default",
      });
      return;
    }
    
    const updatedTags = [...tags, newTag.trim()];
    dispatch(updateContact({
      id: contact.id,
      data: { tags: updatedTags }
    }));
    
    setNewTag('');
    setIsAddingTag(false);
    
    toast({
      title: "Tag added",
      description: `Added tag "${newTag.trim()}" to contact.`,
    });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    dispatch(updateContact({
      id: contact.id,
      data: { tags: updatedTags }
    }));
    
    toast({
      title: "Tag removed",
      description: `Removed tag "${tagToRemove}" from contact.`,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Escape') {
      setIsAddingTag(false);
      setNewTag('');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-purple-900/70" />
          <h4 className="text-sm font-medium text-purple-900/70">Tags</h4>
        </div>
        
        {!isAddingTag && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingTag(true)}
            className="h-6 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Tag
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag}
            className="bg-purple-100 text-purple-800 rounded-full px-2 py-1 text-xs flex items-center gap-1"
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="text-purple-800/70 hover:text-purple-800"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        
        {tags.length === 0 && !isAddingTag && (
          <div className="text-gray-500 text-xs italic">No tags added yet</div>
        )}
        
        {isAddingTag && (
          <div className="flex items-center gap-1">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add tag..."
              className="h-7 text-xs"
              autoFocus
            />
            <Button
              size="sm"
              className="h-7 text-xs"
              onClick={handleAddTag}
              disabled={!newTag.trim()}
            >
              Add
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                setIsAddingTag(false);
                setNewTag('');
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
