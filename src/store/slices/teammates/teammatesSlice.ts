
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Teammate, ActivityLog, Session } from '@/types/teammate';

interface TeammatesState {
  teammates: Teammate[];
  sessions: Session[];
  activityLogs: ActivityLog[];
  loading: boolean;
  error: string | null;
}

const initialState: TeammatesState = {
  teammates: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      lastActive: new Date().toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
      avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=john',
      permissions: ['manage_users', 'manage_content', 'manage_settings'],
      is2FAEnabled: true,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'agent',
      status: 'active',
      lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
      avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=jane',
      permissions: ['view_tickets', 'reply_tickets'],
      is2FAEnabled: false,
    }
  ],
  sessions: [
    {
      id: 's1',
      teammateId: '1',
      deviceType: 'Desktop',
      deviceName: 'Chrome on Windows',
      location: 'San Francisco, USA',
      lastActive: new Date().toISOString(),
      ipAddress: '192.168.1.1',
    },
    {
      id: 's2',
      teammateId: '1',
      deviceType: 'Mobile',
      deviceName: 'Safari on iPhone',
      location: 'San Francisco, USA',
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      ipAddress: '192.168.1.2',
    }
  ],
  activityLogs: [
    {
      id: 'al1',
      teammateId: '1',
      type: 'login',
      description: 'Logged in from San Francisco, USA',
      timestamp: new Date().toISOString(),
      metadata: {
        ip: '192.168.1.1',
        device: 'Chrome on Windows',
      },
    },
    {
      id: 'al2',
      teammateId: '1',
      type: 'settings_change',
      description: 'Updated email notification preferences',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      metadata: {
        change: 'email_notifications',
        old_value: 'all',
        new_value: 'mentions_only',
      },
    }
  ],
  loading: false,
  error: null,
};

export const fetchTeammate = (id: string) => ({
  type: 'teammates/fetchTeammate',
  payload: id,
});

export const update2FAStatus = (teammateId: string, code: string) => ({
  type: 'teammates/update2FAStatus',
  payload: { teammateId, code },
});

export const disableTwoFactor = (teammateId: string) => ({
  type: 'teammates/disableTwoFactor',
  payload: teammateId,
});

export const resetPassword = ({ teammateId, newPassword, currentPassword }: any) => ({
  type: 'teammates/resetPassword',
  payload: { teammateId, newPassword, currentPassword },
});

export const terminateSession = (payload: { teammateId: string; sessionId: string }) => ({
  type: 'teammates/terminateSession',
  payload,
});

const teammatesSlice = createSlice({
  name: 'teammates',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setTeammates: (state, action: PayloadAction<Teammate[]>) => {
      state.teammates = action.payload;
      state.loading = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { startLoading, setTeammates, setError } = teammatesSlice.actions;

export default teammatesSlice.reducer;
