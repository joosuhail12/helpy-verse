
import { createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
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
      const response = await teammatesService.getTeammates();
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

// Delete a teammate
export const deleteTeammate = createAsyncThunk(
  'teammates/deleteTeammate',
  async (id: string) => {
    try {
      const response = await teammatesService.deleteTeammate(id);
      return response;
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
      const response = await teammatesService.getTeammateById(id);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Mock function for resending invitation - replace with actual implementation
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
