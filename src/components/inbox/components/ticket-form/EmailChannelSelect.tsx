
import { useState, useEffect } from 'react';
import { Check, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchChannels } from '@/store/slices/emailChannels/emailChannelsSlice';
import { selectEmailChannels, selectEmailChannelsLoading } from '@/store/slices/emailChannels/selectors';
import { cn } from "@/lib/utils";
import type { EmailChannel } from '@/types/emailChannel';
import { mockEmailChannels } from '@/mock/emailChannels';

interface EmailChannelSelectProps {
  value: EmailChannel | null;
  onChange: (value: EmailChannel | null) => void;
}

const EmailChannelSelect = ({ value, onChange }: EmailChannelSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dispatch = useAppDispatch();
  
  // Fetch email channels from Redux store
  const channels = useAppSelector(selectEmailChannels);
  const isLoading = useAppSelector(selectEmailChannelsLoading);
  
  // Filter only 'sending' and 'both' type channels for outbound messages
  const outboundChannels = channels.filter(
    channel => channel.type === 'sending' || channel.type === 'both'
  );
  
  useEffect(() => {
    // Try to fetch channels from API
    dispatch(fetchChannels());
    
    // If we have no channels, use mock data (this is temporary until the API works)
    if (channels.length === 0 && !isLoading) {
      console.log('Using mock email channels data');
    }
  }, [dispatch]);
  
  // If we have no real data, use the mock data
  const availableChannels = outboundChannels.length > 0 
    ? outboundChannels 
    : mockEmailChannels.filter(
        channel => channel.type === 'sending' || channel.type === 'both'
      );
  
  const handleSelect = (channelId: string) => {
    const selectedChannel = availableChannels.find(c => c.id === channelId);
    onChange(selectedChannel || null);
    setOpen(false);
  };
  
  // Filter channels based on search query
  const filteredChannels = availableChannels.filter(channel =>
    channel.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Label htmlFor="emailChannel">Email Channel</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            onClick={() => setOpen(!open)}
          >
            {value ? (
              <span className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                {value.channelName} ({value.email})
              </span>
            ) : (
              "Select email channel..."
            )}
            <Mail className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Search channels..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
              autoFocus
            />
            <CommandList>
              <CommandEmpty>No email channels found</CommandEmpty>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  Loading channels...
                </div>
              ) : (
                <CommandGroup heading="Email Channels">
                  {filteredChannels.map((channel) => (
                    <CommandItem
                      key={channel.id}
                      value={channel.id}
                      onSelect={() => handleSelect(channel.id)}
                      className="flex justify-between cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{channel.channelName}</span>
                        <span className="text-xs text-muted-foreground">{channel.email}</span>
                      </div>
                      {value?.id === channel.id && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value?.type === 'receiving' && (
        <p className="text-sm text-destructive">
          This channel is set for receiving only. Outbound messages will not be sent.
        </p>
      )}
    </div>
  );
};

export default EmailChannelSelect;
