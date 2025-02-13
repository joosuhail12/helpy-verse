
import React from 'react';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TeamChannelSelectorProps } from '@/types/team';

// Mock data - in production this would come from your Node.js backend
const CHAT_CHANNEL = { id: 'chat-1', name: 'General Chat' };

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
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {selectedChatChannel && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-2"
            >
              <span>Chat: {CHAT_CHANNEL.name}</span>
              <button 
                onClick={() => onChatChannelSelect(undefined)}
                className="hover:text-destructive"
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
                className="flex items-center gap-2"
              >
                <span>Email: {channel?.name}</span>
                <button 
                  onClick={() => onEmailChannelToggle(channelId)}
                  className="hover:text-destructive"
                  aria-label="Remove email channel"
                >
                  ×
                </button>
              </Badge>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          {!selectedChatChannel && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => onChatChannelSelect(CHAT_CHANNEL.id)}
            >
              <Plus className="h-4 w-4" />
              Add Chat Channel
            </Button>
          )}
          
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <div className="space-y-2">
              {AVAILABLE_EMAIL_CHANNELS.map((channel) => {
                const isSelected = selectedEmailChannels.includes(channel.id);
                if (!isSelected) {
                  return (
                    <Button
                      key={channel.id}
                      variant="outline"
                      size="sm"
                      className="gap-1 w-full justify-start"
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
        </div>
      </div>

      {selectedEmailChannels.length === 0 && !selectedChatChannel && (
        <p className="text-sm text-muted-foreground">
          No channels selected (team will have access to all channels)
        </p>
      )}
    </div>
  );
};

export default TeamChannelSelector;
