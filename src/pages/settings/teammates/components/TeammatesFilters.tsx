
import * as React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TeammatesFiltersProps {
  totalCount: number;
  selectedCount: number;
}

const TeammatesFilters = ({ totalCount, selectedCount }: TeammatesFiltersProps) => {
  return (
    <div className="space-y-4">
      {selectedCount > 0 && (
        <div className="bg-gray-50 p-3 rounded-md flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedCount} teammates selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Assign to Team
            </Button>
            <Button variant="outline" size="sm">
              Update Role
            </Button>
            <Button variant="destructive" size="sm">
              Deactivate
            </Button>
          </div>
        </div>
      )}

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search teammates..." 
            className="pl-8"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="agent">Agent</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TeammatesFilters;
