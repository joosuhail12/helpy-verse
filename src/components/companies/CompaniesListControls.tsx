
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchCriteria {
  field: string;
  value: string;
}

export const CompaniesListControls = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria[]>([]);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const selectedCompanies = useAppSelector(state => state.companies.selectedCompanies);

  const searchableFields = [
    { label: 'Name', value: 'name' },
    { label: 'Website', value: 'website' },
    { label: 'Industry', value: 'industry' },
    { label: 'Type', value: 'type' },
    { label: 'Status', value: 'status' },
  ];

  const handleAddCriteria = () => {
    setSearchCriteria([...searchCriteria, { field: 'name', value: '' }]);
  };

  const handleRemoveCriteria = (index: number) => {
    const newCriteria = [...searchCriteria];
    newCriteria.splice(index, 1);
    setSearchCriteria(newCriteria);
  };

  const handleCriteriaChange = (index: number, field: string, value: string) => {
    const newCriteria = [...searchCriteria];
    newCriteria[index] = { field, value };
    setSearchCriteria(newCriteria);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline"
              className={showFilters ? 'bg-gray-100' : ''}
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced Search
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Advanced Search</h4>
                <Button variant="outline" size="sm" onClick={handleAddCriteria}>
                  Add Criteria
                </Button>
              </div>
              
              {searchCriteria.map((criteria, index) => (
                <div key={index} className="flex items-start gap-2">
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                    value={criteria.field}
                    onChange={(e) => handleCriteriaChange(index, e.target.value, criteria.value)}
                  >
                    {searchableFields.map(field => (
                      <option key={field.value} value={field.value}>
                        {field.label}
                      </option>
                    ))}
                  </select>
                  <Input
                    placeholder="Search value..."
                    value={criteria.value}
                    onChange={(e) => handleCriteriaChange(index, criteria.field, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCriteria(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {selectedCompanies?.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {selectedCompanies.length} company{selectedCompanies.length === 1 ? '' : 'ies'} selected
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
