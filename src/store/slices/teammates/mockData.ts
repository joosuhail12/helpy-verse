
import type { Teammate, ActivityLog, TeamAssignment } from '@/types/teammate';
import { 
  createMockTeammate, 
  createMockActivityLog, 
  createMockTeamAssignment 
} from '@/utils/mockDataUtils';

export const mockTeammates: Teammate[] = [
  createMockTeammate({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  }),
  createMockTeammate({
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'supervisor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
  }),
  createMockTeammate({
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'agent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
  }),
  createMockTeammate({
    id: '4',
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'agent',
    status: 'inactive',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
  }),
  createMockTeammate({
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'viewer',
    status: 'pending',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie'
  })
];

export const mockActivityLogs: ActivityLog[] = [
  createMockActivityLog({
    id: '1',
    type: 'login',
    description: 'Logged in to the system',
    timestamp: new Date().toISOString()
  }),
  createMockActivityLog({
    id: '2',
    type: 'settings_changed',
    description: 'Updated profile information',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }),
  createMockActivityLog({
    id: '3',
    type: 'permission_changed',
    description: 'Role changed from Agent to Supervisor',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }),
  createMockActivityLog({
    id: '4',
    type: 'team_assigned',
    description: 'Assigned to Customer Support team',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }),
  createMockActivityLog({
    id: '5',
    type: 'password_changed',
    description: 'Password was reset',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  })
];

export const mockAssignments: TeamAssignment[] = [
  createMockTeamAssignment({
    id: '1',
    teamId: '1',
    teamName: 'Customer Support',
    role: 'Team Lead',
    status: 'active',
    startDate: '2024-01-01T00:00:00.000Z'
  }),
  createMockTeamAssignment({
    id: '2',
    teamId: '2',
    teamName: 'Sales',
    role: 'Member',
    status: 'active',
    startDate: '2024-02-15T00:00:00.000Z'
  }),
  createMockTeamAssignment({
    id: '3',
    teamId: '3',
    teamName: 'Marketing',
    role: 'Contributor',
    status: 'inactive',
    startDate: '2023-10-01T00:00:00.000Z',
    endDate: '2024-03-01T00:00:00.000Z'
  })
];
