
import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tag, X, Plus, Check } from 'lucide-react';
import { WorkflowTag } from '@/types/workflow';
import { cn } from '@/lib/utils';

interface WorkflowTagsControlProps {
  tags: WorkflowTag[];
  selectedTags: WorkflowTag[];
  onTagsChange: (tags: WorkflowTag[]) => void;
  onCreateNewTag?: (tag: WorkflowTag) => void;
  className?: string;
}

export function WorkflowTagsControl({ 
  tags, 
  selectedTags, 
  onTagsChange,
  onCreateNewTag,
  className 
}: WorkflowTagsControlProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when dialog opens
  useEffect(() => {
    if (isDialogOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isDialogOpen]);

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
    
    onCreateNewTag?.(newTag);
    setNewTagName('');
    setIsCreatingTag(false);
    onTagsChange([...selectedTags, newTag]);
  };

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className={cn("flex flex-wrap gap-2 items-center", className)}>
        {selectedTags.map(tag => (
          <Badge 
            key={tag.id}
            variant="outline"
            className="group flex items-center gap-1 px-2 py-1 text-xs"
            style={{ backgroundColor: `${tag.color}20`, borderColor: tag.color }}
          >
            <div 
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: tag.color }} 
            />
            <span>{tag.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 rounded-full ml-1 opacity-70 hover:opacity-100"
              onClick={() => handleTagToggle(tag)}
            >
              <X className="h-2.5 w-2.5" />
            </Button>
          </Badge>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 gap-1 text-xs"
          onClick={() => setIsDialogOpen(true)}
        >
          <Tag className="h-3.5 w-3.5" />
          {selectedTags.length > 0 ? 'Edit Tags' : 'Add Tags'}
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="relative">
              <Input
                ref={searchInputRef}
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              {searchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              <div className="space-y-1">
                {filteredTags.map(tag => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: tag.color }} 
                      />
                      <span>{tag.name}</span>
                    </div>
                    {selectedTags.some(t => t.id === tag.id) ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : null}
                  </div>
                ))}
                
                {filteredTags.length === 0 && !isCreatingTag && (
                  <div className="text-center py-4 text-muted-foreground">
                    No tags found
                  </div>
                )}
              </div>
            </div>
            
            {isCreatingTag ? (
              <div className="flex gap-2 items-center pt-2">
                <Input
                  placeholder="New tag name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateTag();
                    if (e.key === 'Escape') setIsCreatingTag(false);
                  }}
                />
                <div className="flex gap-2">
                  <Button 
                    type="button"
                    onClick={handleCreateTag}
                    size="sm"
                    disabled={!newTagName.trim()}
                  >
                    Create
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsCreatingTag(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                type="button"
                variant="outline" 
                className="w-full"
                onClick={() => setIsCreatingTag(true)}
              >
                <Plus className="h-4 w-4 mr-2" /> 
                Create New Tag
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
