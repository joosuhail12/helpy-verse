
export interface Teammate {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'supervisor' | 'agent' | 'viewer' | 'WORKSPACE_AGENT' | 'WORKSPACE_ADMIN' | 'ORGANIZATION_ADMIN' | 'SUPER_ADMIN' | string;
  status: 'active' | 'inactive' | 'pending' | string;
  avatar?: string;
  lastActive?: string | Date;
  teamId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  createdBy?: string;
  permissions?: string[];
  is2FAEnabled?: boolean;
}

export interface NewTeammate {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: string;
}

export interface ActivityLog {
  id: string;
  teammateId: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface TeamAssignment {
  id: string;
  teammateId: string;
  teamName: string;
  role: string;
  status: string;
  startDate: string;
}

export interface Session {
  id: string;
  teammateId: string;
  deviceType: string;
  deviceName: string;
  location: string;
  lastActive: string;
  ipAddress: string;
}
