
import React from 'react';
import { Card } from '@/components/ui/card';
import { ChannelList } from './components/ChannelList';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { DefaultEmailChannel } from './components/DefaultEmailChannel';
import { ChannelHeader } from './components/ChannelHeader';
import { ChannelSearch } from './components/ChannelSearch';
import { BulkActions } from './components/BulkActions';
import { useChannelManagement } from './hooks/useChannelManagement';

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

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ChannelHeader hasDomainVerified={hasDomainVerified} />

      <DefaultEmailChannel
        email={defaultChannel.email}
        isActive={defaultChannel.isActive}
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
            <ChannelSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <EmptyState
              onCreateClick={() => { }}
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
