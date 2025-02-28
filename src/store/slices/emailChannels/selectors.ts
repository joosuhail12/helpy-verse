
import { RootState } from '../../store';

export const selectEmailChannels = (state: RootState) => state.emailChannels.channels;
export const selectEmailChannelsLoading = (state: RootState) => state.emailChannels.loading;
export const selectEmailChannelsError = (state: RootState) => state.emailChannels.error;
export const selectDefaultChannel = (state: RootState) => state.emailChannels.defaultChannel;
export const selectHasDomainVerified = (state: RootState) => state.emailChannels.hasDomainVerified;
