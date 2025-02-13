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
    officeHours: {
      monday: [{ start: '09:00', end: '17:00' }],
      tuesday: [{ start: '09:00', end: '17:00' }],
      wednesday: [{ start: '09:00', end: '17:00' }],
      thursday: [{ start: '09:00', end: '17:00' }],
      friday: [{ start: '09:00', end: '17:00' }],
      saturday: [],
      sunday: []
    },
    holidays: ['2024-12-25', '2024-12-31', '2025-01-01'],
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
    officeHours: {
      monday: [{ start: '08:00', end: '16:00' }],
      tuesday: [{ start: '08:00', end: '16:00' }],
      wednesday: [{ start: '08:00', end: '16:00' }],
      thursday: [{ start: '08:00', end: '16:00' }],
      friday: [{ start: '08:00', end: '16:00' }],
      saturday: [],
      sunday: []
    },
    holidays: ['2024-07-04', '2024-11-28'],
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
    officeHours: {
      monday: [{ start: '10:00', end: '18:00' }],
      tuesday: [{ start: '10:00', end: '18:00' }],
      wednesday: [{ start: '10:00', end: '18:00' }],
      thursday: [{ start: '10:00', end: '18:00' }],
      friday: [{ start: '10:00', end: '18:00' }],
      saturday: [],
      sunday: []
    },
    holidays: ['2024-05-27', '2024-09-02'],
    createdAt: '2024-02-15T08:00:00Z',
    updatedAt: '2024-03-10T16:45:00Z'
  }
];
