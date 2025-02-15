
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, Mail, Star, Trash2, User, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectEmailChannels } from '@/store/slices/emailChannels/selectors';
import { deleteChannel, setDefaultChannel, verifyChannel } from '@/store/slices/emailChannels/emailChannelsSlice';
import { format } from 'date-fns';

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

  const handleBack = () => {
    navigate('/home/settings/email/channels');
  };

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
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Email Channel Details</h1>
          <p className="text-muted-foreground">
            View and manage channel settings
          </p>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {channel.icon && <div className="text-2xl">{channel.icon}</div>}
              <h2 className="text-xl font-semibold">{channel.channelName}</h2>
              <div className="flex gap-2">
                {channel.isDefault && (
                  <Badge variant="secondary" className="text-primary">
                    Default
                  </Badge>
                )}
                <Badge
                  variant={channel.isVerified ? "default" : "destructive"}
                  className="gap-1"
                >
                  {channel.isVerified ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {channel.isVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </div>
            <p className="text-muted-foreground">
              Created on {format(new Date(channel.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
          <div className="flex gap-2">
            {!channel.isDefault && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSetDefault}
                className="gap-1"
              >
                <Star className="h-4 w-4" />
                Set as Default
              </Button>
            )}
            {!channel.isVerified && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleVerify}
                className="gap-1"
              >
                <CheckCircle2 className="h-4 w-4" />
                Verify
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="space-y-6 pt-4 border-t">
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sender Name</label>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                {channel.senderName}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {channel.email}
              </div>
            </div>

            {channel.autoBccEmail && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Auto BCC</label>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {channel.autoBccEmail}
                </div>
              </div>
            )}

            {channel.noReplyEmail && (
              <div className="space-y-2">
                <label className="text-sm font-medium">No Reply Address</label>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {channel.noReplyEmail}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmailChannelDetail;
