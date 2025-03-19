
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { Teammate, ActivityLog, TeamAssignment, Session, NewTeammate, TeammateRole } from '@/types/teammate';

// Basic actions
export const setLoading = createAction<boolean>('teammates/setLoading');
export const setError = createAction<string | null>('teammates/setError');
export const setTeammates = createAction<Teammate[]>('teammates/setTeammates');

// Async thunks
export const fetchTeammates = createAsyncThunk(
  'teammates/fetchTeammates',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with actual API call in the future
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockTeammates;
    } catch (error) {
      return rejectWithValue('Failed to fetch teammates');
    }
  }
);

export const addTeammate = createAsyncThunk(
  'teammates/addTeammate',
  async (teammate: NewTeammate, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newTeammate: Teammate = {
        id: `teammate-${Math.random().toString(36).substr(2, 9)}`,
        name: teammate.name,
        email: teammate.email,
        role: teammate.role,
        status: 'pending',
        teams: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        permissions: [],
        is2FAEnabled: false
      };
      return newTeammate;
    } catch (error) {
      return rejectWithValue('Failed to add teammate');
    }
  }
);

export const updateTeammate = createAsyncThunk(
  'teammates/updateTeammate',
  async (teammate: Teammate, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return teammate;
    } catch (error) {
      return rejectWithValue('Failed to update teammate');
    }
  }
);

export const deleteTeammate = createAsyncThunk(
  'teammates/deleteTeammate',
  async (id: string, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete teammate');
    }
  }
);

export const updateTeammatesRole = createAsyncThunk(
  'teammates/updateTeammatesRole',
  async ({ teammateIds, role }: { teammateIds: string[], role: TeammateRole }, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { teammateIds, role };
    } catch (error) {
      return rejectWithValue('Failed to update teammates role');
    }
  }
);

export const exportTeammates = createAsyncThunk(
  'teammates/exportTeammates',
  async (teammateIds: string[], { rejectWithValue }) => {
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: 'Export successful' };
    } catch (error) {
      return rejectWithValue('Failed to export teammates');
    }
  }
);

export const fetchTeammateActivities = createAsyncThunk(
  'teammates/fetchTeammateActivities',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockActivities;
    } catch (error) {
      return rejectWithValue('Failed to fetch teammate activities');
    }
  }
);

export const fetchTeammateAssignments = createAsyncThunk(
  'teammates/fetchTeammateAssignments',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAssignments;
    } catch (error) {
      return rejectWithValue('Failed to fetch teammate assignments');
    }
  }
);

export const fetchTeammateSessions = createAsyncThunk(
  'teammates/fetchTeammateSessions',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockSessions;
    } catch (error) {
      return rejectWithValue('Failed to fetch teammate sessions');
    }
  }
);

export const terminateSession = createAsyncThunk(
  'teammates/terminateSession',
  async ({ teammateId, sessionId }: { teammateId: string, sessionId: string }, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return sessionId;
    } catch (error) {
      return rejectWithValue('Failed to terminate session');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'teammates/resetPassword',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: 'Password reset link sent' };
    } catch (error) {
      return rejectWithValue('Failed to reset password');
    }
  }
);

export const enable2FA = createAsyncThunk(
  'teammates/enable2FA',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { 
        success: true, 
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Example:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Example',
        secret: 'JBSWY3DPEHPK3PXP'
      };
    } catch (error) {
      return rejectWithValue('Failed to enable 2FA');
    }
  }
);

export const verify2FA = createAsyncThunk(
  'teammates/verify2FA',
  async ({ teammateId, code }: { teammateId: string, code: string }, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simple mock verification - in real app this would be a server-side verification
      const isValid = code.length === 6 && /^\d+$/.test(code);
      
      if (!isValid) {
        return rejectWithValue('Invalid verification code');
      }
      
      return { success: true, message: '2FA enabled successfully' };
    } catch (error) {
      return rejectWithValue('Failed to verify 2FA code');
    }
  }
);

export const disable2FA = createAsyncThunk(
  'teammates/disable2FA',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: '2FA disabled successfully' };
    } catch (error) {
      return rejectWithValue('Failed to disable 2FA');
    }
  }
);

// Synchronous actions to set data
export const setTeammateActivities = createAction<ActivityLog[]>('teammates/setTeammateActivities');
export const setTeammateAssignments = createAction<TeamAssignment[]>('teammates/setTeammateAssignments');
export const setTeammateSessions = createAction<Session[]>('teammates/setTeammateSessions');

// Mock data
const mockTeammates: Teammate[] = [
  {
    id: 'teammate-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    teams: ['team-1', 'team-2'],
    lastActive: '2023-07-25T14:30:00Z',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-07-25T14:30:00Z',
    permissions: [
      { resource: 'tickets', action: 'read' },
      { resource: 'tickets', action: 'write' },
      { resource: 'tickets', action: 'delete' }
    ],
    is2FAEnabled: true
  },
  {
    id: 'teammate-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'supervisor',
    status: 'active',
    teams: ['team-1'],
    lastActive: '2023-07-24T16:45:00Z',
    createdAt: '2023-02-10T11:30:00Z',
    updatedAt: '2023-07-24T16:45:00Z',
    permissions: [
      { resource: 'tickets', action: 'read' },
      { resource: 'tickets', action: 'write' }
    ],
    is2FAEnabled: false
  }
];

const mockActivities: ActivityLog[] = [
  {
    id: 'activity-1',
    type: 'login',
    description: 'Logged in from 192.168.1.1',
    timestamp: '2023-07-25T14:30:00Z',
    ipAddress: '192.168.1.1'
  },
  {
    id: 'activity-2',
    type: 'settings_changed',
    description: 'Changed profile settings',
    timestamp: '2023-07-24T16:45:00Z',
    ipAddress: '192.168.1.1'
  }
];

const mockAssignments: TeamAssignment[] = [
  {
    id: 'assignment-1',
    teamId: 'team-1',
    teamName: 'Support Team',
    role: 'Member',
    assignedAt: '2023-01-15T10:00:00Z'
  },
  {
    id: 'assignment-2',
    teamId: 'team-2',
    teamName: 'Engineering Team',
    role: 'Lead',
    assignedAt: '2023-02-10T11:30:00Z'
  }
];

const mockSessions: Session[] = [
  {
    id: 'session-1',
    deviceType: 'Desktop - Chrome',
    ipAddress: '192.168.1.1',
    location: 'New York, USA',
    lastActive: '2023-07-25T14:30:00Z',
    isCurrentSession: true
  },
  {
    id: 'session-2',
    deviceType: 'Mobile - Safari',
    ipAddress: '192.168.1.2',
    location: 'New York, USA',
    lastActive: '2023-07-24T16:45:00Z',
    isCurrentSession: false
  }
];
