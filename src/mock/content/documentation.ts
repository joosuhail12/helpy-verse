
import { Content } from '@/types/content';
import { addDays, subDays } from 'date-fns';

const today = new Date();
const defaultAuthor = {
  id: 'user1',
  name: 'John Doe',
  avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=John',
};

export const documentationContent: Content[] = [
  {
    id: '1',
    title: 'API Documentation v2.0',
    description: 'Updated API documentation with new endpoints and examples',
    category: 'documentation',
    contentType: 'docs',
    type: 'file',
    status: 'completed',
    createdAt: subDays(today, 5).toISOString(),
    updatedAt: subDays(today, 1).toISOString(), // Add the missing property
    lastUpdated: subDays(today, 1).toISOString(),
    author: defaultAuthor,
    messageCount: 1250,
    content: '# API Documentation\n\n## Authentication\n\nTo authenticate your requests, include your API key in the Authorization header:\n\n```\nAuthorization: Bearer YOUR_API_KEY\n```\n\n## Endpoints\n\n### GET /api/v2/users\n\nRetrieve a list of users...',
    chatbots: [{
      id: '1',
      name: 'Documentation Bot',
    }],
    lastEditedBy: {
      id: 'user1',
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=John',
    },
    versions: [
      {
        id: 'v1',
        contentId: '1',
        content: '# Previous version content...',
        createdAt: subDays(today, 2).toISOString(),
        createdBy: {
          id: 'user1',
          name: 'John Doe',
          avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=John',
        },
        changes: 'Updated authentication section',
      },
      {
        id: 'v2',
        contentId: '1',
        content: '# Even older version...',
        createdAt: subDays(today, 4).toISOString(),
        createdBy: {
          id: 'user2',
          name: 'Jane Smith',
          avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=Jane',
        },
        changes: 'Initial documentation structure',
      },
    ],
  },
  {
    id: '5',
    title: 'Security Guidelines',
    description: 'Internal security protocols and best practices',
    category: 'documentation',
    contentType: 'security',
    type: 'file',
    status: 'failed',
    createdAt: subDays(today, 5).toISOString(),
    updatedAt: subDays(today, 2).toISOString(), // Add the missing property
    lastUpdated: subDays(today, 2).toISOString(),
    author: defaultAuthor,
    messageCount: 180,
    errorMessage: 'Access denied: insufficient permissions',
    chatbots: [{
      id: '1',
      name: 'Documentation Bot',
    }],
  },
  {
    id: '10',
    title: 'API Rate Limiting Policy',
    description: 'Documentation for API rate limiting and quotas',
    category: 'documentation',
    contentType: 'docs',
    type: 'snippet',
    status: 'completed',
    createdAt: subDays(today, 5).toISOString(),
    updatedAt: subDays(today, 1).toISOString(), // Add the missing property
    lastUpdated: subDays(today, 1).toISOString(),
    author: defaultAuthor,
    messageCount: 567,
    content: `# API Rate Limiting\n\n## Default Limits\n- 1000 requests per hour\n- 10 concurrent connections\n\n## Premium Tier\n- 5000 requests per hour\n- 25 concurrent connections\n\nRate limits are applied per API key and reset hourly.`,
    chatbots: [{
      id: '1',
      name: 'Documentation Bot',
    }],
  }
];
