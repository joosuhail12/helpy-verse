
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeftRight, RotateCcw, Scale } from "lucide-react";
import type { TeamRoutingSelectorProps } from '@/types/team';

const TeamRoutingSelector = ({
  selectedType,
  onTypeSelect,
  limits,
  onLimitsChange
}: TeamRoutingSelectorProps) => {
  const handleLimitChange = (field: string, value: string) => {
    if (!onLimitsChange) return;
    
    const numberValue = value === '' ? undefined : parseInt(value, 10);
    
    // Handle both property names (maxTickets and maxTotalTickets)
    if (field === 'maxTickets' || field === 'maxTotalTickets') {
      onLimitsChange({
        ...(limits || {}),
        maxTickets: numberValue,
        maxTotalTickets: numberValue
      });
    } else if (field === 'maxOpenTickets') {
      onLimitsChange({
        ...(limits || {}),
        maxOpenTickets: numberValue
      });
    } else if (field === 'maxActiveChats') {
      onLimitsChange({
        ...(limits || {}),
        maxActiveChats: numberValue
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <RadioGroup value={selectedType} onValueChange={(v) => onTypeSelect(v as 'manual' | 'round-robin' | 'load-balanced')}>
          <div className="flex items-start space-x-2 mb-4">
            <RadioGroupItem value="manual" id="manual" className="mt-1" />
            <div className="grid gap-1.5">
              <Label htmlFor="manual" className="flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4" />
                Manual Assignment
              </Label>
              <p className="text-sm text-gray-500">
                Agents manually pick up tickets from the team queue.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 mb-4">
            <RadioGroupItem value="round-robin" id="round-robin" className="mt-1" />
            <div className="grid gap-1.5">
              <Label htmlFor="round-robin" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Round Robin
              </Label>
              <p className="text-sm text-gray-500">
                Tickets are assigned to team members in rotation.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="load-balanced" id="load-balanced" className="mt-1" />
            <div className="grid gap-1.5">
              <Label htmlFor="load-balanced" className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Load Balanced
              </Label>
              <p className="text-sm text-gray-500">
                Tickets are assigned based on agent workload and capacity.
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>

      {selectedType === 'load-balanced' && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 className="text-sm font-medium">Agent Capacity Limits</h3>
          
          <div className="grid gap-3">
            <div>
              <Label htmlFor="maxTickets">Maximum Total Tickets</Label>
              <Input
                id="maxTickets"
                type="number"
                placeholder="No limit"
                value={limits?.maxTotalTickets !== undefined ? limits.maxTotalTickets : (limits?.maxTickets !== undefined ? limits.maxTickets : '')}
                onChange={(e) => handleLimitChange('maxTotalTickets', e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum number of tickets an agent can have at any time
              </p>
            </div>
            
            <div>
              <Label htmlFor="maxOpenTickets">Maximum Open Tickets</Label>
              <Input
                id="maxOpenTickets"
                type="number"
                placeholder="No limit"
                value={limits?.maxOpenTickets !== undefined ? limits.maxOpenTickets : ''}
                onChange={(e) => handleLimitChange('maxOpenTickets', e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum number of open tickets an agent can have
              </p>
            </div>
            
            <div>
              <Label htmlFor="maxActiveChats">Maximum Active Chats</Label>
              <Input
                id="maxActiveChats"
                type="number"
                placeholder="No limit"
                value={limits?.maxActiveChats !== undefined ? limits.maxActiveChats : ''}
                onChange={(e) => handleLimitChange('maxActiveChats', e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum number of active chat conversations an agent can handle
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamRoutingSelector;
