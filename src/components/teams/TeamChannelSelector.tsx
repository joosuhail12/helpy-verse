
import { useState } from 'react';
import { Check, MessagesSquare, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';

// Mock data for available channels
const availableChatChannels = [
  { id: "chat-1", name: "Live Chat" },
  { id: "chat-2", name: "Support Chat" },
  { id: "chat-3", name: "Sales Chat" },
];

const availableEmailChannels = [
  { id: "email-1", name: "support@example.com" },
  { id: "email-2", name: "sales@example.com" },
  { id: "email-3", name: "info@example.com" },
  { id: "email-4", name: "help@example.com" },
];

interface TeamChannelSelectorProps {
  selectedChatChannel?: string;
  selectedEmailChannels: string[];
  onChatChannelSelect: (channelId: string | undefined) => void;
  onEmailChannelToggle: (channelId: string) => void;
}

const TeamChannelSelector = ({
  selectedChatChannel,
  selectedEmailChannels = [],
  onChatChannelSelect,
  onEmailChannelToggle,
}: TeamChannelSelectorProps) => {
  const [customEmail, setCustomEmail] = useState('');

  const handleAddCustomEmail = () => {
    if (customEmail && !selectedEmailChannels.includes(customEmail)) {
      onEmailChannelToggle(customEmail);
      setCustomEmail('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessagesSquare size={18} />
          <h3 className="font-medium">Chat Channels</h3>
        </div>

        <div>
          <ToggleGroup 
            type="single" 
            variant="outline"
            className="justify-start"
            value={selectedChatChannel}
            onValueChange={onChatChannelSelect}
          >
            {availableChatChannels.map((channel) => (
              <ToggleGroupItem 
                key={channel.id} 
                value={channel.id}
                className="flex items-center gap-2"
              >
                {selectedChatChannel === channel.id && (
                  <Check className="h-4 w-4" />
                )}
                {channel.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail size={18} />
          <h3 className="font-medium">Email Channels</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {availableEmailChannels.map((channel) => (
            <div 
              key={channel.id}
              className={`
                flex items-center justify-between p-3 rounded-md border cursor-pointer
                ${selectedEmailChannels.includes(channel.id) ? 'border-primary bg-primary/5' : 'border-gray-200'}
              `}
              onClick={() => onEmailChannelToggle(channel.id)}
            >
              <span>{channel.name}</span>
              {selectedEmailChannels.includes(channel.id) && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customEmail">Add custom email address</Label>
          <div className="flex items-center gap-2">
            <Input 
              id="customEmail"
              type="email" 
              placeholder="Enter email address" 
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
            />
            <Button 
              type="button" 
              onClick={handleAddCustomEmail}
              disabled={!customEmail.trim() || !customEmail.includes('@')}
            >
              Add
            </Button>
          </div>
        </div>

        {selectedEmailChannels.length > 0 && (
          <div className="space-y-2">
            <Label>Selected email addresses</Label>
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md">
              {selectedEmailChannels.map((email) => (
                <Badge 
                  key={email} 
                  variant="secondary"
                  className="px-3 py-1 cursor-pointer"
                  onClick={() => onEmailChannelToggle(email)}
                >
                  {email}
                  <span className="ml-2 text-gray-500">×</span>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamChannelSelector;
