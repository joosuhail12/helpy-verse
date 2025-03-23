
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FilterBarProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  statusFilter?: string;
  setStatusFilter?: (status: string) => void;
  priorityFilter?: string;
  setPriorityFilter?: (priority: string) => void;
}

export const FilterBar = ({
  searchQuery = '',
  setSearchQuery,
  statusFilter = 'all',
  setStatusFilter,
  priorityFilter = 'all',
  setPriorityFilter,
}: FilterBarProps) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleStatusFilterChange = (status: string) => {
    if (setStatusFilter) {
      setStatusFilter(status);
      
      if (status === 'all') {
        setActiveFilters(prev => prev.filter(f => !f.startsWith('status:')));
      } else {
        const newFilters = [...activeFilters.filter(f => !f.startsWith('status:'))];
        newFilters.push(`status:${status}`);
        setActiveFilters(newFilters);
      }
    }
  };

  const handlePriorityFilterChange = (priority: string) => {
    if (setPriorityFilter) {
      setPriorityFilter(priority);
      
      if (priority === 'all') {
        setActiveFilters(prev => prev.filter(f => !f.startsWith('priority:')));
      } else {
        const newFilters = [...activeFilters.filter(f => !f.startsWith('priority:'))];
        newFilters.push(`priority:${priority}`);
        setActiveFilters(newFilters);
      }
    }
  };

  const handleFilterRemove = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
    
    if (filter.startsWith('status:') && setStatusFilter) {
      setStatusFilter('all');
    } else if (filter.startsWith('priority:') && setPriorityFilter) {
      setPriorityFilter('all');
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="relative flex w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tickets..."
          className="pl-9 pr-12"
          value={searchQuery}
          onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full aspect-square border-l"
              aria-label="Filter"
            >
              <Filter className="h-4 w-4" />
              {activeFilters.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  {activeFilters.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter Tickets</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Status</DropdownMenuLabel>
              {['all', 'open', 'pending', 'closed'].map((status) => (
                <DropdownMenuItem 
                  key={status}
                  className={statusFilter === status ? 'bg-primary/10 font-medium' : ''}
                  onClick={() => handleStatusFilterChange(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Priority</DropdownMenuLabel>
              {['all', 'low', 'medium', 'high', 'urgent'].map((priority) => (
                <DropdownMenuItem 
                  key={priority}
                  className={priorityFilter === priority ? 'bg-primary/10 font-medium' : ''}
                  onClick={() => handlePriorityFilterChange(priority)}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map(filter => {
            const [type, value] = filter.split(':');
            return (
              <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                <span className="text-muted-foreground">{type}:</span>
                <span>{value}</span>
                <button 
                  className="ml-1 rounded-full hover:bg-muted p-0.5" 
                  onClick={() => handleFilterRemove(filter)}
                  aria-label={`Remove ${filter} filter`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};
