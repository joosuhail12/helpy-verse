
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectEmailChannels } from '@/store/slices/emailChannels/selectors';
import { deleteChannel, setDefaultChannel, verifyChannel } from '@/store/slices/emailChannels/emailChannelsSlice';
import { format } from 'date-fns';
import { ChannelDetailHeader } from './components/detail/ChannelDetailHeader';
import { ChannelStatusBadges } from './components/detail/ChannelStatusBadges';
import { ChannelActions } from './components/detail/ChannelActions';
import { ChannelInfo } from './components/detail/ChannelInfo';

const EmailChannelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const channels = useAppSelector(selectEmailChannels);
  const channel = channels.find((c) => c.id === id);

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

  return (
    <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ChannelDetailHeader />

      <Card className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {channel.icon && <div className="text-2xl">{channel.icon}</div>}
              <h2 className="text-xl font-semibold">{channel.channelName}</h2>
              <ChannelStatusBadges
                isDefault={channel.isDefault}
                isVerified={channel.isVerified}
              />
            </div>
            <p className="text-muted-foreground">
              Created on {format(new Date(channel.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
          <ChannelActions
            isDefault={channel.isDefault}
            isVerified={channel.isVerified}
            onSetDefault={handleSetDefault}
            onVerify={handleVerify}
            onDelete={handleDelete}
          />
        </div>

        <div className="space-y-6 pt-4 border-t">
          <ChannelInfo
            senderName={channel.senderName}
            email={channel.email}
            autoBccEmail={channel.autoBccEmail}
            noReplyEmail={channel.noReplyEmail}
          />
        </div>
      </Card>
    </div>
  );
};

export default EmailChannelDetail;

