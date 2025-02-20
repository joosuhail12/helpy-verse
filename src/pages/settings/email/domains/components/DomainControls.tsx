
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Domain } from '@/types/domains';

interface DomainControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'verified' | 'pending' | 'all';
  onStatusFilterChange: (value: 'verified' | 'pending' | 'all') => void;
  sortBy: 'date' | 'name';
  onSortChange: (value: 'date' | 'name') => void;
}

export const DomainControls = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
}: DomainControlsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search domains..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex gap-4">
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusFilterChange(value as 'pending' | 'verified' | 'all')}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            {/* <SelectItem value="failed">Failed</SelectItem> */}
          </SelectContent>
        </Select>
        <Select
          value={sortBy}
          onValueChange={(value) => onSortChange(value as 'date' | 'name')}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date Added</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
