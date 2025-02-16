
export interface Chatbot {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const mockChatbots: Chatbot[] = [
  {
    id: '1',
    name: 'Customer Support Bot',
    description: 'Handles general customer inquiries and support tickets',
    status: 'active',
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Sales Assistant',
    description: 'Helps with product information and sales queries',
    status: 'active',
    createdAt: '2024-03-14T15:30:00Z',
  },
  {
    id: '3',
    name: 'Onboarding Guide',
    description: 'Assists new users with platform navigation',
    status: 'inactive',
    createdAt: '2024-03-13T09:15:00Z',
  },
];
