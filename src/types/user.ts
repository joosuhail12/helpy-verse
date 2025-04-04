
export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  lastActive?: string;
  status?: 'active' | 'inactive' | 'pending';
  defaultWorkspaceId?: string;
}
