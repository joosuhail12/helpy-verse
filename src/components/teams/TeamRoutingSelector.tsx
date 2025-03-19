
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface TeamRoutingSelectorProps {
  selectedType: 'manual' | 'round-robin' | 'load-balanced';
  onTypeSelect: (type: 'manual' | 'round-robin' | 'load-balanced') => void;
  limits: {
    maxTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  };
  onLimitsChange: (limits: {
    maxTickets?: number;
    maxOpenTickets?: number;
    maxActiveChats?: number;
  }) => void;
}

export function TeamRoutingSelector({
  selectedType,
  onTypeSelect,
  limits,
  onLimitsChange
}: TeamRoutingSelectorProps) {
  return (
    <div className="space-y-6">
      <RadioGroup 
        defaultValue={selectedType}
        value={selectedType}
        onValueChange={(value) => onTypeSelect(value as 'manual' | 'round-robin' | 'load-balanced')}
      >
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="manual" id="manual" />
          <div className="grid gap-1.5">
            <Label htmlFor="manual" className="font-medium">Manual Assignment</Label>
            <p className="text-sm text-muted-foreground">
              Team leaders or supervisors will manually assign tickets to team members.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2 mt-4">
          <RadioGroupItem value="round-robin" id="round-robin" />
          <div className="grid gap-1.5">
            <Label htmlFor="round-robin" className="font-medium">Round Robin</Label>
            <p className="text-sm text-muted-foreground">
              Tickets will be automatically assigned to team members in a rotating order.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2 mt-4">
          <RadioGroupItem value="load-balanced" id="load-balanced" />
          <div className="grid gap-1.5">
            <Label htmlFor="load-balanced" className="font-medium">Load Balanced</Label>
            <p className="text-sm text-muted-foreground">
              Tickets will be assigned based on agent capacity and current workload.
            </p>
          </div>
        </div>
      </RadioGroup>
      
      {selectedType === 'load-balanced' && (
        <Accordion type="single" collapsible defaultValue="capacity">
          <AccordionItem value="capacity">
            <AccordionTrigger>Capacity Configuration</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-2">
                <div className="grid gap-2">
                  <Label htmlFor="max-tickets">Maximum Tickets Per Agent</Label>
                  <Input
                    id="max-tickets"
                    type="number"
                    min="1"
                    value={limits.maxTickets || ''}
                    onChange={(e) => onLimitsChange({
                      ...limits,
                      maxTickets: e.target.valueAsNumber || undefined
                    })}
                    placeholder="e.g., 50"
                  />
                  <p className="text-xs text-muted-foreground">
                    The total number of tickets an agent can have assigned at one time.
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="max-open-tickets">Maximum Open Tickets</Label>
                  <Input
                    id="max-open-tickets"
                    type="number"
                    min="1"
                    value={limits.maxOpenTickets || ''}
                    onChange={(e) => onLimitsChange({
                      ...limits,
                      maxOpenTickets: e.target.valueAsNumber || undefined
                    })}
                    placeholder="e.g., 10"
                  />
                  <p className="text-xs text-muted-foreground">
                    The maximum number of tickets an agent can have open at one time.
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="max-active-chats">Maximum Active Chats</Label>
                  <Input
                    id="max-active-chats"
                    type="number"
                    min="1"
                    value={limits.maxActiveChats || ''}
                    onChange={(e) => onLimitsChange({
                      ...limits,
                      maxActiveChats: e.target.valueAsNumber || undefined
                    })}
                    placeholder="e.g., 5"
                  />
                  <p className="text-xs text-muted-foreground">
                    The maximum number of chat conversations an agent can have active at one time.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
