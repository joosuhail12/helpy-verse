
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Team, TeamsState } from '@/types/team';
import { HttpClient } from '@/api/services/http';

const initialState: TeamsState = {
  teams: [],
  loading: false,
  error: null,
  teamDetails: null,
  areTeamsLoaded: false
};

export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async (params: Record<string, any>, { rejectWithValue }) => {
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockTeams: Team[] = [
        {
          id: '1',
          name: 'Support Team',
          icon: '🛠️',
          teamMembers: [
            { id: '1', name: 'Sarah Wilson', email: 'sarah@example.com' },
            { id: '2', name: 'Mike Thompson', email: 'mike@example.com' }
          ],
          routingStrategy: 'round-robin',
          officeHours: {
            monday: [{ start: '09:00', end: '17:00' }],
            tuesday: [{ start: '09:00', end: '17:00' }],
            wednesday: [{ start: '09:00', end: '17:00' }],
            thursday: [{ start: '09:00', end: '17:00' }],
            friday: [{ start: '09:00', end: '17:00' }],
            saturday: [],
            sunday: []
          },
          holidays: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Sales Team',
          icon: '💼',
          teamMembers: [
            { id: '3', name: 'Tom Wilson', email: 'tom@example.com' }
          ],
          routingStrategy: 'manual',
          officeHours: {
            monday: [{ start: '09:00', end: '17:00' }],
            tuesday: [{ start: '09:00', end: '17:00' }],
            wednesday: [{ start: '09:00', end: '17:00' }],
            thursday: [{ start: '09:00', end: '17:00' }],
            friday: [{ start: '09:00', end: '17:00' }],
            saturday: [],
            sunday: []
          },
          holidays: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      return mockTeams;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teams');
    }
  }
);

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.teams = action.payload;
        state.loading = false;
        state.areTeamsLoaded = true;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default teamsSlice.reducer;
