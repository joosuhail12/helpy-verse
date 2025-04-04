
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { TeamAssignment } from '@/types/teammate';

// Fetch teammate assignments
export const fetchTeammateAssignments = createAsyncThunk(
  'teammates/fetchAssignments',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Fetching assignments for teammate with ID: ${teammateId}`);
      // Mocked API call for now
      const assignments: TeamAssignment[] = [
        { 
          id: '1', 
          teammateId: teammateId,
          teamId: 'team-1',
          role: 'Support Agent',
          assignedAt: new Date().toISOString(),
          teamName: 'Customer Support',
          startDate: new Date().toISOString(),
          status: 'active'
        },
        { 
          id: '2', 
          teammateId: teammateId,
          teamId: 'team-2',
          role: 'Developer',
          assignedAt: new Date().toISOString(),
          teamName: 'Product Development',
          startDate: new Date().toISOString(),
          status: 'active'
        }
      ];
      
      return assignments;
    } catch (error: any) {
      console.error(`Error fetching assignments for teammate ID ${teammateId}:`, error);
      return rejectWithValue(error.message || 'Failed to fetch teammate assignments');
    }
  }
);
