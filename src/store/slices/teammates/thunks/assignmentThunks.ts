
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { TeamAssignment } from '@/types/teammate';

// Fetch assignments for a teammate
export const fetchTeammateAssignments = createAsyncThunk(
  'teammates/fetchTeammateAssignments',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // Mock API call
      console.log(`Fetching assignments for teammate ${teammateId}`);
      
      // Mock assignment data
      const assignments: TeamAssignment[] = [
        {
          id: 'assignment-1',
          teammateId,
          teamId: 'team-1',
          role: 'Leader',
          assignedAt: new Date().toISOString(),
          teamName: 'Support Team',
          startDate: new Date(Date.now() - 7 * 86400000).toISOString(),
          status: 'active'
        },
        {
          id: 'assignment-2',
          teammateId,
          teamId: 'team-2',
          role: 'Member',
          assignedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
          teamName: 'Product Team',
          startDate: new Date(Date.now() - 30 * 86400000).toISOString(),
          status: 'active'
        }
      ];
      
      return assignments;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teammate assignments');
    }
  }
);
