
import React, { useState } from 'react';
import { CheckIcon, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DrawerFooter } from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { WorkflowTriggerConfig } from '@/types/workflow-builder';

interface TriggerDrawerProps {
  triggerId: string;
  onSave: (config: WorkflowTriggerConfig) => void;
}

export const TriggerDrawer: React.FC<TriggerDrawerProps> = ({ triggerId, onSave }) => {
  const [config, setConfig] = useState<WorkflowTriggerConfig>({
    channels: {
      chat: true,
      email: []
    },
    filters: {
      audience: [],
      custom_fields: []
    }
  });

  // Mock data for channels and filters
  const emailChannels = [
    { id: 'support', name: 'Support', email: 'support@company.com' },
    { id: 'sales', name: 'Sales', email: 'sales@company.com' },
    { id: 'info', name: 'General Inquiries', email: 'info@company.com' }
  ];

  const handleChannelChange = (channelId: string, checked: boolean) => {
    if (checked) {
      setConfig({
        ...config,
        channels: {
          ...config.channels,
          email: [...config.channels.email, channelId]
        }
      });
    } else {
      setConfig({
        ...config,
        channels: {
          ...config.channels,
          email: config.channels.email.filter(id => id !== channelId)
        }
      });
    }
  };

  const handleChatChange = (checked: boolean) => {
    setConfig({
      ...config,
      channels: {
        ...config.channels,
        chat: checked
      }
    });
  };

  return (
    <>
      <div className="px-4 py-2">
        <Tabs defaultValue="channels">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="channels" className="flex-1">Channels</TabsTrigger>
            <TabsTrigger value="audience" className="flex-1">Audience</TabsTrigger>
            <TabsTrigger value="custom-fields" className="flex-1">Custom Fields</TabsTrigger>
          </TabsList>

          <TabsContent value="channels">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="chat-channel" 
                      checked={config.channels.chat} 
                      onCheckedChange={handleChatChange}
                    />
                    <Label htmlFor="chat-channel">Apply to chat conversations</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Email Channels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {emailChannels.map((channel) => (
                      <div key={channel.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`email-${channel.id}`} 
                          checked={config.channels.email.includes(channel.id)}
                          onCheckedChange={(checked) => handleChannelChange(channel.id, checked === true)}
                        />
                        <Label htmlFor={`email-${channel.id}`} className="flex-1">
                          <div className="flex flex-col">
                            <span>{channel.name}</span>
                            <span className="text-xs text-muted-foreground">{channel.email}</span>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audience">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Audience Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40 border border-dashed rounded-md">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">No filters configured</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Add Filter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom-fields">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Custom Field Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40 border border-dashed rounded-md">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">No custom field filters configured</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Add Custom Field Filter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <DrawerFooter>
        <Button onClick={() => onSave(config)} className="w-full gap-2">
          <CheckIcon className="h-4 w-4" />
          Save Trigger Configuration
        </Button>
      </DrawerFooter>
    </>
  );
};
