import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectEmailChannels } from '@/store/slices/emailChannels/selectors';
import { 
  deleteChannel, 
  setDefaultChannel, 
  verifyChannel,
  updateChannel,
} from '@/store/slices/emailChannels/emailChannelsSlice';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { ChannelDetailHeader } from './components/detail/ChannelDetailHeader';
import { ChannelStatusBadges } from './components/detail/ChannelStatusBadges';
import { ChannelActions } from './components/detail/ChannelActions';
import { ChannelInfo } from './components/detail/ChannelInfo';
import { ChannelEmailSettings } from './components/detail/ChannelEmailSettings';
import { IconEmojiPicker } from './components/IconEmojiPicker';

const EmailChannelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const channels = useAppSelector(selectEmailChannels);
  const channel = channels.find((c) => c.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedChannel, setEditedChannel] = useState(channel);

  if (!channel) {
    return (
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Channel not found</h2>
          <p className="text-muted-foreground mt-2">The requested channel does not exist.</p>
          <Button onClick={() => navigate('/home/settings/email/channels')} className="mt-4">
            Back to Channels
          </Button>
        </div>
      </div>
    );
  }

  if (!editedChannel) return null;

  const handleDelete = async () => {
    try {
      await dispatch(deleteChannel(channel.id)).unwrap();
      toast({
        title: "Channel deleted",
        description: "The email channel has been successfully deleted.",
      });
      navigate('/home/settings/email/channels');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the channel.",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async () => {
    try {
      await dispatch(setDefaultChannel(channel.id)).unwrap();
      toast({
        title: "Default channel updated",
        description: "This channel has been set as the default channel.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set as default channel.",
        variant: "destructive",
      });
    }
  };

  const handleVerify = async () => {
    try {
      await dispatch(verifyChannel(channel.id)).unwrap();
      toast({
        title: "Verification initiated",
        description: "A verification email has been sent to your address.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate verification.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedChannel(channel);
  };

  const handleSave = async () => {
    try {
      await dispatch(updateChannel({
        ...editedChannel,
        id: channel.id,
      })).unwrap();
      setIsEditing(false);
      toast({
        title: "Channel updated",
        description: "The email channel has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the channel.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setEditedChannel(prev => ({
      ...prev!,
      [field]: value,
    }));
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setEditedChannel(prev => ({
      ...prev!,
      [setting]: value,
    }));
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ChannelDetailHeader />

      <Card className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <IconEmojiPicker
                  selectedEmoji={editedChannel.icon || null}
                  setSelectedEmoji={(emoji) => handleChange('icon', emoji || '')}
                />
              ) : (
                channel.icon && <div className="text-2xl">{channel.icon}</div>
              )}
              {isEditing ? (
                <Input
                  value={editedChannel.channelName}
                  onChange={(e) => handleChange('channelName', e.target.value)}
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
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleEdit}>Edit</Button>
              <ChannelActions
                isDefault={channel.isDefault}
                isVerified={channel.isVerified}
                onSetDefault={handleSetDefault}
                onVerify={handleVerify}
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>

        <div className="space-y-6 pt-4 border-t">
          {isEditing ? (
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sender Name</label>
                <Input
                  value={editedChannel.senderName}
                  onChange={(e) => handleChange('senderName', e.target.value)}
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
                  onChange={(e) => handleChange('autoBccEmail', e.target.value)}
                  placeholder="archive@company.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">No Reply Email (Optional)</label>
                <Input
                  value={editedChannel.noReplyEmail || ''}
                  onChange={(e) => handleChange('noReplyEmail', e.target.value)}
                  placeholder="no-reply@company.com"
                />
              </div>
            </div>
          ) : (
            <ChannelInfo
              senderName={channel.senderName}
              email={channel.email}
              autoBccEmail={channel.autoBccEmail}
              noReplyEmail={channel.noReplyEmail}
            />
          )}

          <div className="pt-6 border-t">
            <ChannelEmailSettings
              allowAgentConversations={editedChannel?.allowAgentConversations || false}
              useAgentNames={editedChannel?.useAgentNames || false}
              useOriginalSender={editedChannel?.useOriginalSender || false}
              onSettingChange={handleSettingChange}
              isEditing={isEditing}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmailChannelDetail;
