
import { Team } from './teamsSlice';

export const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Customer Support',
    description: 'Front-line team handling customer inquiries and issues',
    icon: '🎯',
    color: '#4F46E5',
    members: [
      {
        id: 'member-1',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=Sarah',
        role: 'manager',
        status: 'active'
      },
      {
        id: 'member-2',
        name: 'Michael Chen',
        email: 'michael.c@example.com',
        avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=Michael',
        role: 'agent',
        status: 'active'
      },
      {
        id: 'member-3',
        name: 'Emily Davis',
        email: 'emily.d@example.com',
        avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=Emily',
        role: 'agent',
        status: 'active'
      }
    ],
    channels: [
      {
        id: 'channel-1',
        name: 'Support Email',
        type: 'email',
        isActive: true
      },
      {
        id: 'channel-2',
        name: 'Live Chat',
        type: 'chat',
        isActive: true
      }
    ],
    routing: [
      {
        id: 'rule-1',
        name: 'Priority Customers',
        priority: 1,
        isActive: true
      },
      {
        id: 'rule-2',
        name: 'Standard Routing',
        priority: 2,
        isActive: true
      }
    ],
    officeHours: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '09:00',
      endTime: '17:00',
      timezone: 'America/New_York'
    },
    holidays: [
      {
        id: 'holiday-1',
        name: 'New Year\'s Day',
        date: '2023-01-01',
        isRecurring: true
      },
      {
        id: 'holiday-2',
        name: 'Independence Day',
        date: '2023-07-04',
        isRecurring: true
      }
    ],
    createdAt: '2023-01-10T08:30:00Z',
    updatedAt: '2023-06-15T14:45:00Z'
  },
  {
    id: 'team-2',
    name: 'Technical Support',
    description: 'Specialized team handling complex technical issues',
    icon: '🔧',
    color: '#10B981',
    members: [
      {
        id: 'member-4',
        name: 'Alex Rivera',
        email: 'alex.r@example.com',
        avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=Alex',
        role: 'supervisor',
        status: 'active'
      },
      {
        id: 'member-5',
        name: 'Jamie Smith',
        email: 'jamie.s@example.com',
        avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=Jamie',
        role: 'agent',
        status: 'active'
      }
    ],
    channels: [
      {
        id: 'channel-3',
        name: 'Tech Support Email',
        type: 'email',
        isActive: true
      },
      {
        id: 'channel-4',
        name: 'Support Phone Line',
        type: 'voice',
        isActive: true
      }
    ],
    routing: [
      {
        id: 'rule-3',
        name: 'Technical Issues',
        priority: 1,
        isActive: true
      }
    ],
    officeHours: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      startTime: '08:00',
      endTime: '20:00',
      timezone: 'America/Los_Angeles'
    },
    holidays: [
      {
        id: 'holiday-3',
        name: 'Christmas Day',
        date: '2023-12-25',
        isRecurring: true
      }
    ],
    createdAt: '2023-02-18T10:15:00Z',
    updatedAt: '2023-05-22T16:30:00Z'
  }
];
