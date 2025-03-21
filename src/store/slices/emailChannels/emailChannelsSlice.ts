
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { EmailChannel } from '@/types/emailChannel';

export interface EmailChannelsState {
  channels: EmailChannel[];
  defaultChannel: EmailChannel | null;
  hasDomainVerified: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: EmailChannelsState = {
  channels: [],
  defaultChannel: null,
  hasDomainVerified: false,
  loading: false,
  error: null,
};

// Async thunks
export const fetchChannels = createAsyncThunk(
  'emailChannels/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/email/channels');
      if (!response.ok) {
        throw new Error('Failed to fetch channels');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createChannel = createAsyncThunk(
  'emailChannels/createChannel',
  async (channel: Omit<EmailChannel, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/email/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(channel),
      });
      if (!response.ok) {
        throw new Error('Failed to create channel');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateChannel = createAsyncThunk(
  'emailChannels/updateChannel',
  async ({ id, updates }: { id: string; updates: Partial<EmailChannel> }, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/email/channels/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update channel');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteChannel = createAsyncThunk(
  'emailChannels/deleteChannel',
  async (id: string, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/email/channels/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete channel');
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleChannelStatus = createAsyncThunk(
  'emailChannels/toggleChannelStatus',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const channel = state.emailChannels.channels.find(c => c.id === id);
      if (!channel) {
        throw new Error('Channel not found');
      }
      
      // Replace with actual API call
      const response = await fetch(`/api/email/channels/${id}/toggle-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !channel.isActive }),
      });
      if (!response.ok) {
        throw new Error('Failed to toggle channel status');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleDefaultChannelStatus = createAsyncThunk(
  'emailChannels/toggleDefaultChannelStatus',
  async (id: string, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/email/channels/${id}/set-default`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to set default channel');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const bulkDeleteChannels = createAsyncThunk(
  'emailChannels/bulkDeleteChannels',
  async (ids: string[], { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/email/channels/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete channels');
      }
      return ids;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const bulkToggleStatus = createAsyncThunk(
  'emailChannels/bulkToggleStatus',
  async ({ ids, isActive }: { ids: string[]; isActive: boolean }, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/email/channels/bulk-toggle-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, isActive }),
      });
      if (!response.ok) {
        throw new Error('Failed to update channels status');
      }
      return { ids, isActive };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const emailChannelsSlice = createSlice({
  name: 'emailChannels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch channels
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload.channels;
        state.defaultChannel = action.payload.defaultChannel;
        state.hasDomainVerified = action.payload.hasDomainVerified;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create channel
      .addCase(createChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.channels.push(action.payload);
        if (action.payload.isDefault) {
          state.defaultChannel = action.payload;
        }
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update channel
      .addCase(updateChannel.fulfilled, (state, action) => {
        const index = state.channels.findIndex(channel => channel.id === action.payload.id);
        if (index !== -1) {
          state.channels[index] = action.payload;
        }
        if (action.payload.isDefault) {
          state.defaultChannel = action.payload;
        }
      })
      // Delete channel
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.channels = state.channels.filter(channel => channel.id !== action.payload);
        if (state.defaultChannel && state.defaultChannel.id === action.payload) {
          state.defaultChannel = null;
        }
      })
      // Toggle channel status
      .addCase(toggleChannelStatus.fulfilled, (state, action) => {
        const index = state.channels.findIndex(channel => channel.id === action.payload.id);
        if (index !== -1) {
          state.channels[index] = action.payload;
        }
      })
      // Toggle default channel status
      .addCase(toggleDefaultChannelStatus.fulfilled, (state, action) => {
        state.channels = state.channels.map(channel => ({
          ...channel,
          isDefault: channel.id === action.payload.id
        }));
        state.defaultChannel = action.payload;
      })
      // Bulk delete channels
      .addCase(bulkDeleteChannels.fulfilled, (state, action) => {
        state.channels = state.channels.filter(channel => !action.payload.includes(channel.id));
        if (state.defaultChannel && action.payload.includes(state.defaultChannel.id)) {
          state.defaultChannel = null;
        }
      })
      // Bulk toggle status
      .addCase(bulkToggleStatus.fulfilled, (state, action) => {
        const { ids, isActive } = action.payload;
        state.channels = state.channels.map(channel => 
          ids.includes(channel.id) ? { ...channel, isActive } : channel
        );
      });
  },
});

export const emailChannelsReducer = emailChannelsSlice.reducer;
