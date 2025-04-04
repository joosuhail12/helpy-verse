
import { RootState } from '../../store';

export const selectEmailChannels = (state: RootState) => state.emailChannels.channels || [];
export const selectEmailChannelsLoading = (state: RootState) => state.emailChannels.loading || false;
export const selectEmailChannelsError = (state: RootState) => state.emailChannels.error || null;
export const selectDefaultChannel = (state: RootState) => state.emailChannels.defaultChannel || null;
export const selectHasDomainVerified = (state: RootState) => state.emailChannels.hasDomainVerified || false;
