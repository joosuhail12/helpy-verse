
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';

interface CompanySearchInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const CompanySearchInput = ({ value, onChange, disabled }: CompanySearchInputProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  
  // Mock companies data - in a real app, this would come from API/Redux
  const companies = [
    { id: '1', name: 'Acme Inc.' },
    { id: '2', name: 'Globex Corporation' },
    { id: '3', name: 'Soylent Corp' },
    { id: '4', name: 'Initech' },
    { id: '5', name: 'Umbrella Corporation' },
  ];

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center w-full relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setOpen(true)}
            className="h-8 pr-8"
            disabled={disabled}
          />
          <Search className="absolute right-2 h-4 w-4 text-gray-400" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[220px]">
        <Command>
          <CommandInput placeholder="Search companies..." />
          <CommandEmpty>No company found.</CommandEmpty>
          <CommandGroup>
            {companies
              .filter((company) => 
                company.name.toLowerCase().includes(inputValue.toLowerCase())
              )
              .map((company) => (
                <CommandItem
                  key={company.id}
                  value={company.name}
                  onSelect={(value) => {
                    onChange(value);
                    setInputValue(value);
                    setOpen(false);
                  }}
                >
                  {company.name}
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
