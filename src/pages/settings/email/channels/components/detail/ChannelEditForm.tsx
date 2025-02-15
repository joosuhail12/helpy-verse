
import React from 'react';
import { Input } from '@/components/ui/input';
import { IconEmojiPicker } from '../IconEmojiPicker';
import type { EmailChannel } from '@/types/emailChannel';

interface ChannelEditFormProps {
  editedChannel: EmailChannel;
  onChange: (field: string, value: string) => void;
}

export const ChannelEditForm: React.FC<ChannelEditFormProps> = ({
  editedChannel,
  onChange,
}) => {
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Sender Name</label>
        <Input
          value={editedChannel.senderName}
          onChange={(e) => onChange('senderName', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email Address</label>
        <Input
          value={editedChannel.email}
          disabled
          className="bg-muted"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Auto BCC Email (Optional)</label>
        <Input
          value={editedChannel.autoBccEmail || ''}
          onChange={(e) => onChange('autoBccEmail', e.target.value)}
          placeholder="archive@company.com"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">No Reply Email (Optional)</label>
        <Input
          value={editedChannel.noReplyEmail || ''}
          onChange={(e) => onChange('noReplyEmail', e.target.value)}
          placeholder="no-reply@company.com"
        />
      </div>
    </div>
  );
};
