
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { companiesService } from '@/api/services/companiesService';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

interface CompanySearchInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const CompanySearchInput = ({ value, onChange, disabled }: CompanySearchInputProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch companies from the API
  const { data: companiesResponse, isLoading, error } = useQuery({
    queryKey: ['companies', searchQuery],
    queryFn: () => companiesService.fetchCompanies({ 
      searchQuery,
      limit: 10
    }),
    enabled: open,
    staleTime: 60000, // 1 minute
  });

  const companies = companiesResponse?.companies || [];

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading companies",
        description: "Could not load the company list. Please try again.",
        variant: "destructive",
      });
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchQuery(value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center w-full relative">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setOpen(true)}
            className="h-8 pr-8"
            disabled={disabled}
          />
          <Search className="absolute right-2 h-4 w-4 text-gray-400" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[220px]">
        <Command>
          <CommandInput 
            placeholder="Search companies..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>
            {isLoading ? 'Loading...' : 'No company found.'}
          </CommandEmpty>
          <CommandGroup>
            {companies.map((company) => (
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
