
import React, { useState, useEffect } from 'react';
import { CheckIcon, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DrawerFooter } from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { WorkflowTriggerConfig } from '@/types/workflow-builder';
import { QueryBuilder } from '@/components/common/query-builder/QueryBuilder';
import { QueryGroup, QueryField } from '@/types/queryBuilder';
import { generateId } from '@/lib/utils';

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

  // Initialize audience query group
  const [audienceQueryGroup, setAudienceQueryGroup] = useState<QueryGroup>({
    id: 'audience-root',
    combinator: 'and',
    rules: []
  });

  // Update config whenever audienceQueryGroup changes
  useEffect(() => {
    setConfig(prevConfig => ({
      ...prevConfig,
      filters: {
        ...prevConfig.filters,
        audience: audienceQueryGroup.rules.length > 0 ? [audienceQueryGroup] : []
      }
    }));
  }, [audienceQueryGroup]);

  // Mock data for channels and filters
  const emailChannels = [
    { id: 'support', name: 'Support', email: 'support@company.com' },
    { id: 'sales', name: 'Sales', email: 'sales@company.com' },
    { id: 'info', name: 'General Inquiries', email: 'info@company.com' }
  ];

  // Available audience fields for filtering
  const audienceFields: QueryField[] = [
    {
      id: 'contact.email',
      name: 'Email',
      label: 'Email',
      type: 'text',
      operators: ['equals', 'contains', 'starts_with', 'ends_with']
    },
    {
      id: 'contact.type',
      name: 'Contact Type',
      label: 'Contact Type',
      type: 'select',
      operators: ['equals', 'not_equals'],
      options: [
        { label: 'Customer', value: 'customer' },
        { label: 'Lead', value: 'lead' },
        { label: 'Prospect', value: 'prospect' }
      ]
    },
    {
      id: 'contact.status',
      name: 'Contact Status',
      label: 'Contact Status',
      type: 'select',
      operators: ['equals', 'not_equals'],
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Pending', value: 'pending' }
      ]
    },
    {
      id: 'company.name',
      name: 'Company Name',
      label: 'Company Name',
      type: 'text',
      operators: ['equals', 'contains', 'starts_with']
    },
    {
      id: 'company.industry',
      name: 'Industry',
      label: 'Industry',
      type: 'select',
      operators: ['equals', 'not_equals'],
      options: [
        { label: 'Technology', value: 'technology' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Finance', value: 'finance' },
        { label: 'Education', value: 'education' },
        { label: 'Retail', value: 'retail' }
      ]
    }
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
                {audienceQueryGroup.rules.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground mb-2">Define who this workflow applies to</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setAudienceQueryGroup({
                        ...audienceQueryGroup,
                        rules: [
                          {
                            id: generateId(),
                            field: '',
                            operator: 'equals',
                            value: ''
                          }
                        ]
                      })}
                    >
                      Add Filter
                    </Button>
                  </div>
                ) : (
                  <QueryBuilder
                    value={audienceQueryGroup}
                    onChange={setAudienceQueryGroup}
                    fields={audienceFields}
                  />
                )}
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
