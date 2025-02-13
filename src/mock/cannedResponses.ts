
export interface CannedResponse {
  id: string;
  title: string;
  content: string;
  shortcut: string;
  category: string;
  isShared: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const mockCannedResponses: CannedResponse[] = [
  {
    id: '1',
    title: 'Welcome Message',
    content: 'Hi there! Thank you for reaching out to us. How can I help you today?',
    shortcut: '/welcome',
    category: 'Greetings',
    isShared: true,
    createdBy: 'John Doe',
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z'
  },
  {
    id: '2',
    title: 'Thank You',
    content: 'Thank you for your patience. Is there anything else I can help you with?',
    shortcut: '/ty',
    category: 'Closing',
    isShared: true,
    createdBy: 'Jane Smith',
    createdAt: '2024-03-10T11:00:00Z',
    updatedAt: '2024-03-10T11:00:00Z'
  }
];
