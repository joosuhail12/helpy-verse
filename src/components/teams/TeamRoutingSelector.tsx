
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Users, Repeat2, Scale } from "lucide-react";
import type { TeamRoutingSelectorProps } from '@/types/team';

const TeamRoutingSelector = ({ 
  selectedType, 
  onTypeSelect,
  limits = {},
  onLimitsChange = () => {}
}: TeamRoutingSelectorProps) => {
  const handleLimitChange = (key: keyof typeof limits) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onLimitsChange({
      ...limits,
      [key]: value
    });
  };

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
          
          {selectedType === 'load-balanced' && (
            <div className="mt-4 space-y-6 pt-4 border-t">
              <div className="space-y-4">
                <Label className="text-sm font-medium">Maximum Total Tickets</Label>
                <Input
                  type="number"
                  min={0}
                  max={50}
                  value={limits.maxTotalTickets || 0}
                  onChange={handleLimitChange('maxTotalTickets')}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">Maximum Open Tickets</Label>
                <Input
                  type="number"
                  min={0}
                  max={30}
                  value={limits.maxOpenTickets || 0}
                  onChange={handleLimitChange('maxOpenTickets')}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">Maximum Active Chats</Label>
                <Input
                  type="number"
                  min={0}
                  max={10}
                  value={limits.maxActiveChats || 0}
                  onChange={handleLimitChange('maxActiveChats')}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </RadioGroup>
  );
};

export default TeamRoutingSelector;

