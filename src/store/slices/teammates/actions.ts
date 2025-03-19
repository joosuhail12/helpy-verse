
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Teammate, NewTeammate, TeammateRole } from '@/types/teammate';

// Mock API functions - would be replaced with actual API calls
const mockApi = {
  async fetchTeammates() {
    // Simulate API call
    return Promise.resolve([]);
  },
  async addTeammate(teammate: NewTeammate) {
    // Simulate API call
    const newTeammate: Teammate = {
      id: Math.random().toString(36).substr(2, 9),
      name: teammate.name,
      email: teammate.email,
      role: teammate.role,
      status: 'pending',
      permissions: [],
      teams: [],
      createdAt: new Date().toISOString(),
      is2FAEnabled: false
    };
    return Promise.resolve(newTeammate);
  },
  async deleteTeammate(id: string) {
    // Simulate API call
    return Promise.resolve(id);
  },
  async updateTeammate(id: string, updates: Partial<Teammate>) {
    // Simulate API call
    return Promise.resolve({ id, ...updates });
  },
  async resendInvitation(id: string) {
    // Simulate API call
    return Promise.resolve({ id, status: 'pending' });
  },
  async updateTeammatesRole(ids: string[], role: TeammateRole) {
    // Simulate API call
    return Promise.resolve(ids.map(id => ({ id, role })));
  },
  async exportTeammates(format: 'csv' | 'json') {
    // Simulate API call
    return Promise.resolve(`data:text/${format},teammates`);
  }
};

// Async thunk actions
export const fetchTeammates = createAsyncThunk(
  'teammates/fetchTeammates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockApi.fetchTeammates();
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch teammates');
    }
  }
);

export const addTeammate = createAsyncThunk(
  'teammates/addTeammate',
  async (teammate: NewTeammate, { rejectWithValue }) => {
    try {
      const response = await mockApi.addTeammate(teammate);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to add teammate');
    }
  }
);

export const deleteTeammate = createAsyncThunk(
  'teammates/deleteTeammate',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await mockApi.deleteTeammate(id);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to delete teammate');
    }
  }
);

export const updateTeammate = createAsyncThunk(
  'teammates/updateTeammate',
  async ({ id, data }: { id: string; data: Partial<Teammate> }, { rejectWithValue }) => {
    try {
      const response = await mockApi.updateTeammate(id, data);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to update teammate');
    }
  }
);

export const resendInvitation = createAsyncThunk(
  'teammates/resendInvitation',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await mockApi.resendInvitation(id);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to resend invitation');
    }
  }
);

export const updateTeammatesRole = createAsyncThunk(
  'teammates/updateTeammatesRole',
  async ({ ids, role }: { ids: string[]; role: TeammateRole }, { rejectWithValue }) => {
    try {
      const response = await mockApi.updateTeammatesRole(ids, role);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to update teammates role');
    }
  }
);

export const exportTeammates = createAsyncThunk(
  'teammates/exportTeammates',
  async (format: 'csv' | 'json', { rejectWithValue }) => {
    try {
      const response = await mockApi.exportTeammates(format);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to export teammates');
    }
  }
);
