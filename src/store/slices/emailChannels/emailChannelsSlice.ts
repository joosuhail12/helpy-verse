
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { emailChannelsService } from '@/api/services/emailChannels.service';
import { EmailChannel } from '@/types/emailChannel';

export interface EmailChannelsState {
  channels: EmailChannel[];
  defaultChannel: EmailChannel | null;
  hasDomainVerified: boolean;
  error: string | null;
  loading: boolean;
}

const initialState: EmailChannelsState = {
  channels: [],
  defaultChannel: null,
  hasDomainVerified: false,
  error: null,
  loading: false,
};

// Async Thunks
export const fetchEmailChannels = createAsyncThunk(
  'emailChannels/fetchAll',
  async () => {
    try {
      const response = await emailChannelsService.getEmailChannels();
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch email channels');
    }
  }
);

export const createEmailChannel = createAsyncThunk(
  'emailChannels/create',
  async (channelData: any) => {
    try {
      const response = await emailChannelsService.createEmailChannel(channelData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create email channel');
    }
  }
);

export const updateEmailChannel = createAsyncThunk(
  'emailChannels/update',
  async ({ channelId, updates }: { channelId: string; updates: Partial<EmailChannel> }) => {
    try {
      const response = await emailChannelsService.updateEmailChannel(channelId, updates);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update email channel');
    }
  }
);

export const deleteEmailChannel = createAsyncThunk(
  'emailChannels/delete',
  async (channelId: string) => {
    try {
      await emailChannelsService.deleteEmailChannel(channelId);
      return channelId;
    } catch (error) {
      throw new Error('Failed to delete email channel');
    }
  }
);

const emailChannelsSlice = createSlice({
  name: 'emailChannels',
  initialState,
  reducers: {
    resetEmailChannelsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Email Channels
      .addCase(fetchEmailChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmailChannels.fulfilled, (state, action) => {
        state.channels = action.payload as unknown as EmailChannel[];
        state.defaultChannel = state.channels.find(channel => channel.isDefault) || null;
        state.loading = false;
      })
      .addCase(fetchEmailChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch email channels';
      })
      // Create Email Channel
      .addCase(createEmailChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmailChannel.fulfilled, (state, action) => {
        state.channels.push(action.payload);
        if (action.payload.isDefault) {
          state.defaultChannel = action.payload;
        }
        state.loading = false;
      })
      .addCase(createEmailChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create email channel';
      })
      // Update Email Channel
      .addCase(updateEmailChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmailChannel.fulfilled, (state, action) => {
        const index = state.channels.findIndex(channel => channel.id === action.payload.id);
        if (index !== -1) {
          state.channels[index] = { ...state.channels[index], ...action.payload };
          if (action.payload.isDefault) {
            state.defaultChannel = state.channels[index];
          }
        }
        state.loading = false;
      })
      .addCase(updateEmailChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update email channel';
      })
      // Delete Email Channel
      .addCase(deleteEmailChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmailChannel.fulfilled, (state, action) => {
        state.channels = state.channels.filter(channel => channel.id !== action.payload);
        if (state.defaultChannel && state.defaultChannel.id === action.payload) {
          state.defaultChannel = null;
        }
        state.loading = false;
      })
      .addCase(deleteEmailChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete email channel';
      });
  },
});

export const { resetEmailChannelsState } = emailChannelsSlice.actions;
export default emailChannelsSlice.reducer;
