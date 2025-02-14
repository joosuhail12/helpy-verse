
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { AddChannelDialog } from './components/AddChannelDialog';
import { ChannelList } from './components/ChannelList';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { 
  fetchChannels, 
  createChannel, 
  verifyChannel, 
  deleteChannel, 
  setDefaultChannel 
} from '@/store/slices/emailChannels/emailChannelsSlice';
import { 
  selectEmailChannels, 
  selectEmailChannelsLoading 
} from '@/store/slices/emailChannels/selectors';
import type { CreateEmailChannelDto } from '@/types/emailChannel';

const Channels = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const channels = useAppSelector(selectEmailChannels);
  const loading = useAppSelector(selectEmailChannelsLoading);

  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);

  const handleAddChannel = async (channelData: CreateEmailChannelDto) => {
    try {
      await dispatch(createChannel(channelData)).unwrap();
      toast({
        title: "Channel added",
        description: "The email channel has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add the email channel.",
        variant: "destructive",
      });
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await dispatch(verifyChannel(id)).unwrap();
      toast({
        title: "Verification initiated",
        description: "A verification email has been sent.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate verification.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteChannel(id)).unwrap();
      toast({
        title: "Channel deleted",
        description: "The email channel has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the channel.",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await dispatch(setDefaultChannel(id)).unwrap();
      toast({
        title: "Default updated",
        description: "The default email channel has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update default channel.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Email Channels
            </h2>
            <p className="text-muted-foreground">
              Manage your email channels for sending and receiving messages
            </p>
          </div>
          <AddChannelDialog onAddChannel={handleAddChannel} />
        </div>
      </div>

      <Card className="overflow-hidden border-t-2 border-t-primary/10 shadow-sm">
        {loading ? (
          <div className="text-center py-16">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground/50 animate-pulse" />
            <h3 className="mt-4 text-lg font-semibold">Loading channels...</h3>
          </div>
        ) : channels.length === 0 ? (
          <div className="text-center py-16">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No email channels</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first email channel to start sending and receiving emails
            </p>
            <AddChannelDialog
              className="mt-6"
              variant="outline"
              onAddChannel={handleAddChannel}
            />
          </div>
        ) : (
          <ChannelList
            channels={channels}
            onVerify={handleVerify}
            onDelete={handleDelete}
            onSetDefault={handleSetDefault}
          />
        )}
      </Card>
    </div>
  );
};

export default Channels;
