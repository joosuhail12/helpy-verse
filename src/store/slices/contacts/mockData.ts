
import { Contact } from '@/types/contact';

export const mockContacts: Contact[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    company: 'Acme Inc',
    status: 'active',
    tags: ['VIP', 'Enterprise'],
    lastContacted: '2024-03-10T10:00:00.000Z',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-03-10T10:00:00.000Z',
    type: 'customer'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    status: 'active',
    tags: ['Prospect'],
    createdAt: '2024-02-15T00:00:00.000Z',
    updatedAt: '2024-02-15T00:00:00.000Z',
    type: 'visitor'
  }
];
