
import { UserProfile } from '@/types/user';

export interface Credentials {
  email: string;
  password: string;
}

export interface RegistrationCredentials {
  fullName?: string;
  email: string;
  password: string;
  companyName?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmation {
  token: string;
  password: string;
  confirmPassword?: string;
  rid?: string;
  tenantId?: string;
}

export interface AuthResponse {
  data: {
    id: string;
    accessToken: {
      token: string;
      expiresAt: string;
    };
    defaultWorkspaceId?: string;
    email?: string;
    role?: string;
    profile?: UserProfile;
    currentWorkspace?: any;
  };
  message: string;
  status: string;
}

export interface AuthError {
  message: string;
  code?: string;
  isOfflineError?: boolean;
  isAuthError?: boolean;
  isServerError?: boolean;
  isTimeoutError?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthResponse | null;
  loading: boolean;
  error: AuthError | null;
  permissions: string[];
  workspaces: any[];
}
