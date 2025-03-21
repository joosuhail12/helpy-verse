import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { EmailChannel } from '@/types/emailChannel';
import { RootState } from '@/store/store';
import { emailChannelsService } from '@/api/services/emailChannels.service';

interface EmailChannelsState {
  channels: EmailChannel[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  defaultChannel: {
    email: string;
    isActive: boolean;
  };
  hasDomainVerified: boolean;
}

const initialState: EmailChannelsState = {
  channels: [],
  status: 'idle',
  error: null,
  defaultChannel: {
    email: "",
    isActive: false,
  },
  hasDomainVerified: false,
};

export const fetchChannels = createAsyncThunk(
  'emailChannels/fetchChannels',
  async () => {
    const response = await emailChannelsService.getAllEmailChannels();
    return response.data;
  }
);

export const createChannel = createAsyncThunk(
  'emailChannels/createChannel',
  async (channel: EmailChannel) => {
    const response = await emailChannelsService.createEmailChannel(channel);
    return response.data;
  }
);

export const updateChannel = createAsyncThunk(
  'emailChannels/updateChannel',
  async (channel: Partial<EmailChannel> & { id: string }) => {
    const response = await emailChannelsService.updateEmailChannel(channel.id, channel);
    return response.data;
  }
);

export const deleteChannel = createAsyncThunk(
  'emailChannels/deleteChannel',
  async (id: string) => {
    const response = await emailChannelsService.deleteEmailChannel(id);
    return response.data;
  }
);

export const toggleChannelStatus = createAsyncThunk(
  'emailChannels/toggleChannelStatus',
  async ({ id, isActive }: { id: string; isActive: boolean }) => {
    const response = await emailChannelsService.updateEmailChannel(id, { isActive });
    return response.data;
  }
);

export const toggleDefaultChannelStatus = createAsyncThunk(
  'emailChannels/toggleDefaultChannelStatus',
  async (isActive: boolean) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return isActive;
  }
);

export const bulkDeleteChannels = createAsyncThunk(
  'emailChannels/bulkDeleteChannels',
  async (ids: string[]) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return ids;
  }
);

export const bulkToggleStatus = createAsyncThunk(
  'emailChannels/bulkToggleStatus',
  async ({ ids, isActive }: { ids: string[]; isActive: boolean }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ids, isActive };
  }
);

const emailChannelsSlice = createSlice({
  name: 'emailChannels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.status = 'succeeded';

        // Find default channel and set it if exists
        const defaultChannel = action.payload.emailChannels.find((channel: EmailChannel) => channel.isDefault);
        if (defaultChannel) {
          state.defaultChannel = {
            email: defaultChannel.emailAddress,
            isActive: defaultChannel.isActive
          };
        }

        // Filter out default channel from channels array
        state.channels = action.payload.emailChannels
          .filter((channel: EmailChannel) => !channel.isDefault);

        state.hasDomainVerified = action.payload.doesUserHaveVerifiedDomain;
        // Automatically disable default channel if custom channels exist
        if (action.payload.emailChannels.length > 0 || action.payload.doesUserHaveVerifiedDomain) {
          state.defaultChannel.isActive = false;
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch channels';
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.channels.push(action.payload[0]);
        // Disable default channel when a custom channel is added
        state.defaultChannel.isActive = false;
      })
      .addCase(updateChannel.fulfilled, (state, action) => {
        const { id, ...updates } = action.payload;
        const index = state.channels.findIndex(channel => channel.id === id);
        if (index !== -1) {
          state.channels[index] = { ...state.channels[index], ...updates };
        }
        state.status = 'succeeded';
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        if (typeof action.payload === 'string') {
          // If the payload is a string (channel ID), filter it out
          state.channels = state.channels.filter(channel => channel.id !== action.payload);
        } else if (action.payload && typeof action.payload === 'object') {
          // If the payload is an object with success property, check the id
          const channelId = typeof action.payload === 'object' && 'id' in action.payload 
            ? action.payload.id 
            : '';
          state.channels = state.channels.filter(channel => channel.id !== channelId);
        }
        state.status = 'succeeded';
      })
      .addCase(toggleChannelStatus.fulfilled, (state, action) => {
        const index = state.channels.findIndex(c => c.id === action.payload[0].id);
        if (index !== -1) {
          state.channels = state.channels.map(channel =>
            channel.id === action.payload[0].id ? action.payload[0] : channel
          );
        }
      })
      .addCase(toggleDefaultChannelStatus.fulfilled, (state, action) => {
        state.defaultChannel.isActive = action.payload;
      })
      .addCase(bulkDeleteChannels.fulfilled, (state, action) => {
        state.channels = state.channels.filter(c => !action.payload.includes(c.id));
        // Re-enable default channel if no custom channels exist
        if (state.channels.length === 0) {
          state.defaultChannel.isActive = true;
        }
      })
      .addCase(bulkToggleStatus.fulfilled, (state, action) => {
        state.channels = state.channels.map(channel =>
          action.payload.ids.includes(channel.id)
            ? { ...channel, isActive: action.payload.isActive }
            : channel
        );
      });
  },
});

export default emailChannelsSlice.reducer;
