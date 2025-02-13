
import type { Team } from '@/types/team';

export const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Frontend Team',
    members: [
      { id: '101', name: 'John Doe', email: 'john@example.com' },
      { id: '102', name: 'Jane Smith', email: 'jane@example.com' }
    ],
    routing: {
      type: 'round-robin'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'Backend Team',
    members: [
      { id: '201', name: 'Mike Johnson', email: 'mike@example.com' },
      { id: '202', name: 'Sarah Wilson', email: 'sarah@example.com' },
      { id: '203', name: 'Tom Brown', email: 'tom@example.com' }
    ],
    routing: {
      type: 'load-balanced'
    },
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-03-14T11:20:00Z'
  },
  {
    id: '3',
    name: 'Design Team',
    members: [
      { id: '301', name: 'Alice Cooper', email: 'alice@example.com' },
      { id: '302', name: 'Bob Martin', email: 'bob@example.com' }
    ],
    routing: {
      type: 'manual'
    },
    createdAt: '2024-02-15T08:00:00Z',
    updatedAt: '2024-03-10T16:45:00Z'
  }
];

