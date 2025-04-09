
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckIcon, PlusCircleIcon } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { WorkflowTag } from '@/types/workflow';

export interface WorkflowTagPickerProps {
  selectedTags: WorkflowTag[];
  allTags: WorkflowTag[];
  onChange: (tags: WorkflowTag[]) => void;
}

export const WorkflowTagPicker: React.FC<WorkflowTagPickerProps> = ({
  selectedTags,
  allTags,
  onChange
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");

  const selectedTagIds = selectedTags.map((tag) => tag.id);

  const handleSelect = (tag: WorkflowTag) => {
    const isSelected = selectedTagIds.includes(tag.id);
    
    if (isSelected) {
      onChange(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="justify-start border-dashed h-8"
        >
          {selectedTags.length === 0 ? (
            <>
              <PlusCircleIcon className="h-3.5 w-3.5 mr-2" />
              <span>Add tags</span>
            </>
          ) : (
            <>
              <span>
                {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''}
              </span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search tags..."
            value={value}
            onValueChange={setValue}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No tags found</CommandEmpty>
            <CommandGroup>
              {allTags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                
                return (
                  <CommandItem
                    key={tag.id}
                    value={tag.name}
                    onSelect={() => handleSelect(tag)}
                  >
                    <div 
                      className="mr-2 h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span className="flex-1">{tag.name}</span>
                    {isSelected && <CheckIcon className="h-3.5 w-3.5 ml-2" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default WorkflowTagPicker;
