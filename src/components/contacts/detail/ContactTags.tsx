
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { TagSelector } from '@/components/common/TagSelector';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { fetchTags } from '@/store/slices/tags/actions';
import { updateContact } from '@/store/slices/contacts/actions';
import { useToast } from '@/hooks/use-toast';
import type { Contact } from '@/types/contact';
import type { Tag } from '@/types/tag';

interface ContactTagsProps {
  contact: Contact;
  tags: string[];
}

export const ContactTags = ({ contact, tags }: ContactTagsProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(tags || []);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  useEffect(() => {
    dispatch(fetchTags({}));
  }, [dispatch]);
  
  useEffect(() => {
    setSelectedTags(tags || []);
  }, [tags]);
  
  const handleSaveTags = async () => {
    setIsLoading(true);
    try {
      await dispatch(updateContact({
        id: contact.id,
        updates: { tags: selectedTags }
      }));
      setIsOpen(false);
      toast({
        title: "Tags Updated",
        description: "Contact tags have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tags. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveTag = async (tagToRemove: string) => {
    const updatedTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(updatedTags);
    
    try {
      await dispatch(updateContact({
        id: contact.id,
        updates: { tags: updatedTags }
      }));
      toast({
        title: "Tag Removed",
        description: "Tag has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove tag. Please try again.",
        variant: "destructive",
      });
      // Restore the removed tag
      setSelectedTags(selectedTags);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Tags</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-1 h-3 w-3" /> Add Tags
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Tags</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <TagSelector
                selectedTags={selectedTags}
                onChange={setSelectedTags}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveTags}
                  disabled={isLoading}
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {selectedTags.length > 0 ? (
          selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleRemoveTag(tag)}
              />
            </Badge>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">No tags</span>
        )}
      </div>
    </div>
  );
};
