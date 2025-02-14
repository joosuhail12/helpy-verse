
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
import { icons } from './IconSelection';

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
  const [channelName, setChannelName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [email, setEmail] = useState('');
  const [autoBccEmail, setAutoBccEmail] = useState('');
  const [noReplyEmail, setNoReplyEmail] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<typeof icons[0] | null>(null);
  const [type] = useState<'sending' | 'receiving' | 'both'>('both');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddChannel({
      channelName,
      senderName,
      email,
      autoBccEmail,
      noReplyEmail,
      icon: selectedIcon ? selectedIcon.label : undefined,
      type,
      isDefault: false,
    });
    setOpen(false);
    // Reset form
    setChannelName('');
    setSenderName('');
    setEmail('');
    setAutoBccEmail('');
    setNoReplyEmail('');
    setSelectedIcon(null);
  };

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
