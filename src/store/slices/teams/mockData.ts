
import { Team } from '@/types/team';

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
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '09:00',
      endTime: '17:00',
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
      '2024-01-01',
      '2024-07-04',
      '2024-12-25'
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
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '08:00',
      endTime: '18:00',
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
      '2024-01-01',
      '2024-07-04',
      '2024-12-25'
    ]
  }
];
