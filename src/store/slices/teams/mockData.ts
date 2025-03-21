
import type { Team } from '@/types/team';

export const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Customer Support',
    icon: '🎯',
    members: [
      {
        id: 'member-1',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
      },
      {
        id: 'member-2',
        name: 'Michael Chen',
        email: 'michael.c@example.com',
      },
      {
        id: 'member-3',
        name: 'Emily Davis',
        email: 'emily.d@example.com',
      }
    ],
    channels: {
      chat: 'Live Chat',
      email: ['support@example.com']
    },
    routing: {
      type: 'manual',
    },
    officeHours: {
      monday: [{ start: '09:00', end: '17:00' }],
      tuesday: [{ start: '09:00', end: '17:00' }],
      wednesday: [{ start: '09:00', end: '17:00' }],
      thursday: [{ start: '09:00', end: '17:00' }],
      friday: [{ start: '09:00', end: '17:00' }],
      saturday: [],
      sunday: []
    },
    holidays: [
      '2023-01-01',
      '2023-07-04',
    ],
    createdAt: '2023-01-10T08:30:00Z',
    updatedAt: '2023-06-15T14:45:00Z'
  },
  {
    id: 'team-2',
    name: 'Technical Support',
    icon: '🔧',
    members: [
      {
        id: 'member-4',
        name: 'Alex Rivera',
        email: 'alex.r@example.com',
      },
      {
        id: 'member-5',
        name: 'Jamie Smith',
        email: 'jamie.s@example.com',
      }
    ],
    channels: {
      chat: 'Tech Chat',
      email: ['tech@example.com']
    },
    routing: {
      type: 'round-robin',
    },
    officeHours: {
      monday: [{ start: '08:00', end: '20:00' }],
      tuesday: [{ start: '08:00', end: '20:00' }],
      wednesday: [{ start: '08:00', end: '20:00' }],
      thursday: [{ start: '08:00', end: '20:00' }],
      friday: [{ start: '08:00', end: '20:00' }],
      saturday: [{ start: '10:00', end: '16:00' }],
      sunday: []
    },
    holidays: [
      '2023-12-25',
    ],
    createdAt: '2023-02-18T10:15:00Z',
    updatedAt: '2023-05-22T16:30:00Z'
  }
];
