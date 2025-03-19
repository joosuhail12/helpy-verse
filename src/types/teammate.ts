
export interface Teammate {
  id: string;
  name: string;
  email: string;
  role: TeammateRole;
  status: TeammateStatus;
  teams: string[];
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
  permissions: TeammatePermission[];
  is2FAEnabled?: boolean;
  avatar?: string; // Add avatar property
}

export type TeammateRole = 'admin' | 'supervisor' | 'agent' | 'viewer';
export type TeammateStatus = 'active' | 'inactive' | 'pending';
export type TeammatePermission = string;

export interface NewTeammate {
  name: string;
  email: string;
  role: TeammateRole;
}

export interface ActivityLog {
  id: string;
  type: 'login' | 'logout' | 'settings_changed' | 'password_changed' | 'permission_changed' | 'team_assigned' | 'update';
  description: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
  location?: string;
  teammateId?: string;
}

export interface TeamAssignment {
  id: string;
  teamId: string;
  teamName: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  startDate?: string;
  endDate?: string;
  teammateId?: string;
}

export interface Session {
  id: string;
  deviceType: string;
  deviceName: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
}
