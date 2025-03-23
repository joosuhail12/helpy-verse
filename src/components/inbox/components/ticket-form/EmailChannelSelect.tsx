
import { useState } from 'react';
import { Check, ChevronsUpDown, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { EmailChannel } from '@/types/emailChannel';

interface EmailChannelSelectProps {
  channels: EmailChannel[];
  selectedChannel: EmailChannel | null;
  onSelectChannel: (channel: EmailChannel | null) => void;
}

const EmailChannelSelect = ({ channels, selectedChannel, onSelectChannel }: EmailChannelSelectProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedChannel ? (
            <div className="flex items-center gap-2 text-left">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{selectedChannel.name}</p>
                <p className="text-xs text-muted-foreground">{selectedChannel.email}</p>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">Select email channel</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search email channels..." />
          <CommandEmpty>No email channel found.</CommandEmpty>
          <CommandGroup>
            {channels.map((channel) => (
              <CommandItem
                key={channel.id}
                value={channel.name}
                onSelect={() => {
                  onSelectChannel(channel);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedChannel?.id === channel.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{channel.name}</span>
                  <span className="text-xs text-muted-foreground">{channel.email}</span>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  {channel.type === 'inbound' && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                      Receiving
                    </span>
                  )}
                  {channel.type === 'outbound' && (
                    <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                      Sending
                    </span>
                  )}
                  {channel.type === 'both' && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                      Both
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default EmailChannelSelect;
