
import React, { useState } from 'react';
import { Node } from '@xyflow/react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NodeConfig, WorkflowNodeData } from '@/types/workflow-builder';

interface NodeConfiguratorProps {
  node: Node<WorkflowNodeData>;
  onSave: (nodeId: string, config: NodeConfig) => void;
  onCancel: () => void;
}

export function NodeConfigurator({ node, onSave, onCancel }: NodeConfiguratorProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [config, setConfig] = useState<NodeConfig>((node.data.config as NodeConfig) || {});

  const handleClose = () => {
    setIsOpen(false);
    onCancel();
  };

  const handleSave = () => {
    onSave(node.id, config);
    setIsOpen(false);
  };

  const updateConfig = (key: keyof NodeConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Render different editor based on node type
  const renderEditor = () => {
    switch (node.type) {
      case 'message':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={config.message || ''}
                onChange={e => updateConfig('message', e.target.value)}
                placeholder="Type your message here..."
                className="min-h-[100px]"
              />
            </div>
            <div>
              <Label>Quick Replies (Optional)</Label>
              <div className="space-y-2 mt-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Input
                    key={i}
                    value={config.quickReplies?.[i] || ''}
                    onChange={e => {
                      const newReplies = [...(config.quickReplies || [])];
                      newReplies[i] = e.target.value;
                      updateConfig('quickReplies', newReplies.filter(Boolean));
                    }}
                    placeholder={`Quick reply option ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="conditionType">Condition Type</Label>
              <Select
                value={config.conditionType || 'attribute'}
                onValueChange={value => updateConfig('conditionType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attribute">Attribute Check</SelectItem>
                  <SelectItem value="contact">Contact Property</SelectItem>
                  <SelectItem value="company">Company Property</SelectItem>
                  <SelectItem value="ticket">Ticket Property</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="property">Property</Label>
              <Input
                id="property"
                value={config.property || ''}
                onChange={e => updateConfig('property', e.target.value)}
                placeholder="Property name"
              />
            </div>

            <div>
              <Label htmlFor="operator">Operator</Label>
              <Select
                value={config.operator || 'equals'}
                onValueChange={value => updateConfig('operator', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="not-equals">Not Equals</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="greater-than">Greater Than</SelectItem>
                  <SelectItem value="less-than">Less Than</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={config.value || ''}
                onChange={e => updateConfig('value', e.target.value)}
                placeholder="Comparison value"
              />
            </div>
          </div>
        );

      case 'assign_ticket':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="assigneeId">Assign To</Label>
              <Select
                value={config.assigneeId || ''}
                onValueChange={value => updateConfig('assigneeId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="round-robin">Round Robin</SelectItem>
                  <SelectItem value="least-busy">Least Busy</SelectItem>
                  <SelectItem value="user-123">Jane Smith</SelectItem>
                  <SelectItem value="user-456">John Doe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'wait':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="duration">Duration</Label>
              <div className="flex space-x-2">
                <Input
                  id="duration"
                  type="number"
                  value={config.duration || ''}
                  onChange={e => updateConfig('duration', e.target.value)}
                  placeholder="Wait duration"
                  className="flex-grow"
                />
                <Select
                  value={config.unit || 'minutes'}
                  onValueChange={value => updateConfig('unit', value as 'minutes' | 'hours' | 'days')}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      // Add other node types as needed
      default:
        return (
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Configuration options for this node type will be added soon.</p>
          </div>
        );
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="h-[80vh] overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle>Configure {node.data.label}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4">
          <Tabs defaultValue="settings">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
              <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Node Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {renderEditor()}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customId">Custom Node ID</Label>
                      <Input
                        id="customId"
                        value={config.customId || ''}
                        onChange={e => updateConfig('customId', e.target.value)}
                        placeholder="Enter a custom identifier for this node"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Used for tracking analytics and in API calls
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <DrawerFooter>
          <div className="flex justify-between">
            <DrawerClose asChild>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
            </DrawerClose>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
