
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchInput = ({ searchQuery, setSearchQuery }: SearchInputProps) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
      <Tooltip>
        <TooltipTrigger asChild>
          <Input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-white/50"
          />
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="z-[60] bg-white shadow-lg"
          sideOffset={12}
        >
          <p>Quick search (Ctrl + /)</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default SearchInput;

