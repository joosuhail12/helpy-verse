
import { ActionType } from "@/utils/ability";

export interface Permission {
  action: ActionType | ActionType[];
  subject: string;
  conditions?: {
    clineId: string;
  };
}

export type Permissions = Permission[];

export type ResponseStatus = "success" | "error";

export interface AuthResponse {
  status: ResponseStatus;
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
    [key: string]: any; // Allow for additional properties
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthResponse | null;
  loading: boolean;
  error: string | null;
  permissions: Permissions;
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
