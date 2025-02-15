
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
import { useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContact } from '@/store/slices/contacts/contactsSlice';
import { useToast } from '@/components/ui/use-toast';

interface ContactTagsProps {
  contact: Contact;
}

export const ContactTags = ({ contact }: ContactTagsProps) => {
  const [newTag, setNewTag] = useState('');
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    const updatedTags = [...contact.tags, newTag.trim()];
    dispatch(updateContact({ 
      id: contact.id, 
      tags: updatedTags 
    }));
    setNewTag('');
    toast({
      title: "Tag added",
      description: `Tag "${newTag}" has been added to the contact.`,
    });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = contact.tags.filter(tag => tag !== tagToRemove);
    dispatch(updateContact({ 
      id: contact.id, 
      tags: updatedTags 
    }));
    toast({
      title: "Tag removed",
      description: `Tag "${tagToRemove}" has been removed from the contact.`,
    });
  };

  return (
    <Card className="border-none shadow-none bg-gray-50/50">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-lg">Tags</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add new tag..."
              className="h-8 w-40"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag();
                }
              }}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAddTag}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-2">
          {contact.tags.map((tag) => (
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
