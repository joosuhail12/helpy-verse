
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TeamRoutingSelectorProps } from '@/types/team';

export const TeamRoutingSelector: React.FC<TeamRoutingSelectorProps> = ({
  selectedType,
  onTypeSelect,
  limits,
  onLimitsChange
}) => {
  const handleLimitChange = (key: keyof typeof limits, value: string) => {
    const numValue = value ? parseInt(value, 10) : undefined;
    onLimitsChange({
      ...limits,
      [key]: numValue
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket Routing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={selectedType} onValueChange={(value: 'manual' | 'round-robin' | 'load-balanced') => onTypeSelect(value)}>
          <div className="flex items-center space-x-2 mb-4">
            <RadioGroupItem value="manual" id="manual" />
            <Label htmlFor="manual">Manual Assignment</Label>
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <RadioGroupItem value="round-robin" id="round-robin" />
            <Label htmlFor="round-robin">Round Robin</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="load-balanced" id="load-balanced" />
            <Label htmlFor="load-balanced">Load Balanced</Label>
          </div>
        </RadioGroup>

        {selectedType !== 'manual' && (
          <div className="space-y-4 mt-6 border-t pt-6">
            <h3 className="text-sm font-medium">Team Member Limits</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxTickets">Max Tickets Per Agent</Label>
                <Input
                  id="maxTickets"
                  type="number"
                  min="0"
                  value={limits.maxTickets?.toString() || ''}
                  onChange={(e) => handleLimitChange('maxTickets', e.target.value)}
                  placeholder="No limit"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxOpenTickets">Max Open Tickets</Label>
                <Input
                  id="maxOpenTickets"
                  type="number"
                  min="0"
                  value={limits.maxOpenTickets?.toString() || ''}
                  onChange={(e) => handleLimitChange('maxOpenTickets', e.target.value)}
                  placeholder="No limit"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxActiveChats">Max Active Chats</Label>
                <Input
                  id="maxActiveChats"
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
      </CardContent>
    </Card>
  );
};
