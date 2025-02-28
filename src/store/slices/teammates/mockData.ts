
import type { Teammate, ActivityLog, TeamAssignment } from '@/types/teammate';

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

export const mockTeammates: Teammate[] = [
  {
    id: '373c643f-0109-485e-b614-c96c7816a63d',
    name: 'UserTest30 test',
    email: 'usertest30@example.com',
    role: 'WORKSPACE_AGENT',
    status: 'active',
    teamId: null,
    createdBy: 'CLI',
    createdAt: '2025-02-07T11:02:45.774553',
    lastActive: '2025-02-07T11:19:21.031',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=UserTest30test',
    permissions: ['manage_tickets', 'view_reports']
  },
  {
    id: 'a8f43e32-6fc6-45a7-b0eb-8a4e5b90cb78',
    name: 'manminder tomar',
    email: 'manminder@example.com',
    role: 'WORKSPACE_AGENT',
    status: 'active',
    teamId: null,
    createdBy: '373c643f-0109-485e-b614-c96c7816a63d',
    createdAt: '2025-02-13T18:36:22.977863',
    lastActive: null,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manmindertomar',
    permissions: ['view_reports']
  }
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

export const mockAssignments: TeamAssignment[] = [
  {
    id: '1',
    teammateId: '1',
    teamName: 'Customer Support',
    role: 'Team Lead',
    status: 'active',
    startDate: '2024-01-01T00:00:00.000Z'
  }
];
