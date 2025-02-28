
import { useState } from 'react';
import { TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContact } from '@/store/slices/contacts/contactsSlice';
import { useToast } from '@/hooks/use-toast';

interface TagActionsProps {
  selectedContacts: string[];
  contacts: any[];
}

export const TagActions = ({ selectedContacts, contacts }: TagActionsProps) => {
  const [selectedTag, setSelectedTag] = useState('');
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleBulkTagging = () => {
    if (!selectedTag) return;

    selectedContacts.forEach(contactId => {
      const contact = contacts.find(c => c.id === contactId);
      if (!contact) return;

      const currentTags = Array.isArray(contact.tags) ? contact.tags : [];
      if (!currentTags.includes(selectedTag)) {
        dispatch(updateContact({
          id: contactId,
          data: { tags: [...currentTags, selectedTag] }
        }));
      }
    });

    toast({
      title: "Tags updated",
      description: `Updated tags for ${selectedContacts.length} contacts`,
    });
    setSelectedTag('');
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedTag} onValueChange={setSelectedTag}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Add tag..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="important">Important</SelectItem>
          <SelectItem value="follow-up">Follow-up</SelectItem>
          <SelectItem value="vip">VIP</SelectItem>
          <SelectItem value="lead">Lead</SelectItem>
          <SelectItem value="customer">Customer</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBulkTagging}
        disabled={selectedContacts.length === 0 || !selectedTag}
      >
        <TagIcon className="h-4 w-4 mr-2" />
        Apply Tag
      </Button>
    </div>
  );
};
