
import type { Teammate } from '@/types/teammate';

// Mock data for testing and development
export const mockTeammates: Teammate[] = [
  {
    id: 'tm-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'WORKSPACE_ADMIN',
    status: 'active',
    department: 'Engineering',
    createdAt: '2023-04-15T10:30:00Z',
    lastActive: '2023-05-10T14:45:00Z',
    is2FAEnabled: true
  },
  {
    id: 'tm-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'WORKSPACE_AGENT',
    status: 'active',
    department: 'Customer Support',
    createdAt: '2023-04-20T09:15:00Z',
    lastActive: '2023-05-11T11:20:00Z',
    is2FAEnabled: false
  },
  {
    id: 'tm-3',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    role: 'ORGANIZATION_ADMIN',
    status: 'pending',
    department: 'Management',
    createdAt: '2023-05-01T13:45:00Z',
    is2FAEnabled: false
  },
  {
    id: 'tm-4',
    name: 'Emily Brown',
    email: 'emily.brown@example.com',
    role: 'WORKSPACE_AGENT',
    status: 'active',
    department: 'Marketing',
    createdAt: '2023-03-10T08:30:00Z',
    lastActive: '2023-05-09T16:15:00Z',
    is2FAEnabled: true
  },
  {
    id: 'tm-5',
    name: 'Robert Wilson',
    email: 'robert@example.com',
    role: 'WORKSPACE_AGENT',
    status: 'inactive',
    department: 'Sales',
    createdAt: '2022-11-15T11:20:00Z',
    lastActive: '2023-04-20T10:10:00Z',
    is2FAEnabled: false
  }
];
