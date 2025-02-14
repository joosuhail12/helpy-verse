
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CannedResponsesSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const CannedResponsesSearch = ({ 
  searchQuery, 
  setSearchQuery 
}: CannedResponsesSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search responses..."
        className="pl-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};
