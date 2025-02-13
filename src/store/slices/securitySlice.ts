
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Session {
  id: string;
  teammateId: string;
  deviceType: string;
  deviceName: string;
  location: string;
  lastActive: string;
}

interface SecurityState {
  teammateSettings: Record<string, {
    is2FAEnabled: boolean;
    qrCodeUrl: string;
  }>;
  sessions: Record<string, Session[]>;
  loading: boolean;
  error: string | null;
}

const initialState: SecurityState = {
  teammateSettings: {},
  sessions: {},
  loading: false,
  error: null
};

export const enable2FA = createAsyncThunk(
  'security/enable2FA',
  async (teammateId: string) => {
    // Replace with your actual API call
    const response = await fetch(`/api/teammate/${teammateId}/2fa/enable`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to enable 2FA');
    return response.json();
  }
);

export const disable2FA = createAsyncThunk(
  'security/disable2FA',
  async (teammateId: string) => {
    // Replace with your actual API call
    const response = await fetch(`/api/teammate/${teammateId}/2fa/disable`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to disable 2FA');
    return teammateId;
  }
);

export const verify2FA = createAsyncThunk(
  'security/verify2FA',
  async ({ teammateId, code }: { teammateId: string; code: string }) => {
    // Replace with your actual API call
    const response = await fetch(`/api/teammate/${teammateId}/2fa/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });
    if (!response.ok) throw new Error('Failed to verify 2FA code');
    return teammateId;
  }
);

export const fetchSessions = createAsyncThunk(
  'security/fetchSessions',
  async (teammateId: string) => {
    // Replace with your actual API call
    const response = await fetch(`/api/teammate/${teammateId}/sessions`);
    if (!response.ok) throw new Error('Failed to fetch sessions');
    return { teammateId, sessions: await response.json() };
  }
);

export const revokeSession = createAsyncThunk(
  'security/revokeSession',
  async ({ teammateId, sessionId }: { teammateId: string; sessionId: string }) => {
    // Replace with your actual API call
    const response = await fetch(`/api/teammate/${teammateId}/sessions/${sessionId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to revoke session');
    return { teammateId, sessionId };
  }
);

export const resetPassword = createAsyncThunk(
  'security/resetPassword',
  async ({ teammateId, currentPassword, newPassword }: {
    teammateId: string;
    currentPassword: string;
    newPassword: string;
  }) => {
    // Replace with your actual API call
    const response = await fetch(`/api/teammate/${teammateId}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    if (!response.ok) throw new Error('Failed to reset password');
    return teammateId;
  }
);

const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    initializeTeammateSecurity: (state, action) => {
      const teammateId = action.payload;
      if (!state.teammateSettings[teammateId]) {
        state.teammateSettings[teammateId] = {
          is2FAEnabled: false,
          qrCodeUrl: ''
        };
      }
      if (!state.sessions[teammateId]) {
        state.sessions[teammateId] = [];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(enable2FA.fulfilled, (state, action) => {
        const { teammateId, qrCodeUrl } = action.payload;
        state.teammateSettings[teammateId] = {
          is2FAEnabled: false,
          qrCodeUrl
        };
      })
      .addCase(verify2FA.fulfilled, (state, action) => {
        const teammateId = action.payload;
        if (state.teammateSettings[teammateId]) {
          state.teammateSettings[teammateId].is2FAEnabled = true;
          state.teammateSettings[teammateId].qrCodeUrl = '';
        }
      })
      .addCase(disable2FA.fulfilled, (state, action) => {
        const teammateId = action.payload;
        if (state.teammateSettings[teammateId]) {
          state.teammateSettings[teammateId].is2FAEnabled = false;
          state.teammateSettings[teammateId].qrCodeUrl = '';
        }
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        const { teammateId, sessions } = action.payload;
        state.sessions[teammateId] = sessions;
      })
      .addCase(revokeSession.fulfilled, (state, action) => {
        const { teammateId, sessionId } = action.payload;
        if (state.sessions[teammateId]) {
          state.sessions[teammateId] = state.sessions[teammateId].filter(
            session => session.id !== sessionId
          );
        }
      });
  },
});

export const { initializeTeammateSecurity } = securitySlice.actions;
export default securitySlice.reducer;

