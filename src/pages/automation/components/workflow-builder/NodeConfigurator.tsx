
import React, { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorkflowNode, NodeConfig } from '@/types/workflow-builder';

interface NodeConfiguratorProps {
  node: WorkflowNode;
  onSave: (nodeId: string, config: NodeConfig) => void;
  onCancel: () => void;
}

export const NodeConfigurator: React.FC<NodeConfiguratorProps> = ({
  node,
  onSave,
  onCancel
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const initialConfig = (node.data.config as NodeConfig) || {};
  const [config, setConfig] = useState<NodeConfig>(initialConfig);
  
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onCancel, 300); // Delay to allow drawer close animation
  };
  
  const handleSave = () => {
    onSave(node.id, config);
    setIsOpen(false);
  };
  
  // Render different configuration based on node type
  const renderConfigContent = () => {
    switch (node.type) {
      case 'message':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                className="h-32 mt-2"
                value={config.message || ''}
                onChange={(e) => setConfig({...config, message: e.target.value})}
              />
            </div>
            
            <div>
              <Label>Quick Replies</Label>
              <div className="mt-2 space-y-2">
                {(config.quickReplies || []).map((reply, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={reply}
                      onChange={(e) => {
                        const updatedReplies = [...(config.quickReplies || [])];
                        updatedReplies[index] = e.target.value;
                        setConfig({...config, quickReplies: updatedReplies});
                      }}
                      placeholder={`Quick reply ${index + 1}`}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const updatedReplies = [...(config.quickReplies || [])];
                        updatedReplies.splice(index, 1);
                        setConfig({...config, quickReplies: updatedReplies});
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setConfig({
                      ...config, 
                      quickReplies: [...(config.quickReplies || []), '']
                    });
                  }}
                >
                  Add Quick Reply
                </Button>
              </div>
            </div>
          </div>
        );
        
      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="condition-type">Condition Type</Label>
              <Select 
                value={config.conditionType || 'contact'} 
                onValueChange={(value) => setConfig({...config, conditionType: value})}
              >
                <SelectTrigger id="condition-type" className="mt-2">
                  <SelectValue placeholder="Select condition type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contact">Contact Property</SelectItem>
                  <SelectItem value="ticket">Ticket Property</SelectItem>
                  <SelectItem value="custom_field">Custom Field</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="property">Property</Label>
              <Input
                id="property"
                className="mt-2"
                placeholder="Select property"
                value={config.property || ''}
                onChange={(e) => setConfig({...config, property: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="operator">Operator</Label>
              <Select 
                value={config.operator || 'equals'} 
                onValueChange={(value) => setConfig({...config, operator: value})}
              >
                <SelectTrigger id="operator" className="mt-2">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="greater_than">Greater Than</SelectItem>
                  <SelectItem value="less_than">Less Than</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                className="mt-2"
                placeholder="Compare value"
                value={config.value || ''}
                onChange={(e) => setConfig({...config, value: e.target.value})}
              />
            </div>
          </div>
        );
        
      case 'action':
        switch (node.data.actionType) {
          case 'assign_ticket':
            return (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select 
                    value={config.assigneeId || ''} 
                    onValueChange={(value) => setConfig({...config, assigneeId: value})}
                  >
                    <SelectTrigger id="assignee" className="mt-2">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user1">John Doe</SelectItem>
                      <SelectItem value="user2">Jane Smith</SelectItem>
                      <SelectItem value="team1">Support Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
            
          case 'wait':
            return (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="wait-duration">Wait Duration</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="wait-duration"
                      type="number"
                      min="1"
                      placeholder="Duration"
                      value={config.duration || ''}
                      onChange={(e) => setConfig({...config, duration: e.target.value})}
                    />
                    <Select 
                      value={config.unit || 'minutes'} 
                      onValueChange={(value: 'minutes' | 'hours' | 'days') => setConfig({...config, unit: value})}
                    >
                      <SelectTrigger className="w-[150px]">
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
            
          default:
            return (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Configuration options for this action type</p>
                </div>
              </div>
            );
        }
        
      default:
        return (
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Configuration options for this node type</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>Configure {node.data.label}</DrawerTitle>
          <DrawerDescription>
            Set up how this step should work in your workflow
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 py-2">
          <Tabs defaultValue="config">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="config" className="flex-1">Configuration</TabsTrigger>
              <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="config">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Configure {node.data.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderConfigContent()}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customId">Custom Node ID</Label>
                      <Input
                        id="customId"
                        placeholder="Enter a custom ID for this node (optional)"
                        className="mt-2"
                        value={config.customId || ''}
                        onChange={(e) => setConfig({...config, customId: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <DrawerFooter>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
