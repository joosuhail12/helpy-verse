
import type { CustomFields } from '@/types/customField';

export const mockCustomFields: CustomFields = {
  tickets: [
    {
      id: '1',
      name: 'Priority Level',
      type: 'select',
      required: true,
      description: 'The priority level of the ticket',
      options: ['Low', 'Medium', 'High', 'Critical'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      history: [
        {
          id: '1',
          timestamp: '2024-01-01T00:00:00Z',
          userId: 'user1',
          userName: 'John Doe',
          action: 'created',
          changes: []
        }
      ]
    },
    {
      id: '2',
      name: 'Due Date',
      type: 'date',
      required: false,
      description: 'When the ticket needs to be resolved by',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
      history: [
        {
          id: '1',
          timestamp: '2024-01-02T00:00:00Z',
          userId: 'user1',
          userName: 'John Doe',
          action: 'created',
          changes: []
        }
      ]
    }
  ],
  contacts: [
    {
      id: '3',
      name: 'Contact Methods',
      type: 'multi-select',
      required: true,
      description: 'Preferred contact methods',
      options: ['Email', 'Phone', 'SMS', 'Mail'],
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z',
      history: [
        {
          id: '1',
          timestamp: '2024-01-03T00:00:00Z',
          userId: 'user2',
          userName: 'Jane Smith',
          action: 'created',
          changes: []
        }
      ]
    },
    {
      id: '4',
      name: 'Website',
      type: 'url',
      required: false,
      description: 'Personal or business website',
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z',
      history: [
        {
          id: '1',
          timestamp: '2024-01-03T00:00:00Z',
          userId: 'user2',
          userName: 'Jane Smith',
          action: 'created',
          changes: []
        }
      ]
    }
  ],
  companies: [
    {
      id: '5',
      name: 'Company Description',
      type: 'rich-text',
      required: true,
      description: 'Detailed company description',
      createdAt: '2024-01-04T00:00:00Z',
      updatedAt: '2024-01-04T00:00:00Z',
      history: [
        {
          id: '1',
          timestamp: '2024-01-04T00:00:00Z',
          userId: 'user1',
          userName: 'John Doe',
          action: 'created',
          changes: []
        }
      ]
    },
    {
      id: '6',
      name: 'Annual Revenue',
      type: 'currency',
      required: false,
      description: 'Annual revenue in USD',
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-05T00:00:00Z',
      history: [
        {
          id: '1',
          timestamp: '2024-01-05T00:00:00Z',
          userId: 'user1',
          userName: 'John Doe',
          action: 'created',
          changes: []
        }
      ]
    }
  ]
};

