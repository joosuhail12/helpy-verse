
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { CheckIcon, PlusCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchTags } from '@/store/slices/tags/tagsSlice';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export const TagSelector = ({ selectedTags, onChange }: TagSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newTag, setNewTag] = useState('');
  const dispatch = useAppDispatch();
  
  const allTags = useAppSelector(state => state.tags.tags) || [];
  
  useEffect(() => {
    dispatch(fetchTags({ query: '' }));
  }, [dispatch]);
  
  const handleSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onChange([...selectedTags, tag]);
    }
  };
  
  const handleRemove = (tag: string) => {
    onChange(selectedTags.filter(t => t !== tag));
  };
  
  const handleAddNewTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      onChange([...selectedTags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  // Filter out already selected tags
  const availableTags = allTags
    .filter(tag => typeof tag === 'object' && tag.name && !selectedTags.includes(tag.name))
    .map(tag => typeof tag === 'object' ? tag.name : '');
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => handleRemove(tag)}
            />
          </Badge>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <PlusCircle className="mr-2 h-4 w-4" />
              Select existing tags
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start" side="bottom" avoidCollisions>
            <Command>
              <CommandInput 
                placeholder="Search tags..." 
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                <CommandEmpty>No tags found.</CommandEmpty>
                <CommandGroup>
                  {availableTags.map(tag => (
                    <CommandItem
                      key={tag}
                      value={tag}
                      onSelect={() => {
                        handleSelect(tag);
                        setOpen(false);
                      }}
                    >
                      {tag}
                      {selectedTags.includes(tag) && (
                        <CheckIcon className="ml-auto h-4 w-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Create new tag..."
          className="flex-1"
        />
        <Button 
          onClick={handleAddNewTag}
          disabled={!newTag.trim()}
        >
          Add
        </Button>
      </div>
    </div>
  );
};
