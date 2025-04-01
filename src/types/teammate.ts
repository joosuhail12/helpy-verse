
// Define common teammate-related types

export interface Teammate {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  team?: string;
  department?: string;
  status?: string;
  notes?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  lastActive?: string;
  workspaceId?: string;
}

export interface NewTeammate {
  name: string;
  email: string;
  role?: string;
  team?: string;
  department?: string;
  status?: string;
  notes?: string;
}

export interface ActivityLog {
  id: string;
  teammateId: string;
  action: string;
  timestamp: string;
  details: Record<string, any>;
}

export interface TeamAssignment {
  id: string;
  teammateId: string;
  teamId: string;
  role: string;
  assignedAt: string;
}

export interface Session {
  id: string;
  teammateId: string;
  startTime: string;
  endTime: string | null;
  ipAddress: string;
  userAgent: string;
  active: boolean;
}
