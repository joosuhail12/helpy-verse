
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Teammate, NewTeammate } from '@/types/teammate';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface TeammatesState {
  teammates: Teammate[];
  loading: boolean;
  error: string | null;
  lastFetchTime: number | null;
  retryCount: number;
}

const initialState: TeammatesState = {
  teammates: [],
  loading: false,
  error: null,
  lastFetchTime: null,
  retryCount: 0
};

const mockTeammates: Teammate[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    lastActive: new Date().toISOString(),
    createdAt: '2024-01-01T00:00:00.000Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchTeammates = createAsyncThunk(
  'teammates/fetchTeammates',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { teammates: TeammatesState };
    
    // Check cache validity
    if (state.teammates.lastFetchTime) {
      const timeSinceLastFetch = Date.now() - state.teammates.lastFetchTime;
      if (timeSinceLastFetch < CACHE_DURATION) {
        return state.teammates.teammates;
      }
    }

    try {
      // In a real implementation, this would be an API call
      await delay(1000); // Simulate network delay
      return mockTeammates;
    } catch (error) {
      if (state.teammates.retryCount < 3) {
        await delay(1000 * (state.teammates.retryCount + 1)); // Exponential backoff
        return rejectWithValue('Failed to fetch teammates. Retrying...');
      }
      return rejectWithValue('Failed to fetch teammates after multiple retries');
    }
  }
);

export const addTeammate = createAsyncThunk(
  'teammates/addTeammate',
  async (newTeammate: NewTeammate, { dispatch }) => {
    const teammate: Teammate = {
      id: Math.random().toString(36).substr(2, 9),
      ...newTeammate,
      status: 'active',
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newTeammate.name}`
    };

    // Optimistically add the teammate
    dispatch(teammatesSlice.actions.addTeammateOptimistic(teammate));

    try {
      // In a real implementation, this would be an API call
      await delay(1000);
      return teammate;
    } catch (error) {
      // In case of error, the error handler will remove the optimistic update
      throw error;
    }
  }
);

export const resendInvitation = createAsyncThunk(
  'teammates/resendInvitation',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      await delay(1000);
      return teammateId;
    } catch (error) {
      return rejectWithValue('Failed to resend invitation');
    }
  }
);

export const updateTeammatesRole = createAsyncThunk(
  'teammates/updateTeammatesRole',
  async ({ teammateIds, role }: { teammateIds: string[], role: Teammate['role'] }, { dispatch, rejectWithValue }) => {
    // Optimistically update roles
    dispatch(teammatesSlice.actions.updateRolesOptimistic({ teammateIds, role }));

    try {
      await delay(1000);
      return { teammateIds, role };
    } catch (error) {
      return rejectWithValue('Failed to update roles');
    }
  }
);

const teammatesSlice = createSlice({
  name: 'teammates',
  initialState,
  reducers: {
    addTeammateOptimistic: (state, action) => {
      state.teammates.push(action.payload);
    },
    updateRolesOptimistic: (state, action) => {
      const { teammateIds, role } = action.payload;
      state.teammates = state.teammates.map(teammate => 
        teammateIds.includes(teammate.id)
          ? { ...teammate, role }
          : teammate
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeammates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeammates.fulfilled, (state, action) => {
        state.loading = false;
        state.teammates = action.payload;
        state.lastFetchTime = Date.now();
        state.retryCount = 0;
      })
      .addCase(fetchTeammates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teammates';
        state.retryCount += 1;
      })
      .addCase(addTeammate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add teammate';
        // Remove the optimistic update in case of error
        if (action.meta.arg) {
          state.teammates = state.teammates.filter(t => t.id !== action.meta.arg.id);
        }
      })
      .addCase(updateTeammatesRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update roles';
        // Revert the optimistic update
        if (action.meta.arg) {
          state.teammates = state.teammates.map(teammate => ({
            ...teammate,
            role: teammate.role // Revert to original role
          }));
        }
      });
  },
});

export default teammatesSlice.reducer;
