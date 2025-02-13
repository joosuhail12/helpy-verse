
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
    },
    {
      id: '2',
      name: 'Due Date',
      type: 'date',
      required: false,
      description: 'When the ticket needs to be resolved by',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    }
  ],
  contacts: [
    {
      id: '3',
      name: 'Customer Type',
      type: 'select',
      required: true,
      description: 'The type of customer',
      options: ['Premium', 'Standard', 'Trial'],
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z',
    }
  ],
  companies: [
    {
      id: '4',
      name: 'Industry',
      type: 'select',
      required: true,
      description: 'The industry sector of the company',
      options: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Other'],
      createdAt: '2024-01-04T00:00:00Z',
      updatedAt: '2024-01-04T00:00:00Z',
    },
    {
      id: '5',
      name: 'Annual Revenue',
      type: 'number',
      required: false,
      description: 'Annual revenue in USD',
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-05T00:00:00Z',
    }
  ]
};
