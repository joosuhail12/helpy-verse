
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ChannelEmailSettingsProps {
  allowAgentConversations: boolean;
  useAgentNames: boolean;
  useOriginalSender: boolean;
  onSettingChange: (setting: string, value: boolean) => void;
  isEditing: boolean;
}

export const ChannelEmailSettings: React.FC<ChannelEmailSettingsProps> = ({
  allowAgentConversations,
  useAgentNames,
  useOriginalSender,
  onSettingChange,
  isEditing,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Email Settings</h3>
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <Switch
            id="allowAgentConversations"
            checked={allowAgentConversations}
            onCheckedChange={(checked) => onSettingChange('allowAgentConversations', checked)}
            disabled={!isEditing}
          />
          <div className="space-y-1">
            <Label htmlFor="allowAgentConversations" className="font-medium">
              Allow agents to initiate conversation with customers
            </Label>
            <p className="text-sm text-muted-foreground">
              If enabled, agents will be able to send outbound emails to new or existing customers that will be converted into outbound tickets.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <Switch
            id="useAgentNames"
            checked={useAgentNames}
            onCheckedChange={(checked) => onSettingChange('useAgentNames', checked)}
            disabled={!isEditing}
          />
          <div className="space-y-1">
            <Label htmlFor="useAgentNames" className="font-medium">
              Use agent names in ticket replies and outbound emails
            </Label>
            <p className="text-sm text-muted-foreground">
              If enabled, agents will be allowed to choose their own name as the sender name in ticket replies and outbound emails. Sender email will still remain the support email address.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <Switch
            id="useOriginalSender"
            checked={useOriginalSender}
            onCheckedChange={(checked) => onSettingChange('useOriginalSender', checked)}
            disabled={!isEditing}
          />
          <div className="space-y-1">
            <Label htmlFor="useOriginalSender" className="font-medium">
              For forwarded emails, use original sender as requester
            </Label>
            <p className="text-sm text-muted-foreground">
              When an agent forwards an email from their mailbox to the helpdesk, create the ticket under the original sender. If disabled, the requester is the agent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
