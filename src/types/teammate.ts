export interface Teammate {
  id: string;
  name: string;
  email: string;
  role: 'WORKSPACE_AGENT' | 'ORGANIZATION_ADMIN' | 'WORKSPACE_ADMIN' | 'SUPER_ADMIN';
  teamId: string | null; // Added to match actual data
  createdBy: string; // Added to match actual data
  status: 'active' | 'inactive';
  lastActive: string | null; // Matches lastLoggedInAt from actual data
  createdAt: string; // Maps from created_at
  avatar?: string;
  permissions: string[]; // Still present for local usage (if applicable)
  is2FAEnabled?: boolean;
  
  // For backward compatibility with existing code
  first_name?: string;
  last_name?: string;
}

export interface NewTeammate {
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
  email: string;
  role: 'WORKSPACE_AGENT' | 'ORGANIZATION_ADMIN' | 'WORKSPACE_ADMIN' | 'SUPER_ADMIN';
  name?: string; // Added for compatibility
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
