
// Define common teammate-related types

export interface Teammate {
  id: string;
  name: string;
  email: string;
  role?: string;
  team?: string;
  teamId?: string;
  department?: string;
  status?: string;
  notes?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  lastActive?: string;
  workspaceId?: string;
  is2FAEnabled?: boolean;
  createdBy?: string;
  permissions?: string[];
}

export interface NewTeammate {
  name: string;
  email: string;
  role?: string;
  team?: string;
  department?: string;
  status?: string;
  notes?: string;
  password?: string;
  confirm_password?: string;
  first_name?: string;
  last_name?: string;
}

export interface ActivityLog {
  id: string;
  teammateId: string;
  action: string;
  timestamp: string;
  details: Record<string, any>;
  type?: string;
  description?: string;
}

export interface TeamAssignment {
  id: string;
  teammateId: string;
  teamId: string;
  role: string;
  assignedAt: string;
  teamName?: string;
  startDate?: string;
  status?: string;
}

export interface Session {
  id: string;
  teammateId: string;
  startTime: string;
  endTime: string | null;
  ipAddress: string;
  userAgent: string;
  active: boolean;
  deviceType?: string;
  deviceName?: string;
  location?: string;
  lastActive?: string;
}
