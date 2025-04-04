
import { ActionType } from "@/utils/ability";
import { AuthState } from "./auth/types";

export type { AuthState };

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
