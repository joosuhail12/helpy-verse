
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
      createdAt: new Date().toISOString(),
    };
    
    return newChannel;
  }
);

export const updateChannel = createAsyncThunk(
  'emailChannels/updateChannel',
  async (channel: Partial<EmailChannel> & { id: string }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return channel;
  }
);

export const deleteChannel = createAsyncThunk(
  'emailChannels/deleteChannel',
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
      .addCase(updateChannel.fulfilled, (state, action) => {
        const index = state.channels.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.channels[index] = {
            ...state.channels[index],
            ...action.payload,
            updatedAt: new Date().toISOString(),
          };
        }
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.channels = state.channels.filter(c => c.id !== action.payload);
      });
  },
});

export default emailChannelsSlice.reducer;
