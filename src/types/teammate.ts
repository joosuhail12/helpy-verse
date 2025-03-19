
export type TeammatePermission = 
  | 'manage_tickets'
  | 'view_reports'
  | 'manage_users'
  | 'manage_teams'
  | 'manage_settings'
  | 'admin';

export type TeammateRole = 'admin' | 'agent' | 'manager' | 'viewer';

export type TeammateStatus = 'active' | 'inactive' | 'pending';

export type ActivityLogType = 
  | 'login'
  | 'logout'
  | 'settings_changed'
  | 'password_changed'
  | 'permission_changed'
  | 'team_assigned'
  | 'update'; // Adding the 'update' type

export interface Teammate {
  id: string;
  name: string;
  email: string;
  role: TeammateRole;
  status: TeammateStatus;
  permissions: TeammatePermission[];
  teams: string[];
  lastActive?: string;
  createdAt: string;
  updatedAt?: string;
  avatar?: string;
  is2FAEnabled?: boolean;
}

export interface ActivityLog {
  id: string;
  teammateId: string; // Adding teammateId that was being used
  type: ActivityLogType;
  description: string;
  timestamp: string;
}

export interface TeamAssignment {
  id: string;
  teammateId: string; // Adding teammateId that was being used
  teamName: string;
  role: string;
  status: 'active' | 'inactive';
  startDate: string;
  endDate?: string;
}

export interface TeammateSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  current: boolean;
}
