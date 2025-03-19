
export type TeammateRole = 'admin' | 'supervisor' | 'agent' | 'viewer';
export type TeammateStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type ActivityType = 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view';

export interface Teammate {
  id: string;
  name: string;
  email: string;
  role: TeammateRole;
  status: TeammateStatus;
  lastActive: string;
  createdAt: string;
  avatar?: string;
  permissions: string[];
  is2FAEnabled?: boolean;
}

export interface NewTeammate {
  name: string;
  email: string;
  role: TeammateRole;
}

export interface ActivityLog {
  id: string;
  teammateId: string;
  type: ActivityType;
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
  device: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
}
