
import { ActionType } from "@/utils/ability";

export interface Permission {
  action: ActionType | ActionType[];
  subject: string;
  conditions?: {
    clineId: string;
  };
}

export type Permissions = Permission[];

// Define specific status type to enforce "success" or "error" literal values
export type ResponseStatus = "success" | "error";

// Define the interface for auth response data
export interface AuthResponseData {
  id: string;
  accessToken: {
    token: string;
    expiry: number;
    issuedAt: string;
    userAgent: string;
    ip: string;
  };
  defaultWorkspaceId: string;
  // Allow additional properties
  [key: string]: any;
}

// Define the interface for auth response
export interface AuthResponse {
  status: ResponseStatus;
  message: string;
  data: AuthResponseData;
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
