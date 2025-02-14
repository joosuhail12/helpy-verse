
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { EmailChannel, CreateEmailChannelDto } from '@/types/emailChannel';
import { mockEmailChannels } from '@/mock/emailChannels';

interface EmailChannelsState {
  channels: EmailChannel[];
  loading: boolean;
  error: string | null;
}

const initialState: EmailChannelsState = {
  channels: [],
  loading: false,
  error: null,
};

export const fetchChannels = createAsyncThunk(
  'emailChannels/fetchChannels',
  async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockEmailChannels;
  }
);

export const createChannel = createAsyncThunk(
  'emailChannels/createChannel',
  async (channel: CreateEmailChannelDto) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newChannel: EmailChannel = {
      ...channel,
      id: Math.random().toString(),
      isVerified: false,
      createdAt: new Date().toISOString(),
    };
    
    return newChannel;
  }
);

export const verifyChannel = createAsyncThunk(
  'emailChannels/verifyChannel',
  async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return id;
  }
);

export const deleteChannel = createAsyncThunk(
  'emailChannels/deleteChannel',
  async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return id;
  }
);

export const setDefaultChannel = createAsyncThunk(
  'emailChannels/setDefaultChannel',
  async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return id;
  }
);

const emailChannelsSlice = createSlice({
  name: 'emailChannels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch channels';
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.channels.push(action.payload);
      })
      .addCase(verifyChannel.fulfilled, (state, action) => {
        const channel = state.channels.find(c => c.id === action.payload);
        if (channel) {
          channel.isVerified = true;
        }
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.channels = state.channels.filter(c => c.id !== action.payload);
      })
      .addCase(setDefaultChannel.fulfilled, (state, action) => {
        state.channels = state.channels.map(channel => ({
          ...channel,
          isDefault: channel.id === action.payload,
        }));
      });
  },
});

export default emailChannelsSlice.reducer;

