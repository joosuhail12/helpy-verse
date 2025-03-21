
export interface Teammate {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'agent' | 'viewer';
  status: 'active' | 'inactive';
  lastActive: string;
  createdAt: string;
  avatar?: string;
  permissions: string[];
  is2FAEnabled?: boolean;
}

export interface NewTeammate {
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'agent' | 'viewer';
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
