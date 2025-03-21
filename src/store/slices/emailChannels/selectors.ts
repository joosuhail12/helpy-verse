
import { RootState } from '@/store/store';
import { EmailChannel } from '@/types/emailChannel';
import { createSelector } from '@reduxjs/toolkit';

export const selectEmailChannels = (state: RootState) => state.emailChannels.channels;
export const selectEmailChannelsLoading = (state: RootState) => state.emailChannels.loading;
export const selectDefaultChannel = (state: RootState) => state.emailChannels.defaultChannel;
export const selectHasDomainVerified = (state: RootState) => state.emailChannels.hasDomainVerified;

export const selectActiveEmailChannels = createSelector(
  [selectEmailChannels],
  (channels) => channels.filter(channel => channel.isActive)
);

export const selectSendingEmailChannels = createSelector(
  [selectEmailChannels],
  (channels) => channels.filter(channel => channel.type === 'sending' || channel.type === 'both')
);

export const selectChannelById = (channelId: string) => 
  createSelector(
    [selectEmailChannels], 
    (channels) => channels.find(channel => channel.id === channelId)
  );
