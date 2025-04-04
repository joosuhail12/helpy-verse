
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import ChatWidgetPreview from './ChatWidgetPreview';

const BehaviorSettings: React.FC = () => {
  // In a real implementation, these would be fetched from the backend
  const [autoOpen, setAutoOpen] = useState(false);
  const [autoOpenDelay, setAutoOpenDelay] = useState(30);
  const [enableHumanHandoff, setEnableHumanHandoff] = useState(true);
  const [collectUserData, setCollectUserData] = useState(true);
  const [inactivityTimeout, setInactivityTimeout] = useState(60);
  const [inactivityAction, setInactivityAction] = useState<string>('prompt');
  const [queryHandling, setQueryHandling] = useState<string>('continuous');

  const handleSaveChanges = () => {
    // In a real implementation, we would save changes to the backend here
    toast({
      title: "Settings saved",
      description: "Your behavior settings have been saved successfully.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-lg font-medium">Engagement</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoOpen">Auto-Open Chat</Label>
                <p className="text-sm text-muted-foreground">Automatically open the chat after a delay</p>
              </div>
              <Switch
                id="autoOpen"
                checked={autoOpen}
                onCheckedChange={setAutoOpen}
              />
            </div>
            
            {autoOpen && (
              <div className="space-y-2">
                <Label htmlFor="autoOpenDelay">Auto-Open Delay (seconds)</Label>
                <Input
                  id="autoOpenDelay"
                  type="number"
                  min="0"
                  value={autoOpenDelay}
                  onChange={(e) => setAutoOpenDelay(parseInt(e.target.value) || 0)}
                />
              </div>
            )}
          </div>

          <Separator />

          <h2 className="text-lg font-medium">Human Handoff</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="humanHandoff">Enable Human Handoff</Label>
                <p className="text-sm text-muted-foreground">Allow users to request human assistance</p>
              </div>
              <Switch
                id="humanHandoff"
                checked={enableHumanHandoff}
                onCheckedChange={setEnableHumanHandoff}
              />
            </div>
          </div>

          <Separator />

          <h2 className="text-lg font-medium">Data Collection</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="collectData">Collect User Data</Label>
                <p className="text-sm text-muted-foreground">Collect name, email before starting chat</p>
              </div>
              <Switch
                id="collectData"
                checked={collectUserData}
                onCheckedChange={setCollectUserData}
              />
            </div>
          </div>

          <Separator />

          <h2 className="text-lg font-medium">Conversation Handling</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="queryHandling">Query Handling</Label>
              <Select value={queryHandling} onValueChange={setQueryHandling}>
                <SelectTrigger>
                  <SelectValue placeholder="Select query handling method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Query (Answer one question at a time)</SelectItem>
                  <SelectItem value="continuous">Continuous (Remember conversation history)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inactivityTimeout">Inactivity Timeout (seconds)</Label>
              <Input
                id="inactivityTimeout"
                type="number"
                min="0"
                value={inactivityTimeout}
                onChange={(e) => setInactivityTimeout(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inactivityAction">Inactivity Action</Label>
              <Select value={inactivityAction} onValueChange={setInactivityAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="close">Close chat</SelectItem>
                  <SelectItem value="handoff">Handoff to human</SelectItem>
                  <SelectItem value="prompt">Prompt user</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-lg font-medium">Live Preview</h2>
          <div className="border rounded-lg p-4 bg-gray-50 h-[600px] relative">
            <ChatWidgetPreview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehaviorSettings;
