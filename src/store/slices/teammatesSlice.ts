
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
  selectedTeammates: string[];
  sortField: keyof Teammate | null;
  sortDirection: 'asc' | 'desc';
}

const initialState: TeammatesState = {
  teammates: [],
  loading: false,
  error: null,
  selectedTeammates: [],
  sortField: null,
  sortDirection: 'asc'
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

export const updateTeammate = createAsyncThunk(
  'teammates/updateTeammate',
  async (updatedTeammate: Partial<Teammate> & { id: string }) => {
    // In a real implementation, this would be an API call
    return updatedTeammate;
  }
);

export const bulkDeactivateTeammates = createAsyncThunk(
  'teammates/bulkDeactivateTeammates',
  async (teammateIds: string[]) => {
    // In a real implementation, this would be an API call
    return teammateIds;
  }
);

export const resendInvitation = createAsyncThunk(
  'teammates/resendInvitation',
  async (teammateId: string) => {
    // In a real implementation, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return teammateId;
  }
);

const teammatesSlice = createSlice({
  name: 'teammates',
  initialState,
  reducers: {
    toggleTeammateSelection: (state, action) => {
      const teammateId = action.payload;
      const index = state.selectedTeammates.indexOf(teammateId);
      if (index === -1) {
        state.selectedTeammates.push(teammateId);
      } else {
        state.selectedTeammates.splice(index, 1);
      }
    },
    clearTeammateSelection: (state) => {
      state.selectedTeammates = [];
    },
    setSortField: (state, action) => {
      const newSortField = action.payload;
      if (state.sortField === newSortField) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortField = newSortField;
        state.sortDirection = 'asc';
      }
    },
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
      .addCase(updateTeammate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeammate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.teammates.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.teammates[index] = { ...state.teammates[index], ...action.payload };
        }
      })
      .addCase(updateTeammate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update teammate';
      })
      .addCase(bulkDeactivateTeammates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkDeactivateTeammates.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.forEach(id => {
          const teammate = state.teammates.find(t => t.id === id);
          if (teammate) {
            teammate.status = 'inactive';
          }
        });
        state.selectedTeammates = [];
      })
      .addCase(bulkDeactivateTeammates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to deactivate teammates';
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
      });
  },
});

export const { toggleTeammateSelection, clearTeammateSelection, setSortField } = teammatesSlice.actions;
export default teammatesSlice.reducer;
