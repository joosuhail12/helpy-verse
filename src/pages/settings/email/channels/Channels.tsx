
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChannelList } from './components/ChannelList';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { DefaultEmailChannel } from './components/DefaultEmailChannel';
import { ChannelHeader } from './components/ChannelHeader';
import { ChannelSearch } from './components/ChannelSearch';
import { BulkActions } from './components/BulkActions';
import { useChannelManagement } from './hooks/useChannelManagement';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmailChannel } from '@/types/emailChannel';

const Channels = () => {
  const {
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
  } = useChannelManagement();

  const navigate = useNavigate();
  const [channelToDelete, setChannelToDelete] = useState<EmailChannel | null>(null);

  const handleSetDefault = (id: string) => {
    // This function would call the handleToggleDefaultChannel function or something similar
    if (defaultChannel) {
      handleToggleDefaultChannel(true);
    }
  };

  const renderActionOptions = (channel: EmailChannel) => {
    const isDefault = defaultChannel && channel.id === defaultChannel.id;
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate(`/home/settings/email/channels/${channel.id}`)}>
            Edit
          </DropdownMenuItem>
          {!isDefault && (
            <DropdownMenuItem onClick={() => handleSetDefault(channel.id)}>
              Set as Default
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => handleToggleStatus(channel.id)}>
            {channel.isActive ? 'Disable' : 'Enable'}
          </DropdownMenuItem>
          {!isDefault && (
            <DropdownMenuItem onClick={() => setChannelToDelete(channel)}>
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ChannelHeader hasDomainVerified={hasDomainVerified} />

      <DefaultEmailChannel
        email={defaultChannel ? defaultChannel.email : 'default@example.com'}
        isActive={defaultChannel ? defaultChannel.isActive : false}
        onToggle={handleToggleDefaultChannel}
        disabled={filteredAndSortedChannels.length > 0}
      />

      <div className="space-y-4">
        {loading ? (
          <Card className="p-6">
            <LoadingState />
          </Card>
        ) : filteredAndSortedChannels.length === 0 ? (
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
