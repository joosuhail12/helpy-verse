
export interface Credentials {
  email: string;
  password: string;
}

export interface RegistrationCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmation {
  email: string;
  token: string;
  newPassword: string;
}

export type ActionType = 'manage' | 'create' | 'read' | 'update' | 'delete';

export interface Permission {
  action: ActionType | string;
  subject: string;
  conditions?: Record<string, any>;
}

export type Permissions = Permission[];

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: any | null;
  token: string | null;
  workspaceData: any | null;
  permissions: Permissions;
}
