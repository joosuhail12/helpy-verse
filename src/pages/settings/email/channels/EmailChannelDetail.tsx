
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectEmailChannels } from '@/store/slices/emailChannels/selectors';
import { ChannelDetailHeader } from './components/detail/ChannelDetailHeader';
import { ChannelHeaderSection } from './components/detail/ChannelHeaderSection';
import { ChannelInfo } from './components/detail/ChannelInfo';
import { ChannelEmailSettings } from './components/detail/ChannelEmailSettings';
import { ChannelEditForm } from './components/detail/ChannelEditForm';
import { useChannelOperations } from './hooks/useChannelOperations';

const EmailChannelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const channels = useAppSelector(selectEmailChannels);
  const channel = channels.find((c) => c.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedChannel, setEditedChannel] = useState(channel);

  const { handleDelete, handleUpdate } = useChannelOperations(channel!);

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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedChannel(channel);
  };

  const handleSave = async () => {
    const success = await handleUpdate(editedChannel);
    if (success) {
      setIsEditing(false);
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
        <ChannelHeaderSection
          channel={channel}
          editedChannel={editedChannel}
          isEditing={isEditing}
          onEdit={handleEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          onDelete={handleDelete}
          onChange={handleChange}
        />

        <div className="space-y-6 pt-4 border-t">
          {isEditing ? (
            <ChannelEditForm
              editedChannel={editedChannel}
              onChange={handleChange}
            />
          ) : (
            <ChannelInfo
              senderName={channel.senderName}
              email={channel.emailAddress}
              autoBccEmail={channel.autoBccMail}
              noReplyEmail={channel.noReplyMail}
            />
          )}

          <div className="pt-6 border-t">
            <ChannelEmailSettings
              allowAgentConversations={editedChannel?.allowAgentOutbound || false}
              useAgentNames={editedChannel?.allowAgentName || false}
              useOriginalSender={editedChannel?.orignalSenderAsRequester || false}
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
