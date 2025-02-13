import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Teammate, NewTeammate } from '@/types/teammate';

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

interface TeammatesState {
  teammates: Teammate[];
  loading: boolean;
  error: string | null;
}

const initialState: TeammatesState = {
  teammates: [],
  loading: false,
  error: null
};

export const fetchTeammates = createAsyncThunk(
  'teammates/fetchTeammates',
  async () => {
    // In a real implementation, this would be an API call
    return mockTeammates;
  }
);

export const addTeammate = createAsyncThunk(
  'teammates/addTeammate',
  async (newTeammate: NewTeammate) => {
    // In a real implementation, this would be an API call
    const teammate: Teammate = {
      id: Math.random().toString(36).substr(2, 9),
      ...newTeammate,
      status: 'active',
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newTeammate.name}`
    };
    return teammate;
  }
);

export const resendInvitation = createAsyncThunk(
  'teammates/resendInvitation',
  async (teammateId: string) => {
    // In a real implementation, this would be an API call to resend the invitation
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return teammateId;
  }
);

export const updateTeammatesRole = createAsyncThunk(
  'teammates/updateTeammatesRole',
  async ({ teammateIds, role }: { teammateIds: string[], role: string }) => {
    // In a real implementation, this would be an API call to your backend
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return { teammateIds, role };
  }
);

export const exportTeammates = createAsyncThunk(
  'teammates/exportTeammates',
  async (teammateIds: string[]) => {
    // In a real implementation, this would trigger a backend export process
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return teammateIds;
  }
);

const teammatesSlice = createSlice({
  name: 'teammates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeammates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeammates.fulfilled, (state, action) => {
        state.loading = false;
        state.teammates = action.payload;
      })
      .addCase(fetchTeammates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teammates';
      })
      .addCase(addTeammate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTeammate.fulfilled, (state, action) => {
        state.loading = false;
        state.teammates.push(action.payload);
      })
      .addCase(addTeammate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add teammate';
      })
      .addCase(resendInvitation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendInvitation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendInvitation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to resend invitation';
      })
      .addCase(updateTeammatesRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeammatesRole.fulfilled, (state, action) => {
        state.loading = false;
        state.teammates = state.teammates.map(teammate => 
          action.payload.teammateIds.includes(teammate.id)
            ? { ...teammate, role: action.payload.role }
            : teammate
        );
      })
      .addCase(updateTeammatesRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update roles';
      })
      .addCase(exportTeammates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportTeammates.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportTeammates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to export teammates';
      });
  },
});

export default teammatesSlice.reducer;
