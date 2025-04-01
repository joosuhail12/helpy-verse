
import type { Teammate, ActivityLog, TeamAssignment, Session } from '@/types/teammate';

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
    team: 'support',
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
    team: 'sales',
    permissions: ['view_tickets', 'respond_tickets'],
    is2FAEnabled: false,
  },
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    teammateId: '1',
    action: 'login',
    timestamp: new Date().toISOString(),
    details: {},
    type: 'login',
    description: 'Logged in to the system'
  },
  {
    id: '2',
    teammateId: '1',
    action: 'update',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    details: {},
    type: 'update',
    description: 'Updated profile information'
  }
];

export const mockSessions: Session[] = [
  {
    id: '1',
    teammateId: '1',
    deviceType: 'desktop',
    deviceName: 'Chrome on Windows',
    location: 'New York, USA',
    lastActive: new Date().toISOString(),
    ipAddress: '192.168.1.1',
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    endTime: null,
    userAgent: 'Mozilla/5.0',
    active: true
  }
];

export const mockAssignments: TeamAssignment[] = [
  {
    id: '1',
    teammateId: '1',
    teamId: 'team-1',
    teamName: 'Support Team',
    role: 'Lead',
    assignedAt: '2023-01-01T08:00:00Z',
    startDate: '2023-01-01T08:00:00Z'
  }
];
