
import { Search, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
}

const FilterBar = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}: FilterBarProps) => {
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || priorityFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery('')}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {statusFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
              Status: {statusFilter}
              <button onClick={() => setStatusFilter('all')}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {priorityFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
              Priority: {priorityFilter}
              <button onClick={() => setStatusFilter('all')}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-primary"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
