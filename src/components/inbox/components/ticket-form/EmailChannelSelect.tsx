import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Verified, Mail, AlertCircle } from 'lucide-react';
import { mockEmailChannels } from '@/mock/emailChannels';
import type { EmailChannel } from '@/types/emailChannel';

interface EmailChannelSelectProps {
  emailChannel: EmailChannel | null;
  onEmailChannelChange: (emailChannel: EmailChannel | null) => void;
}

const EmailChannelSelect = ({ emailChannel, onEmailChannelChange }: EmailChannelSelectProps) => {
  const [channels, setChannels] = useState<EmailChannel[]>([]);

  useEffect(() => {
    // Simulate fetching email channels from an API
    // In a real application, you would replace this with an actual API call
    const fetchChannels = async () => {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setChannels(mockEmailChannels);
    };

    fetchChannels();
  }, []);

  const handleChannelChange = (value: string) => {
    const selectedChannel = channels.find(channel => channel.id === value) || null;
    onEmailChannelChange(selectedChannel);
  };

  const getChannelDescription = (channel: EmailChannel) => {
    if (channel.type === 'outbound') {
      return `Sending from ${channel.email}`;
    } else if (channel.type === 'inbound') {
      return `Receiving at ${channel.email}`;
    } else {
      return `Sending & Receiving at ${channel.email}`;
    }
  };

  const getChannelTypeLabel = (channel: EmailChannel) => {
    if (channel.type === 'outbound') {
      return <span className="text-blue-500">Sending Only</span>;
    } else if (channel.type === 'inbound') {
      return <span className="text-green-500">Receiving Only</span>;
    } else {
      return <span className="text-purple-500">Sending & Receiving</span>;
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="emailChannel">Email Channel</Label>
      <Select onValueChange={handleChannelChange} defaultValue={emailChannel?.id}>
        <SelectTrigger id="emailChannel">
          <SelectValue placeholder="Select an email channel" />
        </SelectTrigger>
        <SelectContent>
          {channels.map((channel) => (
            <SelectItem key={channel.id} value={channel.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-center w-5 h-5 mr-2 text-xl">
                          {channel.icon || <Mail />}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="text-left">
                        <p>{channel.channelName}</p>
                        <p className="text-xs text-muted-foreground">{getChannelDescription(channel)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span>{channel.channelName}</span>
                </div>
                <div className="flex items-center">
                  {channel.isVerified ? (
                    <Verified className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          This channel is not verified. Please verify to ensure proper functionality.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {getChannelTypeLabel(channel)}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EmailChannelSelect;
