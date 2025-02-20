import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateCustomer } from '@/store/slices/contacts/contactsSlice';
import { Contact } from '@/types/contact';
import { useToast } from '@/components/ui/use-toast';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Tag, X, Pencil, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTags } from '@/store/slices/tagsSlice';

import Select from 'react-select'; // Import react-select

interface ContactTagsProps {
  contact: Contact;
}

export const ContactTags = ({ contact }: ContactTagsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTags, setSelectedTags] = useState<{ id: string; name: string }[]>(contact.tags || []);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // Fetch available tags from Redux store
  const availableTags = useAppSelector(state => state.tags.items);

  useEffect(() => {
    dispatch(fetchTags({
      page: 1,
      limit: 1000,
      sortField: 'createdAt',
      sortDirection: 'desc',
      filterEntity: 'all',
      searchQuery: '',
    }));
  }, [dispatch]);

  // Handle tag selection (local state only, no API call yet)
  const handleSelectTags = (selectedOptions: { value: string; label: string }[]) => {
    const newSelectedTags = selectedOptions.map(option => ({
      id: option.value,
      name: option.label,
    }));
    setSelectedTags(newSelectedTags);
  };

  // Handle tag removal from the local state
  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(prevTags => prevTags.filter(tag => tag.id !== tagId));
  };

  // Finalize changes and update API when clicking check icon
  const handleSaveTags = async () => {
    console.log(selectedTags, 'selectedTags');
    await dispatch(updateCustomer({
      customer_id: contact.id,
      tags: selectedTags,
    }));

    toast({
      title: "Tags updated",
      description: "Tags have been updated successfully.",
    });

    setIsEditing(false); // Exit edit mode
  };

  return (
    <Card className="border-none shadow-none bg-gray-50/50 transition-all duration-300">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <CardTitle className="text-lg">Tags</CardTitle>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(!isEditing)}
            className="h-8 w-8 p-0"
          >
            {isEditing ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSaveTags}
                className="h-8 w-8 p-0"
              >
                <Check className="h-4 w-4 text-green-500" />
              </Button>

            ) : (
              <Pencil className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isEditing ? (
          <div className="space-y-4 transition-all duration-300">
            {/* Multi-Select Dropdown using react-select */}
            <Select
              isMulti
              value={selectedTags.map(tag => ({ value: tag.id, label: tag.name }))}
              onChange={handleSelectTags}
              options={availableTags
                .filter(tag => !selectedTags.some(selected => selected.id === tag.id)) // Remove already selected ones
                .map(tag => ({ value: tag.id, label: tag.name }))
              }
              className="w-60"
              placeholder="Select tags"
            />

            {/* Display Selected Tags with Remove Option */}
            <div className="flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <Badge key={tag.id} variant="secondary" className="flex items-center gap-1 transition-all duration-300">
                  {tag.name}
                  <button
                    onClick={() => handleRemoveTag(tag.id)}
                    className="ml-1 hover:text-red-500 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          // Display Tags when Not Editing
          <div className="flex flex-wrap gap-2 transition-all duration-300">
            {contact.tags.length > 0 ? (
              contact.tags.map(tag => (
                <Badge key={tag.id} variant="secondary" className="transition-all duration-300">
                  {tag.name}
                </Badge>
              ))
            ) : (
              <p className="text-gray-500 italic">No tags added</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
