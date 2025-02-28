
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContent } from '@/store/slices/content/contentSlice';
import type { Content, ContentTag } from '@/types/content';

interface ContentTagsProps {
  content: Content;
}

export const ContentTags = ({ content }: ContentTagsProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleAddTag = () => {
    if (!newTagName.trim()) return;

    const newTag: ContentTag = {
      id: `tag-${Date.now()}`,
      name: newTagName.trim(),
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Random color
    };

    const currentTags = Array.isArray(content.tags) ? [...content.tags] : [];
    const updatedTags = [...currentTags, newTag];
    
    dispatch(updateContent({ 
      id: content.id, 
      data: { tags: updatedTags }
    }));

    setNewTagName('');
    setIsAdding(false);
    toast({
      title: 'Tag added',
      description: `Added tag "${newTag.name}"`,
    });
  };

  const handleRemoveTag = (tagId: string) => {
    if (!content.tags) return;
    
    const updatedTags = content.tags.filter(tag => 
      typeof tag === 'string' ? tag !== tagId : tag.id !== tagId
    );
    
    dispatch(updateContent({ 
      id: content.id, 
      data: { tags: updatedTags }
    }));

    toast({
      title: 'Tag removed',
      description: 'Tag has been removed from content',
    });
  };

  const getTagName = (tag: ContentTag | string): string => {
    return typeof tag === 'string' ? tag : tag.name;
  };

  const getTagColor = (tag: ContentTag | string): string => {
    return typeof tag === 'string' ? '#6b7280' : tag.color;
  };

  const getTagId = (tag: ContentTag | string): string => {
    return typeof tag === 'string' ? tag : tag.id;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Tags</h3>
        {!isAdding && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAdding(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Tag
          </Button>
        )}
      </div>
      
      {isAdding && (
        <div className="flex gap-2">
          <Input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Enter tag name"
            className="flex-1"
          />
          <Button onClick={handleAddTag} disabled={!newTagName.trim()}>
            Add
          </Button>
          <Button variant="ghost" onClick={() => setIsAdding(false)}>
            Cancel
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {content.tags?.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-sm"
            style={{ 
              backgroundColor: `${getTagColor(tag)}15`, 
              color: getTagColor(tag) 
            }}
          >
            {getTagName(tag)}
            <button
              onClick={() => handleRemoveTag(getTagId(tag))}
              className="hover:opacity-75 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
