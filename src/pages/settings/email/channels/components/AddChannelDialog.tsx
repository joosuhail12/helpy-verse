
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
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddChannelDialogProps {
  onAddChannel: (channel: { email: string; type: 'sending' | 'receiving' | 'both'; isDefault: boolean }) => void;
  className?: string;
  variant?: 'default' | 'outline';
}

export function AddChannelDialog({ onAddChannel, className, variant = 'default' }: AddChannelDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [type, setType] = useState<'sending' | 'receiving' | 'both'>('both');
  const [isDefault, setIsDefault] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddChannel({ email, type, isDefault });
    setOpen(false);
    setEmail('');
    setType('both');
    setIsDefault(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className={cn("gap-2", className)}>
          <PlusCircle className="h-4 w-4" />
          Add Channel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Email Channel</DialogTitle>
            <DialogDescription>
              Add a new email channel for sending or receiving messages.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
              <Label htmlFor="type">Channel Type</Label>
              <Select value={type} onValueChange={(value: 'sending' | 'receiving' | 'both') => setType(value)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sending">Sending Only</SelectItem>
                  <SelectItem value="receiving">Receiving Only</SelectItem>
                  <SelectItem value="both">Sending & Receiving</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isDefault">Set as default channel</Label>
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
