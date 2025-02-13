
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Users, Repeat2, Scale } from "lucide-react";
import type { TeamRoutingSelectorProps } from '@/types/team';

const TeamRoutingSelector = ({ selectedType, onTypeSelect }: TeamRoutingSelectorProps) => {
  return (
    <RadioGroup
      value={selectedType}
      onValueChange={(value: 'manual' | 'round-robin' | 'load-balanced') => onTypeSelect(value)}
      className="space-y-4"
    >
      <div className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-accent/50 transition-colors">
        <RadioGroupItem value="manual" id="manual" className="mt-1" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <Label htmlFor="manual" className="font-medium">Manual Routing</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Team members manually pick tickets from the queue. Best for teams that want full control over ticket assignment.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-accent/50 transition-colors">
        <RadioGroupItem value="round-robin" id="round-robin" className="mt-1" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <Repeat2 className="h-5 w-5 text-primary" />
            <Label htmlFor="round-robin" className="font-medium">Round Robin Routing</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Tickets are automatically assigned to team members in a sequential order. Ensures even distribution of workload.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-accent/50 transition-colors">
        <RadioGroupItem value="load-balanced" id="load-balanced" className="mt-1" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <Scale className="h-5 w-5 text-primary" />
            <Label htmlFor="load-balanced" className="font-medium">Load Balanced Routing</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Tickets are assigned based on team members' current workload. Optimizes for team capacity and availability.
          </p>
        </div>
      </div>
    </RadioGroup>
  );
};

export default TeamRoutingSelector;

