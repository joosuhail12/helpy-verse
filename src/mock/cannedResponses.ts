
export interface CannedResponseShare {
  id: string;
  responseId: string;
  sharedWith: {
    teamId?: string;
    userId?: string;
    teamName?: string;
    userName?: string;
  };
  permissions: 'view' | 'edit';
  createdAt: string;
}

export interface CannedResponseVersion {
  id: string;
  responseId: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  changes: Array<{
    field: string;
    oldValue: string;
    newValue: string;
  }>;
}

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
  sharedWith?: CannedResponseShare[];
  versions?: CannedResponseVersion[];
  usageStats?: {
    totalUses: number;
    lastUsed: string;
    usedBy: Array<{
      userId: string;
      userName: string;
      useCount: number;
    }>;
  };
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
    updatedAt: '2024-03-10T10:00:00Z',
    sharedWith: [
      {
        id: '1',
        responseId: '1',
        sharedWith: {
          teamId: '1',
          teamName: 'Support Team'
        },
        permissions: 'view',
        createdAt: '2024-03-10T10:00:00Z'
      }
    ],
    versions: [
      {
        id: '1',
        responseId: '1',
        title: 'Welcome Message',
        content: 'Hi there! Thank you for reaching out to us. How can I help you today?',
        createdBy: 'John Doe',
        createdAt: '2024-03-10T10:00:00Z',
        changes: []
      }
    ],
    usageStats: {
      totalUses: 150,
      lastUsed: '2024-03-15T14:30:00Z',
      usedBy: [
        {
          userId: '1',
          userName: 'John Doe',
          useCount: 75
        },
        {
          userId: '2',
          userName: 'Jane Smith',
          useCount: 75
        }
      ]
    }
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
