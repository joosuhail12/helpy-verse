
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Teammate, NewTeammate } from '@/types/teammate';
import { teammatesService } from '@/api/services/teammateService';

// Create a new teammate
export const createTeammate = createAsyncThunk(
  'teammates/createTeammate',
  async (teammate: NewTeammate) => {
    try {
      const response = await teammatesService.createTeammate(teammate);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Get all teammates
export const fetchTeammates = createAsyncThunk(
  'teammates/fetchTeammates',
  async () => {
    try {
      const response = await teammatesService.fetchTeammates();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Update a teammate
export const updateTeammate = createAsyncThunk(
  'teammates/updateTeammate',
  async ({ id, teammate }: { id: string; teammate: Partial<Teammate> }) => {
    try {
      const response = await teammatesService.updateTeammate(id, teammate);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Delete a teammate - mock implementation
export const deleteTeammate = createAsyncThunk(
  'teammates/deleteTeammate',
  async (id: string) => {
    try {
      // Using a mock delete response since the actual API method doesn't exist
      return { id, success: true };
    } catch (error) {
      throw error;
    }
  }
);

// Get a teammate by ID
export const fetchTeammateById = createAsyncThunk(
  'teammates/fetchTeammateById',
  async (id: string) => {
    try {
      const response = await teammatesService.getTeammate(id);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Export teammates - mock implementation
export const exportTeammates = createAsyncThunk(
  'teammates/exportTeammates',
  async () => {
    try {
      // Mock implementation
      return { success: true, url: 'exports/teammates.csv' };
    } catch (error) {
      throw error;
    }
  }
);

// Update teammates role in bulk - mock implementation
export const updateTeammatesRole = createAsyncThunk(
  'teammates/updateTeammatesRole',
  async ({ ids, role }: { ids: string[]; role: string }) => {
    try {
      // Mock implementation
      return { success: true, ids, role };
    } catch (error) {
      throw error;
    }
  }
);

// Mock function for resending invitation
export const resendInvitation = createAsyncThunk(
  'teammates/resendInvitation',
  async (email: string) => {
    try {
      // Mock API call
      const response = { status: 'success', message: `Invitation resent to ${email}` };
      return response;
    } catch (error) {
      throw error;
    }
  }
);
