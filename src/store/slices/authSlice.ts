
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

// Initialize state from localStorage if available
const getInitialState = (): AuthState => {
  const savedAuth = localStorage.getItem('auth');
  if (savedAuth) {
    try {
      return JSON.parse(savedAuth);
    } catch (e) {
      console.error('Failed to parse auth from localStorage:', e);
    }
  }
  return {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  };
};

// Test admin credentials
const TEST_ADMIN = {
  email: 'admin@test.com',
  password: 'admin123'
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if credentials match test admin
    if (credentials.email === TEST_ADMIN.email && credentials.password === TEST_ADMIN.password) {
      const userData = {
        email: TEST_ADMIN.email,
        role: 'admin' as const
      };
      // Save to localStorage
      localStorage.setItem('auth', JSON.stringify({
        isAuthenticated: true,
        user: userData,
        loading: false,
        error: null,
      }));
      return userData;
    }
    
    throw new Error('Invalid credentials');
  }
);

// Add requestPasswordReset action
export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async ({ email }: { email: string }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, this would make an API call to request password reset
    console.log('Password reset requested for:', email);
    
    // Simulate successful request
    return true;
  }
);

// Add registerUser action
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { 
    fullName: string; 
    email: string; 
    password: string; 
    companyName: string; 
  }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, this would make an API call to register the user
    console.log('Registering user:', userData);
    
    // Simulate successful registration
    const newUser = {
      email: userData.email,
      role: 'agent' as const
    };
    
    // Save to localStorage
    localStorage.setItem('auth', JSON.stringify({
      isAuthenticated: true,
      user: newUser,
      loading: false,
      error: null,
    }));
    
    return newUser;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      localStorage.removeItem('auth');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login actions
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
      // Password reset actions
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
      })
      // Register actions
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
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

