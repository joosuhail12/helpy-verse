
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag, X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectAllTags, fetchTags } from '@/store/slices/tagsSlice';
import { updateContact } from '@/store/slices/contacts/contactsSlice';
import { Tag as TagType } from '@/types/tag';
import { Contact } from '@/types/contact';

interface ContactTagsProps {
  contact: Contact;
  tags: string[];
}

export const ContactTags = ({ contact, tags }: ContactTagsProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(tags || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const dispatch = useAppDispatch();
  const allTags = useAppSelector(selectAllTags);
  
  useEffect(() => {
    const loadTags = async () => {
      try {
        await dispatch(fetchTags());
      } catch (error) {
        console.error('Failed to load tags', error);
      }
    };
    
    loadTags();
  }, [dispatch]);
  
  useEffect(() => {
    setSelectedTags(tags || []);
  }, [tags]);
  
  const handleSaveTags = async () => {
    setIsUpdating(true);
    try {
      await dispatch(updateContact({
        contactId: contact.id,
        data: { tags: selectedTags }
      }));
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to update tags', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleRemoveTag = async (tagId: string) => {
    const updatedTags = selectedTags.filter(id => id !== tagId);
    setIsUpdating(true);
    try {
      await dispatch(updateContact({
        contactId: contact.id,
        data: { tags: updatedTags }
      }));
    } catch (error) {
      console.error('Failed to remove tag', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleToggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };
  
  const filteredTags = Array.isArray(allTags) 
    ? allTags.filter(tag => 
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const getTagById = (tagId: string) => {
    return Array.isArray(allTags) 
      ? allTags.find(tag => tag.id === tagId)
      : undefined;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Tags</h3>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7">
              Manage Tags
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Manage Tags</DialogTitle>
            </DialogHeader>
            
            <Command className="border rounded-md">
              <CommandInput 
                placeholder="Search tags..." 
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList className="h-64 overflow-auto">
                <CommandEmpty>No tags found.</CommandEmpty>
                <CommandGroup heading="Tags">
                  {filteredTags.map(tag => (
                    <CommandItem
                      key={tag.id}
                      onSelect={() => handleToggleTag(tag.id)}
                      className={`flex items-center ${selectedTags.includes(tag.id) ? 'bg-muted' : ''}`}
                    >
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span>{tag.name}</span>
                      {selectedTags.includes(tag.id) && (
                        <CheckIcon className="ml-auto h-4 w-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveTags}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {selectedTags.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tags</p>
        ) : (
          selectedTags.map(tagId => {
            const tag = getTagById(tagId);
            return tag ? (
              <Badge 
                key={tagId} 
                variant="secondary"
                style={{ backgroundColor: `${tag.color}20` }}
                className="flex items-center gap-1"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => handleRemoveTag(tagId)}
                  disabled={isUpdating}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ) : null;
          })
        )}
      </div>
    </div>
  );
};

const CheckIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
