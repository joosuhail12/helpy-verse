
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { IconEmojiPicker } from '../IconEmojiPicker';
import { ChannelStatusBadges } from './ChannelStatusBadges';
import { ChannelActions } from './ChannelActions';
import type { EmailChannel } from '@/types/emailChannel';

interface ChannelHeaderSectionProps {
  channel: EmailChannel;
  editedChannel: EmailChannel;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onSetDefault: () => void;
  onVerify: () => void;
  onDelete: () => void;
  onChange: (field: string, value: string) => void;
}

export const ChannelHeaderSection: React.FC<ChannelHeaderSectionProps> = ({
  channel,
  editedChannel,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onSetDefault,
  onVerify,
  onDelete,
  onChange,
}) => {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <IconEmojiPicker
              selectedEmoji={editedChannel.icon || null}
              setSelectedEmoji={(emoji) => onChange('icon', emoji || '')}
            />
          ) : (
            channel.icon && <div className="text-2xl">{channel.icon}</div>
          )}
          {isEditing ? (
            <Input
              value={editedChannel.channelName}
              onChange={(e) => onChange('channelName', e.target.value)}
              className="max-w-xs"
            />
          ) : (
            <h2 className="text-xl font-semibold">{channel.channelName}</h2>
          )}
          <ChannelStatusBadges
            isDefault={channel.isDefault}
            isVerified={channel.isVerified}
          />
        </div>
        <p className="text-muted-foreground">
          Created on {format(new Date(channel.createdAt), 'MMM d, yyyy')}
          {channel.updatedAt && ` • Updated on ${format(new Date(channel.updatedAt), 'MMM d, yyyy')}`}
        </p>
      </div>
      {isEditing ? (
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>Edit</Button>
          <ChannelActions
            isDefault={channel.isDefault}
            isVerified={channel.isVerified}
            onSetDefault={onSetDefault}
            onVerify={onVerify}
            onDelete={onDelete}
          />
        </div>
      )}
    </div>
  );
};
