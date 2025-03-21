
import { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Building, Plus } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';

interface Company {
  id: string;
  name: string;
}

// Mock companies data - replace with actual API call
const companies: Company[] = [
  { id: '1', name: 'Acme Corp' },
  { id: '2', name: 'TechCo' },
  { id: '3', name: 'Innovate Inc' },
];

interface CompanySearchInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const CompanySearchInput = ({ 
  value, 
  onChange,
  disabled = false 
}: CompanySearchInputProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Filter companies based on search
  const [searchTerm, setSearchTerm] = useState('');
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNewCompany = () => {
    // In a real implementation, this would open a modal to create a new company
    // For now, we'll just create it with the search term
    if (!searchTerm.trim()) return;
    
    // Mock creating a new company
    const newCompany = searchTerm.trim();
    onChange(newCompany);
    setOpen(false);
    toast({
      title: 'Company created',
      description: `Created new company: ${newCompany}`,
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-8"
          disabled={disabled}
        >
          {value || "Select company..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search companies..." 
            onValueChange={setSearchTerm}
          />
          <CommandEmpty className="py-2">
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm">No companies found</p>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCreateNewCompany}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create "{searchTerm}"
              </Button>
            </div>
          </CommandEmpty>
          <CommandGroup>
            {filteredCompanies.map((company) => (
              <CommandItem
                key={company.id}
                value={company.name}
                onSelect={() => {
                  onChange(company.name);
                  setOpen(false);
                }}
              >
                <Building className="mr-2 h-4 w-4" />
                {company.name}
                {company.name === value && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
