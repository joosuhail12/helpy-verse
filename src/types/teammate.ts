
export type TeammateRole = 'admin' | 'supervisor' | 'agent' | 'viewer';

export type TeammateStatus = 'active' | 'inactive' | 'pending';

export interface TeammatePermission {
  resource: string;
  action: string;
}

export interface TeamAssignment {
  id: string;
  teamId: string;
  teamName: string;
  role: string;
  assignedAt: string;
}

export interface Session {
  id: string;
  deviceType: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrentSession: boolean;
}

export interface ActivityLog {
  id: string;
  type: 'login' | 'logout' | 'settings_changed' | 'password_changed' | 'permission_changed' | 'team_assigned';
  description: string;
  timestamp: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

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
  avatar?: string;
  permissions: TeammatePermission[];
  is2FAEnabled?: boolean;
}

export interface NewTeammate {
  name: string;
  email: string;
  role: TeammateRole;
}
