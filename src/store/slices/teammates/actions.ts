
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { Teammate, NewTeammate } from '@/types/teammate';
import { v4 as uuidv4 } from 'uuid';
import { teammateService } from '@/api/services/teammateService';
import { CACHE_DURATION } from './types';

// Fetch all teammates
export const fetchTeammates = createAsyncThunk(
  'teammates/fetchAll',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const now = Date.now();
    const lastFetch = state.teammates.lastFetchTime;
    
    // If we have data and it's recent, don't fetch again
    if (
      lastFetch &&
      now - lastFetch < CACHE_DURATION &&
      state.teammates.teammates.length > 0 &&
      !state.teammates.error
    ) {
      return state.teammates.teammates;
    }
    
    const response = await teammateService.getAllTeammates();
    return response.data;
  }
);

// Create a new teammate
export const createTeammate = createAsyncThunk(
  'teammates/create',
  async (newTeammate: NewTeammate, { rejectWithValue }) => {
    try {
      // Create full teammate object
      const teammate: Teammate = {
        id: uuidv4(),
        name: `${newTeammate.first_name} ${newTeammate.last_name}`,
        email: newTeammate.email,
        role: newTeammate.role,
        status: 'active',
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        teamId: '', // Default empty teamId
        createdBy: '', // Default empty createdBy
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${newTeammate.first_name} ${newTeammate.last_name}`,
        permissions: [],
        first_name: newTeammate.first_name,
        last_name: newTeammate.last_name
      };
      
      const response = await teammateService.createTeammate(newTeammate);
      
      // Combine API response with local data as needed
      return {
        ...teammate,
        ...response.data
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create teammate');
    }
  }
);

// Update an existing teammate
export const updateTeammate = createAsyncThunk(
  'teammates/update',
  async (
    { id, updates }: { id: string; updates: Partial<Teammate> },
    { rejectWithValue }
  ) => {
    try {
      const response = await teammateService.updateTeammate(id, updates);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update teammate');
    }
  }
);

// Delete a teammate
export const deleteTeammate = createAsyncThunk(
  'teammates/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await teammateService.deleteTeammate(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete teammate');
    }
  }
);

// Fetch a single teammate's details
export const fetchTeammateDetails = createAsyncThunk(
  'teammates/fetchDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await teammateService.getTeammateById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch teammate details');
    }
  }
);

// Fetch teammate activity logs
export const fetchTeammateActivity = createAsyncThunk(
  'teammates/fetchActivity',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await teammateService.getTeammateActivity(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch teammate activity');
    }
  }
);
