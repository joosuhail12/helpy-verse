
import type { Teammate, ActivityLog, TeamAssignment, Session } from '@/types/teammate';
import type { Team, TeamMember, TimeSlot, Holiday, TeamChannel, TeamRouting } from '@/types/team';

/**
 * Helper function to create well-typed mock data
 */

export const createMockTeammate = (overrides: Partial<Teammate> = {}): Teammate => {
  return {
    id: Math.random().toString(36).substring(2, 9),
    name: 'John Doe',
    email: 'john@example.com',
    role: 'agent',
    status: 'active',
    lastActive: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    permissions: [],
    teams: [],
    is2FAEnabled: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    ...overrides
  };
};

export const createMockActivityLog = (overrides: Partial<ActivityLog> = {}): ActivityLog => {
  return {
    id: Math.random().toString(36).substring(2, 9),
    type: 'login',
    description: 'Logged in to the system',
    timestamp: new Date().toISOString(),
    ...overrides
  };
};

export const createMockTeamAssignment = (overrides: Partial<TeamAssignment> = {}): TeamAssignment => {
  return {
    id: Math.random().toString(36).substring(2, 9),
    teamId: '1',
    teamName: 'Customer Support',
    role: 'Team Lead',
    status: 'active',
    startDate: new Date().toISOString(),
    ...overrides
  };
};

export const createMockSession = (overrides: Partial<Session> = {}): Session => {
  return {
    id: Math.random().toString(36).substring(2, 9),
    deviceType: 'Desktop',
    deviceName: 'Chrome on Windows',
    location: 'New York, USA',
    ip: '192.168.1.1',
    lastActive: new Date().toISOString(),
    current: false,
    ...overrides
  };
};

export const createMockTeam = (overrides: Partial<Team> = {}): Team => {
  return {
    id: Math.random().toString(36).substring(2, 9),
    name: 'Support Team',
    icon: '🔧',
    status: 'active',
    description: 'Handles customer support tickets',
    memberCount: 5,
    members: [],
    officeHours: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: []
    },
    channels: [],
    routing: [],
    holidays: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  };
};

export const createMockTeamMember = (overrides: Partial<TeamMember> = {}): TeamMember => {
  return {
    id: Math.random().toString(36).substring(2, 9),
    name: 'Jane Smith',
    email: 'jane@example.com',
    ...overrides
  };
};

export const createMockTimeSlot = (overrides: Partial<TimeSlot> = {}): TimeSlot => {
  return {
    start: '09:00',
    end: '17:00',
    ...overrides
  };
};

export const createMockHoliday = (overrides: Partial<Holiday> = {}): Holiday => {
  return {
    date: '2024-12-25',
    name: 'Christmas Day',
    ...overrides
  };
};

export const createMockTeamChannel = (overrides: Partial<TeamChannel> = {}): TeamChannel => {
  return {
    id: Math.random().toString(36).substring(2, 9),
    name: 'Email Support',
    type: 'email',
    ...overrides
  };
};

export const createMockTeamRouting = (overrides: Partial<TeamRouting> = {}): TeamRouting => {
  return {
    type: 'round-robin',
    limits: {
      maxTickets: 20,
      maxOpenTickets: 10,
      maxActiveChats: 5
    },
    ...overrides
  };
};
