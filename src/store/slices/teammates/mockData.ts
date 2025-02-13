
import type { Teammate, ActivityLog, TeamAssignment } from '@/types/teammate';

export const mockTeammates: Teammate[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    lastActive: new Date().toISOString(),
    createdAt: '2024-01-01T00:00:00.000Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    permissions: ['manage_tickets', 'view_reports']
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
