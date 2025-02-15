
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChannelList } from './components/ChannelList';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { DefaultEmailChannel } from './components/DefaultEmailChannel';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { ChannelHeader } from './components/ChannelHeader';
import { ChannelSearch } from './components/ChannelSearch';
import { BulkActions } from './components/BulkActions';
import { useChannelSort } from './hooks/useChannelSort';

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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update default channel status.",
        variant: "destructive",
      });
    }
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

  const filteredAndSortedChannels = useChannelSort(channels, searchQuery, sortBy, sortOrder);

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ChannelHeader hasDomainVerified={hasDomainVerified} />

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
              onCreateClick={() => {}}
              hasDomainVerified={hasDomainVerified}
            />
          </Card>
        ) : (
          <>
            <ChannelSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />

            <BulkActions
              selectedCount={selectedChannels.length}
              onBulkActivate={() => handleBulkToggleStatus(true)}
              onBulkDeactivate={() => handleBulkToggleStatus(false)}
              onBulkDelete={handleBulkDelete}
            />

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
