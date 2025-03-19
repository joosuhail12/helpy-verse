
import { Team, TeamMember, TeamChannel, Holiday } from '@/types/team';

export const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Customer Support',
    icon: 'headphones',
    status: 'active',
    type: 'support',
    description: 'Main customer support team',
    memberCount: 3,
    members: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com'
      },
      {
        id: '3',
        name: 'Michael Johnson',
        email: 'michael@example.com'
      }
    ],
    officeHours: {
      monday: [{ start: '09:00', end: '17:00' }],
      tuesday: [{ start: '09:00', end: '17:00' }],
      wednesday: [{ start: '09:00', end: '17:00' }],
      thursday: [{ start: '09:00', end: '17:00' }],
      friday: [{ start: '09:00', end: '17:00' }],
      timezone: 'America/New_York'
    },
    channels: [
      {
        id: '1',
        name: 'Support Chat',
        type: 'chat'
      },
      {
        id: '2',
        name: 'Support Email',
        type: 'email'
      }
    ],
    routing: [
      {
        type: 'round-robin',
        limits: {
          maxTickets: 50,
          maxOpenTickets: 10,
          maxActiveChats: 5
        }
      }
    ],
    holidays: [
      { date: '2024-01-01', name: 'New Year\'s Day' },
      { date: '2024-07-04', name: 'Independence Day' },
      { date: '2024-12-25', name: 'Christmas Day' }
    ]
  },
  {
    id: '2',
    name: 'Sales Team',
    icon: 'dollar-sign',
    status: 'active',
    type: 'sales',
    description: 'Sales and business development team',
    memberCount: 2,
    members: [
      {
        id: '4',
        name: 'Emily Davis',
        email: 'emily@example.com'
      },
      {
        id: '5',
        name: 'Robert Wilson',
        email: 'robert@example.com'
      }
    ],
    officeHours: {
      monday: [{ start: '08:00', end: '18:00' }],
      tuesday: [{ start: '08:00', end: '18:00' }],
      wednesday: [{ start: '08:00', end: '18:00' }],
      thursday: [{ start: '08:00', end: '18:00' }],
      friday: [{ start: '08:00', end: '18:00' }],
      timezone: 'America/Chicago'
    },
    channels: [
      {
        id: '3',
        name: 'Sales Email',
        type: 'email'
      }
    ],
    routing: [
      {
        type: 'manual'
      }
    ],
    holidays: [
      { date: '2024-01-01', name: 'New Year\'s Day' },
      { date: '2024-07-04', name: 'Independence Day' },
      { date: '2024-12-25', name: 'Christmas Day' }
    ]
  }
];
