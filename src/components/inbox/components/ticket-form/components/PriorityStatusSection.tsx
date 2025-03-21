
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriorityStatusSectionProps {
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'pending' | 'closed';
  onPriorityChange: (value: 'low' | 'medium' | 'high') => void;
  onStatusChange: (value: 'open' | 'pending' | 'closed') => void;
}

const PriorityStatusSection = ({
  priority,
  status,
  onPriorityChange,
  onStatusChange
}: PriorityStatusSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="space-y-2.5">
        <Label htmlFor="priority" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5 text-primary/80" />
          Priority
        </Label>
        <Select 
          value={priority} 
          onValueChange={onPriorityChange}
        >
          <SelectTrigger 
            id="priority" 
            className={cn(
              "transition-colors border-gray-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/40 rounded-lg",
              priority === 'high' ? "text-red-600" : 
              priority === 'medium' ? "text-amber-600" : 
              "text-green-600"
            )}
          >
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low" className="text-green-600">Low</SelectItem>
            <SelectItem value="medium" className="text-amber-600">Medium</SelectItem>
            <SelectItem value="high" className="text-red-600">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2.5">
        <Label htmlFor="status" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-primary/80" />
          Status
        </Label>
        <Select 
          value={status} 
          onValueChange={onStatusChange}
        >
          <SelectTrigger 
            id="status" 
            className="transition-colors border-gray-200 focus:border-primary/50 focus:ring-1 focus:ring-primary/40 rounded-lg"
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PriorityStatusSection;
