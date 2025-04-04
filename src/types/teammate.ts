
export interface Teammate {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'supervisor' | 'agent' | 'viewer' | string;
  status: 'active' | 'inactive' | 'pending' | string;
  avatar?: string;
  lastActive?: string | Date;
  teamId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
