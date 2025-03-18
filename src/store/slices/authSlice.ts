
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from "@/api/services/HttpClient";
import { 
  encryptBase64, 
  setCookie, 
  setWorkspaceId, 
  handleSetToken, 
  deleteCookie, 
  getCookie, 
  handleLogout 
} from '@/utils/helpers/helpers';
import { get } from "lodash";

export type ActionType = "create" | "read" | "update" | "delete" | "archive" | "manage";

export interface Permission {
  action: ActionType | ActionType[]; // Can be a single string or an array of actions
  subject: string;
  conditions?: {
    clineId: string;
  };
}

// Define Permissions Array Type
export type Permissions = Permission[];

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    status: "success" | "error";
    message: string;
    data: {
      id: string;
      accessToken: {
        token: string;
        expiry: number;
        issuedAt: string;
        userAgent: string;
        ip: string;
      };
      defaultWorkspaceId: string;
    };
  } | null;
  loading: boolean;
  error: string | null;
  permissions: Permissions;
}

const initialState: AuthState = {
  isAuthenticated: !!getCookie("customerToken"),
  user: null,
  loading: false,
  error: null,
  permissions: [],
};

interface Credentials {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: Credentials, { rejectWithValue }) => {
    try {
      console.log("Attempting login for:", credentials.email);
      
      // Make sure to use the correct endpoint and payload structure
      const response = await HttpClient.apiClient.post("/auth/login", {
        username: credentials.email,
        password: credentials.password,
        recaptchaId: "",
      });

      console.log("Login successful, received token");
      return response.data;
    } catch (error: any) {
      console.error("Login error:", error.message);
      return rejectWithValue(error.response?.data?.message || "Login failed. Please check your credentials and try again.");
    }
  }
);

export const fetchUserData = createAsyncThunk(
  "user/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching user profile data");
      const response = await HttpClient.apiClient.get("/user/profile");
      console.log("User profile data fetched successfully");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching user data:", error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to load user profile");
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

export const getUserPermission = createAsyncThunk(
  "auth/getUserPermission",
  async () => {
    try {
      const response = await HttpClient.apiClient.get("/profile/abilities");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (credentials: { email: string }) => {
    try {
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

export const confirmPasswordReset = createAsyncThunk(
  'auth/confirmPasswordReset',
  async (credentials: {
    token: string;
    password: string;
    rid?: string;
    tenantId?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await HttpClient.apiClient.post('/auth/reset-password', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpClient.apiClient.get("/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user profile");
    }
  }
);

export const fetchWorkspaceData = createAsyncThunk(
  "auth/fetchWorkspaceData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpClient.apiClient.get("/workspace/6c22b22f-7bdf-43db-b7c1-9c5884125c63");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch workspace data");
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      handleLogout(); // Use our improved logout function
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

        const loginData = action.payload?.data;
        if (loginData) {
          const email = loginData?.username || "";
          const encryptedEmail = encryptBase64(email);
          setCookie("agent_email", encryptedEmail);

          // Set the token in the cookie and Axios headers
          handleSetToken(loginData?.accessToken?.token || "");

          // Set workspace ID
          setWorkspaceId(get(action.payload, "data.defaultWorkspaceId", ""));

          // Configure Axios with the new token
          HttpClient.setAxiosDefaultConfig();
        }
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
      })
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'User data fetch failed';
      })
      .addCase(getUserPermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPermission.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
      })
      .addCase(getUserPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'User permission fetch failed';
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user profile';
      })
      .addCase(fetchWorkspaceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaceData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchWorkspaceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch workspace data';
      })
      // Password reset confirmation cases
      .addCase(confirmPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmPasswordReset.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(confirmPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Password reset failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
