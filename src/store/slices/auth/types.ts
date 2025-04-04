
export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
  permissions: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface ConfirmPasswordResetData {
  token: string;
  password: string;
}

// Update AuthResponse interface to match the actual API response structure
export interface AuthResponse {
  data?: {
    accessToken: {
      token: string;
    }
  };
  accessToken?: string | {
    token: string;
  };
  user?: any;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface RegistrationCredentials {
  email: string;
  password: string;
  fullName: string;
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

export type Permissions = string[];

export interface Permission {
  action: string;
  subject: string;
}
