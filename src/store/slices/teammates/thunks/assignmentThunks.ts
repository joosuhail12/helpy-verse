
import { createAsyncThunk } from '@reduxjs/toolkit';
import { mockAssignments } from '../mockData';

// Fetch teammate assignments
export const fetchTeammateAssignments = createAsyncThunk(
  'teammates/fetchTeammateAssignments',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Fetching assignments for teammate ${teammateId}`);
      
      // Filter assignments from mock data
      const assignments = mockAssignments.filter(
        assignment => assignment.teammateId === teammateId
      );
      
      return assignments;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teammate assignments');
    }
  }
);
