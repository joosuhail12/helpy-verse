
export interface Teammate {
  id: string;
  name: string;
  email: string;
  role?: 'WORKSPACE_AGENT' | 'ORGANIZATION_ADMIN' | 'WORKSPACE_ADMIN' | 'SUPER_ADMIN';
  teamId: string | null;
  createdBy: string;
  status: 'active' | 'inactive';
  lastActive: string | null;
  createdAt: string;
  avatar?: string;
  permissions: string[];
  is2FAEnabled?: boolean;
}

export interface NewTeammate {
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
  email: string;
  role: 'WORKSPACE_AGENT' | 'ORGANIZATION_ADMIN' | 'WORKSPACE_ADMIN' | 'SUPER_ADMIN';
}

export interface ActivityLog {
  id: string;
  teammateId: string;
  type: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface TeamAssignment {
  id: string;
  teammateId: string;
  teamName: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
  startDate?: string;
  endDate?: string;
}

export interface Session {
  id: string;
  teammateId: string;
  deviceType: string;
  deviceName: string;
  location: string;
  lastActive: string;
  ipAddress?: string;
}
