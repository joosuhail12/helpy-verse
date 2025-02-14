
import { RootState } from '@/store/store';

export const selectEmailChannels = (state: RootState) => state.emailChannels.channels;
export const selectEmailChannelsLoading = (state: RootState) => state.emailChannels.loading;
export const selectEmailChannelsError = (state: RootState) => state.emailChannels.error;
