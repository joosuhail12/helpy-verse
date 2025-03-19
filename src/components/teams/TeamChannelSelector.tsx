
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { MessagesSquare, Mail } from "lucide-react";

interface TeamChannelSelectorProps {
  selectedChannels: string[];
  onChannelSelect: (channelId: string) => void;
  selectedChatChannel?: string;
  selectedEmailChannels: string[];
  onChatChannelSelect: (channelId: string | undefined) => void;
  onEmailChannelToggle: (channelId: string) => void;
}

const TeamChannelSelector = ({
  selectedChannels,
  onChannelSelect,
  selectedChatChannel,
  selectedEmailChannels,
  onChatChannelSelect,
  onEmailChannelToggle
}: TeamChannelSelectorProps) => {
  // Mock channels - in a real app, these would come from API
  const chatChannels = [
    { id: 'chat-website', name: 'Website Chat' },
    { id: 'chat-mobile', name: 'Mobile App Chat' },
    { id: 'chat-facebook', name: 'Facebook Messenger' },
    { id: 'chat-whatsapp', name: 'WhatsApp' },
  ];
  
  const emailChannels = [
    { id: 'email-support', name: 'support@example.com' },
    { id: 'email-info', name: 'info@example.com' },
    { id: 'email-sales', name: 'sales@example.com' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessagesSquare className="h-4 w-4 text-primary" />
          <h3 className="text-md font-medium">Chat Channels</h3>
        </div>
        
        <div className="border rounded-md p-4">
          <RadioGroup 
            value={selectedChatChannel} 
            onValueChange={onChatChannelSelect}
          >
            <div className="space-y-3">
              {chatChannels.map(channel => (
                <div key={channel.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={channel.id} id={channel.id} />
                  <Label htmlFor={channel.id} className="cursor-pointer">{channel.name}</Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="" id="no-chat" />
                <Label htmlFor="no-chat" className="cursor-pointer">No chat channel</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          <h3 className="text-md font-medium">Email Channels</h3>
        </div>
        
        <div className="space-y-2">
          {emailChannels.map(channel => (
            <Card key={channel.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <Label htmlFor={`email-${channel.id}`} className="cursor-pointer">{channel.name}</Label>
                <Switch
                  id={`email-${channel.id}`}
                  checked={selectedEmailChannels.includes(channel.id)}
                  onCheckedChange={() => onEmailChannelToggle(channel.id)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamChannelSelector;
