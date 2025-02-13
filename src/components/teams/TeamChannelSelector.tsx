
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TeamChannelSelectorProps } from '@/types/team';

// Mock data - in production this would come from your Node.js backend
const AVAILABLE_CHAT_CHANNELS = [
  { id: 'chat-1', name: 'General Chat' },
  { id: 'chat-2', name: 'Support Chat' },
];

const AVAILABLE_EMAIL_CHANNELS = [
  { id: 'email-1', name: 'Support Email' },
  { id: 'email-2', name: 'Sales Email' },
  { id: 'email-3', name: 'Billing Email' },
];

const TeamChannelSelector = ({
  selectedChatChannel,
  selectedEmailChannels,
  onChatChannelSelect,
  onEmailChannelToggle,
}: TeamChannelSelectorProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base">Chat Channel</Label>
        <p className="text-sm text-gray-500 mb-4">Select one chat channel for the team</p>
        <RadioGroup
          value={selectedChatChannel}
          onValueChange={(value) => onChatChannelSelect(value === 'none' ? undefined : value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none" className="cursor-pointer">No specific channel (access to all)</Label>
          </div>
          {AVAILABLE_CHAT_CHANNELS.map((channel) => (
            <div key={channel.id} className="flex items-center space-x-2">
              <RadioGroupItem value={channel.id} id={channel.id} />
              <Label htmlFor={channel.id} className="cursor-pointer">{channel.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base">Email Channels</Label>
        <p className="text-sm text-gray-500 mb-4">Select email channels for the team</p>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          {AVAILABLE_EMAIL_CHANNELS.map((channel) => (
            <div key={channel.id} className="flex items-center space-x-2 mb-2">
              <Checkbox
                id={channel.id}
                checked={selectedEmailChannels.includes(channel.id)}
                onCheckedChange={() => onEmailChannelToggle(channel.id)}
              />
              <Label htmlFor={channel.id} className="cursor-pointer">{channel.name}</Label>
            </div>
          ))}
        </ScrollArea>
        {selectedEmailChannels.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">No channels selected (team will have access to all email channels)</p>
        )}
      </div>
    </div>
  );
};

export default TeamChannelSelector;
