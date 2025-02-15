
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ChannelSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'name' | 'date' | 'status';
  setSortBy: (value: 'name' | 'date' | 'status') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (value: 'asc' | 'desc') => void;
}

export function ChannelSearch({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: ChannelSearchProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Input
          placeholder="Search channels..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <Select value={sortBy} onValueChange={(value: 'name' | 'date' | 'status') => setSortBy(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Channel Name</SelectItem>
          <SelectItem value="date">Creation Date</SelectItem>
          <SelectItem value="status">Status</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Ascending</SelectItem>
          <SelectItem value="desc">Descending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
