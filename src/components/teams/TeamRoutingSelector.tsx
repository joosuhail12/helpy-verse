
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamRoutingSelectorProps } from '@/types/team';

export const TeamRoutingSelector: React.FC<TeamRoutingSelectorProps> = ({
  selectedType = 'manual',
  onTypeSelect,
  limits = {},
  onLimitsChange,
  routingType,
  setRoutingType,
  routingLimits,
  setRoutingLimits
}) => {
  // Use props based on the version of components using this
  const effectiveType = selectedType || routingType;
  const effectiveLimits = limits || routingLimits || {};
  
  const handleTypeChange = (value: 'manual' | 'round-robin' | 'load-balanced') => {
    if (onTypeSelect) {
      onTypeSelect(value);
    } else if (setRoutingType) {
      setRoutingType(value);
    }
  };

  const handleLimitChange = (key: string, value: number) => {
    const newLimits = { ...effectiveLimits, [key]: value };
    if (onLimitsChange) {
      onLimitsChange(newLimits);
    } else if (setRoutingLimits) {
      setRoutingLimits(newLimits);
    }
  };

  return (
    <div className="space-y-6">
      <RadioGroup 
        value={effectiveType} 
        onValueChange={(value) => handleTypeChange(value as 'manual' | 'round-robin' | 'load-balanced')}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="manual" id="manual" />
          <Label htmlFor="manual">Manual Assignment</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="round-robin" id="round-robin" />
          <Label htmlFor="round-robin">Round Robin</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="load-balanced" id="load-balanced" />
          <Label htmlFor="load-balanced">Load Balanced</Label>
        </div>
      </RadioGroup>

      {(effectiveType === 'round-robin' || effectiveType === 'load-balanced') && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Routing Limits</CardTitle>
            <CardDescription>Set the maximum limits for assignments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxTickets">Max tickets per agent</Label>
              <Input
                id="maxTickets"
                type="number"
                value={effectiveLimits.maxTickets || ''}
                onChange={(e) => handleLimitChange('maxTickets', parseInt(e.target.value))}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxOpenTickets">Max open tickets per agent</Label>
              <Input
                id="maxOpenTickets"
                type="number"
                value={effectiveLimits.maxOpenTickets || ''}
                onChange={(e) => handleLimitChange('maxOpenTickets', parseInt(e.target.value))}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxActiveChats">Max active chats per agent</Label>
              <Input
                id="maxActiveChats"
                type="number"
                value={effectiveLimits.maxActiveChats || ''}
                onChange={(e) => handleLimitChange('maxActiveChats', parseInt(e.target.value))}
                min={1}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
