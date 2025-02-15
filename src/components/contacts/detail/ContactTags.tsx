
import { Contact } from '@/types/contact';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Tag, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { updateContact } from '@/store/slices/contacts/contactsSlice';
import { useToast } from '@/hooks/use-toast';

interface ContactTagsProps {
  contact: Contact;
}

export const ContactTags = ({ contact }: ContactTagsProps) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const allTags = useAppSelector((state) => 
    // In a real app, this would come from a tags slice
    ['important', 'follow-up', 'vip', 'lead', 'customer', 'prospect']
  );

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    // Ensure tags is initialized as an array
    const currentTags = Array.isArray(contact.tags) ? contact.tags : [];
    if (currentTags.includes(newTag.trim())) {
      toast({
        title: "Tag exists",
        description: "This tag already exists on the contact.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedTags = [...currentTags, newTag.trim()];
    dispatch(updateContact({ 
      id: contact.id, 
      tags: updatedTags 
    }));
    setNewTag('');
    setIsAddingTag(false);
    toast({
      title: "Tag added",
      description: `Tag "${newTag}" has been added to the contact.`,
    });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = Array.isArray(contact.tags) ? contact.tags : [];
    const updatedTags = currentTags.filter(tag => tag !== tagToRemove);
    dispatch(updateContact({ 
      id: contact.id, 
      tags: updatedTags 
    }));
    toast({
      title: "Tag removed",
      description: `Tag "${tagToRemove}" has been removed from the contact.`,
    });
  };

  const unusedTags = allTags.filter(tag => 
    !contact.tags?.includes(tag)
  );

  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-lg">Tags</CardTitle>
          </div>
          {isAddingTag ? (
            <div className="flex items-center gap-2">
              <Select 
                value={newTag} 
                onValueChange={setNewTag}
              >
                <SelectTrigger className="h-8 w-40">
                  <SelectValue placeholder="Select tag..." />
                </SelectTrigger>
                <SelectContent>
                  {unusedTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                  <SelectItem value="_custom">Add custom tag...</SelectItem>
                </SelectContent>
              </Select>
              {newTag === '_custom' && (
                <Input
                  value={newTag === '_custom' ? '' : newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter tag name..."
                  className="h-8 w-40"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag();
                    }
                  }}
                />
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleAddTag}
                disabled={!newTag.trim() || newTag === '_custom'}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAddingTag(false);
                  setNewTag('');
                }}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsAddingTag(true)}
              className="h-8 px-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Tag
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-2">
          {Array.isArray(contact.tags) && contact.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:text-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

