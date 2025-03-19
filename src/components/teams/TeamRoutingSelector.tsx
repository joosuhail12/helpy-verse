
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TeamRoutingSelectorProps } from '@/types/team';

export const TeamRoutingSelector = ({
  selectedType,
  onTypeSelect,
  limits,
  onLimitsChange,
}: TeamRoutingSelectorProps) => {
  const handleLimitChange = (key: keyof typeof limits, value: string) => {
    const newLimits = { ...limits };
    newLimits[key] = value ? Number(value) : undefined;
    onLimitsChange(newLimits);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <Label className="text-base">Ticket Routing Type</Label>
            <RadioGroup
              value={selectedType}
              onValueChange={(value) => onTypeSelect(value as 'manual' | 'round-robin' | 'load-balanced')}
              className="mt-3 space-y-3"
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="manual" id="manual" className="mt-1" />
                <div>
                  <Label htmlFor="manual" className="font-medium">Manual Assignment</Label>
                  <p className="text-sm text-muted-foreground">
                    Team managers will manually assign tickets to team members
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RadioGroupItem value="round-robin" id="round-robin" className="mt-1" />
                <div>
                  <Label htmlFor="round-robin" className="font-medium">Round Robin</Label>
                  <p className="text-sm text-muted-foreground">
                    Tickets will be automatically assigned to team members in a rotating sequence
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RadioGroupItem value="load-balanced" id="load-balanced" className="mt-1" />
                <div>
                  <Label htmlFor="load-balanced" className="font-medium">Load Balanced</Label>
                  <p className="text-sm text-muted-foreground">
                    Tickets will be assigned to team members with the lowest current workload
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {selectedType !== 'manual' && (
            <div className="space-y-4 pt-4">
              <Label className="text-base">Workload Limits</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-tickets">Maximum Total Tickets</Label>
                  <Input
                    id="max-tickets"
                    type="number"
                    min="0"
                    value={limits.maxTickets?.toString() || ''}
                    onChange={(e) => handleLimitChange('maxTickets', e.target.value)}
                    placeholder="No limit"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-open">Maximum Open Tickets</Label>
                  <Input
                    id="max-open"
                    type="number"
                    min="0"
                    value={limits.maxOpenTickets?.toString() || ''}
                    onChange={(e) => handleLimitChange('maxOpenTickets', e.target.value)}
                    placeholder="No limit"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-chats">Maximum Active Chats</Label>
                  <Input
                    id="max-chats"
                    type="number"
                    min="0"
                    value={limits.maxActiveChats?.toString() || ''}
                    onChange={(e) => handleLimitChange('maxActiveChats', e.target.value)}
                    placeholder="No limit"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
