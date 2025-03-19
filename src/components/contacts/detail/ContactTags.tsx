
import React, { useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';
import { Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Contact } from '@/types/contact';
import { updateContact } from '@/store/slices/contacts/contactsSlice';

export interface ContactTagsProps {
  contactId: string;
  contact?: Contact;
}

export const ContactTags: React.FC<ContactTagsProps> = ({ contactId, contact }) => {
  const dispatch = useAppDispatch();
  const allTags = useAppSelector((state) => state.tags?.tags || []);
  const contactData = contact || useAppSelector((state) => 
    state.contacts.items.find(c => c.id === contactId)
  );
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  if (!contactData) {
    return null;
  }
  
  const contactTagIds = contactData.tags || [];
  const contactTags = contactTagIds.map(tagId => {
    return allTags.find(tag => tag.id === tagId) || { id: tagId, name: tagId, color: 'gray' };
  });
  
  const handleTagToggle = (tagId: string, checked: boolean) => {
    const updatedTags = checked
      ? [...contactTagIds, tagId]
      : contactTagIds.filter(id => id !== tagId);
    
    dispatch(updateContact({
      contactId,
      data: { tags: updatedTags }
    }));
  };
  
  const handleTagRemove = (tagId: string) => {
    const updatedTags = contactTagIds.filter(id => id !== tagId);
    dispatch(updateContact({
      contactId,
      data: { tags: updatedTags }
    }));
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex justify-between items-center">
          Tags
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {allTags.map(tag => (
                <DropdownMenuCheckboxItem
                  key={tag.id}
                  checked={contactTagIds.includes(tag.id)}
                  onCheckedChange={(checked) => handleTagToggle(tag.id, checked)}
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {contactTags.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tags assigned</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {contactTags.map(tag => (
              <Badge
                key={tag.id}
                variant="outline"
                className="flex items-center gap-1"
                style={{ backgroundColor: `${tag.color}20`, borderColor: tag.color }}
              >
                {tag.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  onClick={() => handleTagRemove(tag.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
