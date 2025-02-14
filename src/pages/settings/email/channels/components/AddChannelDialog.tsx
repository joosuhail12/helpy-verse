
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChannelFormFields } from './ChannelFormFields';
import { useChannelForm } from '../hooks/useChannelForm';

interface AddChannelDialogProps {
  onAddChannel: (channel: {
    channelName: string;
    senderName: string;
    email: string;
    autoBccEmail?: string;
    noReplyEmail?: string;
    icon?: string;
    type: 'sending' | 'receiving' | 'both';
    isDefault: boolean;
  }) => void;
  className?: string;
  variant?: 'default' | 'outline';
}

export function AddChannelDialog({ onAddChannel, className, variant = 'default' }: AddChannelDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    channelName,
    setChannelName,
    senderName,
    setSenderName,
    email,
    setEmail,
    autoBccEmail,
    setAutoBccEmail,
    noReplyEmail,
    setNoReplyEmail,
    selectedIcon,
    setSelectedIcon,
    handleSubmit,
  } = useChannelForm({
    onAddChannel: (channel) => {
      onAddChannel(channel);
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className={cn("gap-2", className)}>
          <PlusCircle className="h-4 w-4" />
          Add Custom Channel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Custom Email Channel</DialogTitle>
            <DialogDescription>
              Add a new email channel for sending or receiving messages.
            </DialogDescription>
          </DialogHeader>
          <ChannelFormFields
            channelName={channelName}
            setChannelName={setChannelName}
            senderName={senderName}
            setSenderName={setSenderName}
            email={email}
            setEmail={setEmail}
            autoBccEmail={autoBccEmail}
            setAutoBccEmail={setAutoBccEmail}
            noReplyEmail={noReplyEmail}
            setNoReplyEmail={setNoReplyEmail}
            selectedIcon={selectedIcon}
            setSelectedIcon={setSelectedIcon}
          />
          <DialogFooter>
            <Button type="submit">Add Channel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
