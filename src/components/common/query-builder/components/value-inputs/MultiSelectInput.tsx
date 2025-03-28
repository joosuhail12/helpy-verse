
import React, { useState } from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MultiSelectInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
  errorMessage?: string | null;
}

export const MultiSelectInput = ({
  value,
  onChange,
  options,
  errorMessage,
}: MultiSelectInputProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: string) => {
    const newValue = [...value];
    if (newValue.includes(option)) {
      // Remove if already selected
      onChange(newValue.filter((item) => item !== option));
    } else {
      // Add if not selected
      onChange([...newValue, option]);
    }
  };

  const handleRemove = (option: string) => {
    onChange(value.filter((item) => item !== option));
  };

  return (
    <div className="flex flex-col gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-between ${
              errorMessage ? 'border-red-500' : ''
            }`}
          >
            {value.length > 0
              ? `${value.length} selected`
              : 'Select options...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search options..." />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleSelect(option)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value.includes(option) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {value.map((item) => (
            <Badge key={item} variant="secondary">
              {item}
              <button
                className="ml-1 rounded-full outline-none"
                onClick={() => handleRemove(item)}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
