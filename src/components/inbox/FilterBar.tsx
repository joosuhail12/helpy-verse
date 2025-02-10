
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
            className="pl-8 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] transition-all duration-200 hover:border-primary/50">
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
            <SelectTrigger className="w-[140px] transition-all duration-200 hover:border-primary/50">
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
        <div className="flex flex-wrap gap-2 pt-2 animate-fade-in">
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-full transition-all duration-200 hover:bg-primary/20">
              Search: {searchQuery}
              <button 
                onClick={() => setSearchQuery('')}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {statusFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-full transition-all duration-200 hover:bg-primary/20">
              Status: {statusFilter}
              <button 
                onClick={() => setStatusFilter('all')}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {priorityFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-full transition-all duration-200 hover:bg-primary/20">
              Priority: {priorityFilter}
              <button 
                onClick={() => setPriorityFilter('all')}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;

