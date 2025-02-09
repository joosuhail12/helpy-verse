
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    role: 'admin' | 'supervisor' | 'agent' | 'viewer' | null;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('YOUR_API_URL/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: { 
    fullName: string;
    email: string;
    password: string;
    companyName: string;
  }) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('YOUR_API_URL/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) throw new Error('Registration failed');
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (credentials: { email: string }) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('YOUR_API_URL/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) throw new Error('Password reset request failed');
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Password reset request failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
