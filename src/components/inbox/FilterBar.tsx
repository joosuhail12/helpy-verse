
import { useState } from 'react';
import { Search, Filter, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200 h-10"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10 border-gray-200">
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <Tabs defaultValue="filters" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="filters">Filters</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              <TabsContent value="filters" className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Status</h4>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Priority</h4>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Advanced Search</h4>
                  <Input placeholder="Customer email..." className="h-9 text-sm mb-2" />
                  <Input placeholder="Company name..." className="h-9 text-sm mb-2" />
                  <Input placeholder="Tag..." className="h-9 text-sm mb-2" />
                  <Input type="date" className="h-9 text-sm mb-2" />
                </div>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>

        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatusFilter('assigned_to_me')}
            className={`rounded-full text-xs px-4 hover:bg-primary/5 ${
              statusFilter === 'assigned_to_me' 
                ? 'bg-primary/10 text-primary border-primary/20' 
                : 'border-gray-200'
            }`}
          >
            Assigned to me
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatusFilter('unassigned')}
            className={`rounded-full text-xs px-4 hover:bg-primary/5 ${
              statusFilter === 'unassigned' 
                ? 'bg-primary/10 text-primary border-primary/20' 
                : 'border-gray-200'
            }`}
          >
            Unassigned
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatusFilter('overdue')}
            className={`rounded-full text-xs px-4 hover:bg-primary/5 ${
              statusFilter === 'overdue' 
                ? 'bg-primary/10 text-primary border-primary/20' 
                : 'border-gray-200'
            }`}
          >
            Overdue
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default FilterBar;
