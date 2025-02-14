
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Mail, MessageCircle, MessageSquare, Envelope, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

const icons = [
  { icon: Mail, label: 'Mail' },
  { icon: MessageCircle, label: 'Message Circle' },
  { icon: MessageSquare, label: 'Message Square' },
  { icon: Envelope, label: 'Envelope' },
];

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
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="channelName">Channel Name</Label>
              <Input
                id="channelName"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="Support Channel"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="senderName">Email Sender Name</Label>
              <Input
                id="senderName"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Support Team"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="support@company.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="autoBccEmail">Auto BCC Email (Optional)</Label>
              <Input
                id="autoBccEmail"
                type="email"
                value={autoBccEmail}
                onChange={(e) => setAutoBccEmail(e.target.value)}
                placeholder="archive@company.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="noReplyEmail">No Reply Email (Optional)</Label>
              <Input
                id="noReplyEmail"
                type="email"
                value={noReplyEmail}
                onChange={(e) => setNoReplyEmail(e.target.value)}
                placeholder="no-reply@company.com"
              />
            </div>
            <div className="grid gap-2">
              <Label>Channel Icon</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start gap-2",
                      !selectedIcon && "text-muted-foreground"
                    )}
                  >
                    {selectedIcon ? (
                      <>
                        {<selectedIcon.icon className="h-4 w-4" />}
                        {selectedIcon.label}
                      </>
                    ) : (
                      "Select an icon..."
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  {icons.map((icon) => (
                    <DropdownMenuItem
                      key={icon.label}
                      onClick={() => setSelectedIcon(icon)}
                      className="gap-2"
                    >
                      <icon.icon className="h-4 w-4" />
                      {icon.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Channel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
