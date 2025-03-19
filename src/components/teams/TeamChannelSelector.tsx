
import React from 'react';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { TeamChannelSelectorProps } from '@/types/team';

// Mock data - in production this would come from your Node.js backend
const CHAT_CHANNEL = { id: 'chat-1', name: 'General Chat' };

const AVAILABLE_EMAIL_CHANNELS = [
  { id: 'email-1', name: 'Support Email' },
  { id: 'email-2', name: 'Sales Email' },
  { id: 'email-3', name: 'Billing Email' },
];

const TeamChannelSelector = ({
  selectedChannels,
  onChannelSelect,
  selectedChatChannel,
  selectedEmailChannels,
  onChatChannelSelect,
  onEmailChannelToggle,
}: TeamChannelSelectorProps) => {
  return (
    <div className="space-y-6">
      {/* Selected Channels Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Selected Channels</h3>
        <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-4 bg-muted/30 rounded-lg">
          {selectedChatChannel && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20"
            >
              <span>Chat: {CHAT_CHANNEL.name}</span>
              <button 
                onClick={() => onChatChannelSelect(undefined)}
                className="hover:text-destructive transition-colors"
                aria-label="Remove chat channel"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedEmailChannels.map((channelId) => {
            const channel = AVAILABLE_EMAIL_CHANNELS.find(c => c.id === channelId);
            return (
              <Badge 
                key={channelId} 
                variant="secondary"
                className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20"
              >
                <span>Email: {channel?.name}</span>
                <button 
                  onClick={() => onEmailChannelToggle(channelId)}
                  className="hover:text-destructive transition-colors"
                  aria-label="Remove email channel"
                >
                  ×
                </button>
              </Badge>
            );
          })}
          {selectedEmailChannels.length === 0 && !selectedChatChannel && (
            <p className="text-sm text-muted-foreground">
              No channels selected (team will have access to all channels)
            </p>
          )}
        </div>
      </div>

      {/* Add Channels Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Add Channels</h3>
        <div className="space-y-4">
          {!selectedChatChannel && (
            <Card className="p-4 hover:bg-accent/50 transition-colors">
              <Button
                variant="outline"
                size="sm"
                className="gap-1 w-full justify-start border-dashed"
                onClick={() => onChatChannelSelect(CHAT_CHANNEL.id)}
              >
                <Plus className="h-4 w-4" />
                Add Chat Channel
              </Button>
            </Card>
          )}
          
          <Card className="p-4">
            <div className="mb-2">
              <h4 className="text-sm font-medium">Email Channels</h4>
              <p className="text-sm text-muted-foreground mb-3">Select multiple email channels for the team</p>
            </div>
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-2">
                {AVAILABLE_EMAIL_CHANNELS.map((channel) => {
                  const isSelected = selectedEmailChannels.includes(channel.id);
                  if (!isSelected) {
                    return (
                      <Button
                        key={channel.id}
                        variant="outline"
                        size="sm"
                        className="gap-1 w-full justify-start border-dashed"
                        onClick={() => onEmailChannelToggle(channel.id)}
                      >
                        <Plus className="h-4 w-4" />
                        {channel.name}
                      </Button>
                    );
                  }
                  return null;
                })}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeamChannelSelector;
