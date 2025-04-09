import React, { useState } from 'react';
import { Plus, X, Tag as TagIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { WorkflowTag } from '@/types/workflow';

export interface WorkflowTagPickerProps {
  selectedTags: WorkflowTag[];
  allTags: WorkflowTag[];
  onTagsChange: (tags: WorkflowTag[]) => void;
  className?: string;
  variant?: 'default' | 'compact';
}

/**
 * Component for selecting and managing workflow tags
 */
export function WorkflowTagPicker({ 
  selectedTags, 
  allTags, 
  onTagsChange,
  className = '',
  variant = 'default'
}: WorkflowTagPickerProps) {
  const [newTagName, setNewTagName] = useState('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  
  // Generate a random color for new tags
  const generateRandomColor = () => {
    const colors = [
      '#F87171', // red
      '#FB923C', // orange
      '#FBBF24', // amber
      '#A3E635', // lime
      '#34D399', // emerald
      '#22D3EE', // cyan
      '#60A5FA', // blue
      '#A78BFA', // violet
      '#F472B6', // pink
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleTagToggle = (tag: WorkflowTag) => {
    const isSelected = selectedTags.some(t => t.id === tag.id);
    if (isSelected) {
      onTagsChange(selectedTags.filter(t => t.id !== tag.id));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    
    const newTag: WorkflowTag = {
      id: `tag-${Date.now()}`,
      name: newTagName.trim(),
      color: generateRandomColor()
    };
    
    // Add to selected tags and reset form
    onTagsChange([...selectedTags, newTag]);
    setNewTagName('');
    setIsCreatingTag(false);
  };

  const isCompact = variant === 'compact';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size={isCompact ? "sm" : "default"}
          className={`flex items-center gap-2 ${className}`}
        >
          <TagIcon className={`${isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
          <span>
            {selectedTags.length === 0 && "Add Tags"}
            {selectedTags.length === 1 && `1 Tag`}
            {selectedTags.length > 1 && `${selectedTags.length} Tags`}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-3">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Tags</h4>
            
            {/* Tag list */}
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {allTags.map(tag => (
                <div 
                  key={tag.id}
                  className="flex items-center justify-between p-1.5 hover:bg-muted/50 rounded-sm cursor-pointer"
                  onClick={() => handleTagToggle(tag)}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="text-sm">{tag.name}</span>
                  </div>
                  {selectedTags.some(t => t.id === tag.id) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
              
              {allTags.length === 0 && (
                <p className="text-sm text-muted-foreground py-2 text-center">
                  No tags created yet
                </p>
              )}
            </div>
          </div>
          
          {/* Create new tag */}
          {isCreatingTag ? (
            <div className="flex flex-col gap-2">
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter tag name"
                className="h-8"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
              />
              <div className="flex justify-between gap-2">
                <Button 
                  size="sm" 
                  onClick={handleCreateTag}
                  disabled={!newTagName.trim()}
                >
                  Create Tag
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsCreatingTag(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsCreatingTag(true)} 
              className="w-full"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Create New Tag
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
