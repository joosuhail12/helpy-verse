
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const FilterBar = () => {
  return (
    <div className="flex space-x-2 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Status</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer">Open</Badge>
                <Badge variant="outline" className="cursor-pointer">Pending</Badge>
                <Badge variant="outline" className="cursor-pointer">Closed</Badge>
                <Badge variant="outline" className="cursor-pointer">Resolved</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Priority</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer">Low</Badge>
                <Badge variant="outline" className="cursor-pointer">Medium</Badge>
                <Badge variant="outline" className="cursor-pointer">High</Badge>
                <Badge variant="outline" className="cursor-pointer">Urgent</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Assignee</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer">Unassigned</Badge>
                <Badge variant="outline" className="cursor-pointer">Me</Badge>
                <Badge variant="outline" className="cursor-pointer">My Team</Badge>
              </div>
            </div>
            
            <div className="pt-2 flex justify-between">
              <Button variant="outline" size="sm">
                Clear All
              </Button>
              <Button size="sm">
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <div className="hidden md:flex space-x-2">
        <Badge variant="outline" className="cursor-pointer bg-blue-50">
          Status: Open
          <button className="ml-1 text-gray-500 hover:text-gray-700">×</button>
        </Badge>
        <Badge variant="outline" className="cursor-pointer bg-blue-50">
          Priority: High
          <button className="ml-1 text-gray-500 hover:text-gray-700">×</button>
        </Badge>
      </div>
    </div>
  );
};
