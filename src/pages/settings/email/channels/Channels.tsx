import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Mail, PlusCircle } from 'lucide-react';
import { ChannelList } from './components/ChannelList';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { DefaultEmailChannel } from './components/DefaultEmailChannel';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  fetchChannels,
  deleteChannel,
  toggleChannelStatus,
  toggleDefaultChannelStatus,
  bulkDeleteChannels,
  bulkToggleStatus,
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

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

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

  const handleBulkDelete = async () => {
    try {
      await dispatch(bulkDeleteChannels(selectedChannels)).unwrap();
      toast({
        title: "Channels deleted",
        description: `${selectedChannels.length} channels have been removed successfully.`,
      });
      setSelectedChannels([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the selected channels.",
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

  const handleBulkToggleStatus = async (isActive: boolean) => {
    try {
      await dispatch(bulkToggleStatus({ ids: selectedChannels, isActive })).unwrap();
      toast({
        title: isActive ? "Channels activated" : "Channels deactivated",
        description: `${selectedChannels.length} channels have been ${isActive ? 'activated' : 'deactivated'} successfully.`,
      });
      setSelectedChannels([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update channels status.",
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedChannels(channels.map(channel => channel.id));
    } else {
      setSelectedChannels([]);
    }
  };

  const handleSelectChannel = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedChannels(prev => [...prev, id]);
    } else {
      setSelectedChannels(prev => prev.filter(channelId => channelId !== id));
    }
  };

  const filteredAndSortedChannels = React.useMemo(() => {
    let filtered = channels.filter(channel => 
      channel.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.channelName.localeCompare(b.channelName);
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'status':
          comparison = Number(a.isActive) - Number(b.isActive);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [channels, searchQuery, sortBy, sortOrder]);

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

      <div className="space-y-4">
        {loading ? (
          <Card className="p-6">
            <LoadingState />
          </Card>
        ) : channels.length === 0 ? (
          <Card className="p-6">
            <EmptyState 
              onCreateClick={handleCreateClick}
              hasDomainVerified={hasDomainVerified}
            />
          </Card>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search channels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                />
              </div>
              <Select value={sortBy} onValueChange={(value: 'name' | 'date' | 'status') => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Channel Name</SelectItem>
                  <SelectItem value="date">Creation Date</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedChannels.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg animate-fadeSlideIn">
                <span className="text-sm font-medium">{selectedChannels.length} selected</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkToggleStatus(true)}
                  >
                    Activate Selected
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkToggleStatus(false)}
                  >
                    Deactivate Selected
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    Delete Selected
                  </Button>
                </div>
              </div>
            )}

            <Card className="overflow-hidden border-t-2 border-t-primary/10 shadow-sm">
              <ChannelList
                channels={filteredAndSortedChannels}
                selectedChannels={selectedChannels}
                onSelectAll={handleSelectAll}
                onSelectChannel={handleSelectChannel}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Channels;
