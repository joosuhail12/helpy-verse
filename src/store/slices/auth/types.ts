
import { ActionType } from "@/utils/ability";

export interface Permission {
  action: ActionType | ActionType[];
  subject: string;
  conditions?: {
    clineId: string;
  };
}

export type Permissions = Permission[];

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  role?: string;
  status: 'active' | 'inactive' | 'pending';
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Workspace {
  id: string;
  name: string;
  role?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthToken {
  token: string;
  expiry: number;
  issuedAt: string;
  userAgent: string;
  ip: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    status: "success" | "error";
    message: string;
    data: {
      id: string;
      accessToken: AuthToken;
      defaultWorkspaceId: string;
      profile?: UserProfile;
      currentWorkspace?: Workspace;
    };
  } | null;
  loading: boolean;
  error: string | null | {
    message: string;
    code?: string; 
    isOfflineError?: boolean;
    isAuthError?: boolean;
    isServerError?: boolean;
    isTimeoutError?: boolean;
  };
  permissions: Permissions;
  workspaces: Workspace[];
}

export interface Credentials {
  email: string;
  password: string;
}

export interface RegistrationCredentials {
  fullName: string;
  email: string;
  password: string;
  companyName: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmation {
  token: string;
  password: string;
  rid?: string;
  tenantId?: string;
}

export interface AuthResponse {
  status: "success" | "error";
  message: string;
  data: {
    id: string;
    username?: string;
    email?: string;
    accessToken: AuthToken;
    defaultWorkspaceId: string;
    role?: string;
  };
}
