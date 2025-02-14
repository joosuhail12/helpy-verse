
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconEmojiPicker } from './IconEmojiPicker';
import type { icons } from './IconSelection';

interface ChannelFormFieldsProps {
  channelName: string;
  setChannelName: (value: string) => void;
  senderName: string;
  setSenderName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  autoBccEmail: string;
  setAutoBccEmail: (value: string) => void;
  noReplyEmail: string;
  setNoReplyEmail: (value: string) => void;
  selectedIcon: typeof icons[0] | null;
  setSelectedIcon: (icon: typeof icons[0] | null) => void;
  selectedEmoji: string | null;
  setSelectedEmoji: (emoji: string | null) => void;
}

export function ChannelFormFields({
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
  selectedEmoji,
  setSelectedEmoji,
}: ChannelFormFieldsProps) {
  return (
    <div className="grid gap-4">
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
        <IconEmojiPicker
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
          selectedEmoji={selectedEmoji}
          setSelectedEmoji={setSelectedEmoji}
        />
      </div>
    </div>
  );
}
