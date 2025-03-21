
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useToast } from '@/hooks/use-toast';
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
import { useAppSelector } from '@/hooks/useAppSelector';
import { useChannelSort } from './useChannelSort';

export const useChannelManagement = () => {
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

  return {
    channels,
    loading,
    defaultChannel,
    hasDomainVerified,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedChannels,
    handleDelete,
    handleBulkDelete,
    handleToggleStatus,
    handleBulkToggleStatus,
    handleToggleDefaultChannel,
    handleSelectAll,
    handleSelectChannel,
    filteredAndSortedChannels,
  };
};
