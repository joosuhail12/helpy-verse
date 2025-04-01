
import { createAsyncThunk } from '@reduxjs/toolkit';

// Fetch teammate assignments
export const fetchTeammateAssignments = createAsyncThunk(
  'teammates/fetchAssignments',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Fetching assignments for teammate with ID: ${teammateId}`);
      // Mocked API call for now
      const assignments = [
        { id: '1', ticketId: 'ticket-1', subject: 'Customer complaint', assignedAt: new Date().toISOString() },
        { id: '2', ticketId: 'ticket-2', subject: 'Feature request', assignedAt: new Date().toISOString() }
      ];
      
      return assignments;
    } catch (error: any) {
      console.error(`Error fetching assignments for teammate ID ${teammateId}:`, error);
      return rejectWithValue(error.message || 'Failed to fetch teammate assignments');
    }
  }
);
