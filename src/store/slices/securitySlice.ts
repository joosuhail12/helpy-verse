
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type Session = {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrentSession: boolean;
};

export type SecurityState = {
  sessions: Session[];
  twoFactorEnabled: boolean;
  loading: boolean;
  error: string | null;
  teammateSettings: {
    id: string;
    twoFactorEnabled: boolean;
    passwordLastChanged: string;
    securityEvents: {
      date: string;
      event: string;
      ip: string;
      location: string;
    }[];
  } | null;
};

const initialState: SecurityState = {
  sessions: [],
  twoFactorEnabled: false,
  loading: false,
  error: null,
  teammateSettings: null,
};

// Async thunks
export const fetchSessions = createAsyncThunk(
  'security/fetchSessions',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/security/sessions');
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const revokeSession = createAsyncThunk(
  'security/revokeSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/security/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to revoke session');
      }
      return sessionId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const enable2FA = createAsyncThunk(
  'security/enable2FA',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/security/2fa/enable', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to enable 2FA');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const disable2FA = createAsyncThunk(
  'security/disable2FA',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/security/2fa/disable', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to disable 2FA');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verify2FA = createAsyncThunk(
  'security/verify2FA',
  async (code: string, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/security/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        throw new Error('Failed to verify 2FA code');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'security/resetPassword',
  async (data: { teammateId: string; newPassword: string }, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/security/password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to reset password');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const initializeTeammateSecurity = createAsyncThunk(
  'security/initializeTeammateSecurity',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/teammates/${teammateId}/security`);
      if (!response.ok) {
        throw new Error('Failed to fetch teammate security settings');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch sessions
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Revoke session
      .addCase(revokeSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(revokeSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = state.sessions.filter(session => session.id !== action.payload);
      })
      .addCase(revokeSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Enable 2FA
      .addCase(enable2FA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enable2FA.fulfilled, (state) => {
        state.loading = false;
        state.twoFactorEnabled = true;
      })
      .addCase(enable2FA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Disable 2FA
      .addCase(disable2FA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(disable2FA.fulfilled, (state) => {
        state.loading = false;
        state.twoFactorEnabled = false;
      })
      .addCase(disable2FA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Initialize teammate security
      .addCase(initializeTeammateSecurity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeTeammateSecurity.fulfilled, (state, action) => {
        state.loading = false;
        state.teammateSettings = action.payload;
      })
      .addCase(initializeTeammateSecurity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const securityReducer = securitySlice.reducer;
