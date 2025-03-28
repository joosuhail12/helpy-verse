
import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { Input } from '@/components/ui/input';
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
import { Building } from 'lucide-react';
import { selectAllCompanies } from '@/store/slices/companies/selectors';
import { fetchCompanies } from '@/store/slices/companies/companiesSlice';

interface CompanySearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const CompanySearchInput = ({
  value,
  onChange,
  onBlur,
  placeholder = 'Search companies...',
  disabled = false
}: CompanySearchInputProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const companies = useAppSelector(selectAllCompanies);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);
  
  // Find current company name if we have a value (company ID)
  const selectedCompany = companies.find(company => company.id === value);
  const displayValue = selectedCompany ? selectedCompany.name : '';
  
  const filteredCompanies = searchTerm
    ? companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : companies;
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            placeholder={placeholder}
            value={displayValue}
            onChange={e => setSearchTerm(e.target.value)}
            onClick={() => setOpen(true)}
            onBlur={onBlur}
            disabled={disabled}
            className="w-full"
          />
          <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]" align="start">
        <Command>
          <CommandInput 
            placeholder="Search companies..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>No companies found</CommandEmpty>
            <CommandGroup>
              {filteredCompanies.map(company => (
                <CommandItem
                  key={company.id}
                  value={company.id}
                  onSelect={(value) => {
                    onChange(value);
                    setOpen(false);
                    onBlur && onBlur();
                  }}
                >
                  <Building className="mr-2 h-4 w-4" />
                  {company.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
