
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
    updatedAt: '2024-01-01T00:00:00.000Z',
    permissions: ['manage_tickets', 'view_reports'],
    teams: [],
    is2FAEnabled: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  }
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    type: 'login',
    description: 'Logged in to the system',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    type: 'settings_changed',
    description: 'Updated profile information',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

export const mockAssignments: TeamAssignment[] = [
  {
    id: '1',
    teamId: '1',
    teamName: 'Customer Support',
    role: 'Team Lead',
    status: 'active',
    startDate: '2024-01-01T00:00:00.000Z'
  }
];
