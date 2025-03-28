
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Save, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  fetchTags, 
  selectAllTagsItems,
  selectTagsLoading
} from '@/store/slices/tagsSlice';
import { updateContact } from '@/store/slices/contacts/contactsSlice';

interface ContactTagsProps {
  contact: any;
}

export const ContactTags: React.FC<ContactTagsProps> = ({ contact }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(contact.tags || []);
  
  const allTags = useSelector(selectAllTagsItems) || [];
  const isLoading = useSelector(selectTagsLoading);
  
  useEffect(() => {
    dispatch(fetchTags({ searchQuery }));
  }, [dispatch, searchQuery]);
  
  const handleSaveTags = () => {
    dispatch(updateContact({
      id: contact.id,
      data: { tags: selectedTags }
    }));
    setIsEditing(false);
  };
  
  const handleAddTag = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };
  
  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(id => id !== tagId));
  };
  
  const filteredTags = allTags
    ? allTags.filter(tag => 
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !selectedTags.includes(tag.id)
      )
    : [];
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">Add</span>
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
              <X className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Cancel</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSaveTags}>
              <Save className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Save</span>
            </Button>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {selectedTags.length > 0 ? (
              selectedTags.map(tagId => {
                const tag = allTags.find(t => t.id === tagId);
                return tag ? (
                  <Badge key={tag.id} style={{ backgroundColor: tag.color }} className="text-white flex items-center gap-1.5">
                    {tag.name}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag.id)} />
                  </Badge>
                ) : null;
              })
            ) : (
              <p className="text-xs text-muted-foreground">No tags selected</p>
            )}
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="h-3.5 w-3.5 mr-2" />
                <span>Add Tag</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3" align="start">
              <div className="space-y-3">
                <Input
                  placeholder="Search tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-sm"
                />
                
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading tags...</p>
                  ) : filteredTags.length > 0 ? (
                    filteredTags.map(tag => (
                      <div
                        key={tag.id}
                        className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer"
                        onClick={() => handleAddTag(tag.id)}
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                        <span className="text-sm">{tag.name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No matching tags found</p>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {selectedTags.length > 0 ? (
            selectedTags.map(tagId => {
              const tag = allTags.find(t => t.id === tagId);
              return tag ? (
                <Badge key={tag.id} style={{ backgroundColor: tag.color }} className="text-white">
                  {tag.name}
                </Badge>
              ) : null;
            })
          ) : (
            <p className="text-xs text-muted-foreground">No tags</p>
          )}
        </div>
      )}
    </div>
  );
};
