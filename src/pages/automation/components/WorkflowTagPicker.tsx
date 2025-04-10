import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Tag, X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { HexColorPicker } from 'react-colorful';
import { WorkflowTag } from '@/types/workflow';
import { cn } from '@/lib/utils';

interface WorkflowTagPickerProps {
  tags: WorkflowTag[];
  selectedTags: WorkflowTag[];
  onChange: (tags: WorkflowTag[]) => void;
  canCreateTags?: boolean;
}

export const WorkflowTagPicker: React.FC<WorkflowTagPickerProps> = ({
  tags,
  selectedTags,
  onChange,
  canCreateTags = true
}) => {
  const [open, setOpen] = useState(false);
  const [newTagDialogOpen, setNewTagDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#24292F');
  const inputRef = useRef<HTMLInputElement>(null);

  const [availableTags, setAvailableTags] = useState(tags);
  const [selectedTagIds, setSelectedTagIds] = useState(selectedTags.map(tag => tag.id));

  useEffect(() => {
    setAvailableTags(tags);
    setSelectedTagIds(selectedTags.map(tag => tag.id));
  }, [tags, selectedTags]);

  const handleTagSelect = (tag: WorkflowTag) => {
    const isSelected = selectedTagIds.includes(tag.id);
    let newSelectedTagIds = [...selectedTagIds];

    if (isSelected) {
      newSelectedTagIds = newSelectedTagIds.filter(id => id !== tag.id);
    } else {
      newSelectedTagIds = [...selectedTagIds, tag.id];
    }

    setSelectedTagIds(newSelectedTagIds);
    onChange(tags.filter(t => newSelectedTagIds.includes(t.id)));
  };

  const handleCreateTag = () => {
    if (newTagName.trim() === '') return;

    const newTag: WorkflowTag = {
      id: `tag-${Date.now()}`,
      name: newTagName,
      color: newTagColor,
    };

    setAvailableTags([...availableTags, newTag]);
    setSelectedTagIds([...selectedTagIds, newTag.id]);
    onChange([...tags, newTag]);

    setNewTagDialogOpen(false);
    setNewTagName('');
    setNewTagColor('#24292F');
  };

  const filteredTags = availableTags.filter(tag => !selectedTagIds.includes(tag.id));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between text-sm"
        >
          Tags ({selectedTags.length})
          <Tag className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search tags..." ref={inputRef} />
          <CommandList>
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandGroup heading="Tags">
              {filteredTags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  onSelect={() => {
                    handleTagSelect(tag);
                    setOpen(false);
                    inputRef?.current?.focus();
                  }}
                >
                  <Tag className="mr-2 h-4 w-4" />
                  {tag.name}
                </CommandItem>
              ))}
            </CommandGroup>
            {canCreateTags && (
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setNewTagDialogOpen(true);
                    setOpen(false);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Tag
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>

      <Dialog open={newTagDialogOpen} onOpenChange={setNewTagDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create new tag</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium leading-none">
                Name
              </label>
              <div className="col-span-3">
                <Input
                  id="name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="color" className="text-right text-sm font-medium leading-none">
                Color
              </label>
              <div className="col-span-3">
                <HexColorPicker color={newTagColor} onChange={setNewTagColor} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleCreateTag}>
              Create tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Popover>
  );
};
