
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Mail, PlusCircle } from 'lucide-react';
import { ChannelList } from './components/ChannelList';
import { DefaultEmailChannel } from './components/DefaultEmailChannel';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  fetchChannels,
  deleteChannel,
  toggleChannelStatus,
  toggleDefaultChannelStatus,
} from '@/store/slices/emailChannels/emailChannelsSlice';
import { 
  selectEmailChannels, 
  selectEmailChannelsLoading,
  selectDefaultChannel,
  selectHasDomainVerified,
} from '@/store/slices/emailChannels/selectors';

const Channels = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const channels = useAppSelector(selectEmailChannels);
  const loading = useAppSelector(selectEmailChannelsLoading);
  const defaultChannel = useAppSelector(selectDefaultChannel);
  const hasDomainVerified = useAppSelector(selectHasDomainVerified);

  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);

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

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await dispatch(toggleChannelStatus({ id, isActive })).unwrap();
      toast({
        title: isActive ? "Channel activated" : "Channel deactivated",
        description: `The email channel has been ${isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update channel status.",
        variant: "destructive",
      });
    }
  };

  const handleToggleDefaultChannel = async (isActive: boolean) => {
    try {
      await dispatch(toggleDefaultChannelStatus(isActive)).unwrap();
      toast({
        title: isActive ? "Default channel activated" : "Default channel deactivated",
        description: `The default email channel has been ${isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update default channel status.",
        variant: "destructive",
      });
    }
  };

  const handleCreateClick = () => {
    if (!hasDomainVerified) {
      toast({
        title: "Domain verification required",
        description: "Please verify a domain before adding custom email channels.",
        variant: "destructive",
      });
      return;
    }
    navigate('create');
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
          <Button onClick={handleCreateClick} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Custom Channel
          </Button>
        </div>
      </div>

      <DefaultEmailChannel
        email={defaultChannel.email}
        isActive={defaultChannel.isActive}
        onToggle={handleToggleDefaultChannel}
        disabled={channels.length > 0}
      />

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
            <Button
              className="mt-6 gap-2"
              variant="outline"
              onClick={handleCreateClick}
            >
              <PlusCircle className="h-4 w-4" />
              Add Custom Channel
            </Button>
          </div>
        ) : (
          <ChannelList
            channels={channels}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </Card>
    </div>
  );
};

export default Channels;
