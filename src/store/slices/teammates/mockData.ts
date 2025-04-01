
import type { Teammate, Session } from '@/types/teammate';

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

// Add the missing mockSessions export
export const mockSessions: Record<string, Session[]> = {
  'tm-1': [
    { 
      id: 'session-1', 
      teammateId: 'tm-1', 
      deviceName: 'Chrome on Windows', 
      startTime: new Date().toISOString(), 
      endTime: null,
      ipAddress: '192.168.1.1', 
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      active: true,
      deviceType: 'desktop',
      location: 'New York, US',
      lastActive: new Date().toISOString()
    },
    { 
      id: 'session-2', 
      teammateId: 'tm-1', 
      deviceName: 'Firefox on Mac', 
      startTime: new Date(Date.now() - 86400000).toISOString(), 
      endTime: null,
      ipAddress: '192.168.1.2', 
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:95.0)',
      active: true,
      deviceType: 'desktop',
      location: 'San Francisco, US',
      lastActive: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  'tm-2': [
    { 
      id: 'session-3', 
      teammateId: 'tm-2', 
      deviceName: 'Safari on iPhone', 
      startTime: new Date().toISOString(), 
      endTime: null,
      ipAddress: '192.168.1.3', 
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
      active: true,
      deviceType: 'mobile',
      location: 'Chicago, US',
      lastActive: new Date().toISOString()
    }
  ]
};
