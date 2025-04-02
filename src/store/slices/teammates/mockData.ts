
import type { Teammate, ActivityLog, TeamAssignment } from '@/types/teammate';

export const mockTeammates: Teammate[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'ORGANIZATION_ADMIN',
    status: 'active',
    lastActive: '2023-05-15T10:30:00Z',
    createdAt: '2023-01-01T08:00:00Z',
    createdBy: 'system',
    teamId: null,
    permissions: ['manage_users', 'manage_settings', 'manage_content'],
    is2FAEnabled: true,
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'WORKSPACE_AGENT',
    status: 'active',
    lastActive: '2023-05-14T14:45:00Z',
    createdAt: '2023-01-15T09:30:00Z',
    createdBy: 'system',
    teamId: null,
    permissions: ['view_tickets', 'respond_tickets'],
    is2FAEnabled: false,
  },
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    teammateId: '1',
    type: 'login',
    description: 'Logged in to the system',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    teammateId: '1',
    type: 'update',
    description: 'Updated profile information',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

export const mockSessions = [
  {
    id: '1',
    teammateId: '1',
    deviceType: 'desktop',
    deviceName: 'Chrome on Windows',
    location: 'New York, USA',
    lastActive: new Date().toISOString(),
    ipAddress: '192.168.1.1'
  }
];

export const mockAssignments: TeamAssignment[] = [
  {
    id: '1',
    teammateId: '1',
    teamName: 'Support Team',
    role: 'Lead',
    status: 'active',
    startDate: '2023-01-01T08:00:00Z'
  }
];
