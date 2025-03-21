
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

    const updatedTags = [...(content.tags || []), newTag];
    
    dispatch(updateContent({ 
      id: content.id, 
      updates: { tags: updatedTags }
    }));

    setNewTagName('');
    setIsAdding(false);
    toast({
      title: 'Tag added',
      description: `Added tag "${newTag.name}"`,
    });
  };

  const handleRemoveTag = (tagId: string) => {
    const updatedTags = content.tags?.filter(tag => tag.id !== tagId) || [];
    
    dispatch(updateContent({ 
      id: content.id, 
      updates: { tags: updatedTags }
    }));

    toast({
      title: 'Tag removed',
      description: 'Tag has been removed from content',
    });
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
        {content.tags?.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-sm"
            style={{ backgroundColor: `${tag.color}15`, color: tag.color }}
          >
            {tag.name}
            <button
              onClick={() => handleRemoveTag(tag.id)}
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
