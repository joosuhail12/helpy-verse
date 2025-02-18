
import { Content } from '@/types/content';
import { addDays, subDays } from 'date-fns';

const today = new Date();

export const documentationContent: Content[] = [
  {
    id: '1',
    title: 'API Documentation v2.0',
    description: 'Updated API documentation with new endpoints and examples',
    category: 'documentation',
    type: 'file',
    status: 'completed',
    lastUpdated: subDays(today, 1).toISOString(),
    messageCount: 1250,
    content: '# API Documentation\n\n## Authentication\n\nTo authenticate your requests, include your API key in the Authorization header:\n\n```\nAuthorization: Bearer YOUR_API_KEY\n```\n\n## Endpoints\n\n### GET /api/v2/users\n\nRetrieve a list of users...',
    chatbot: {
      id: '1',
      name: 'Documentation Bot',
    },
  },
  {
    id: '5',
    title: 'Security Guidelines',
    description: 'Internal security protocols and best practices',
    category: 'documentation',
    type: 'file',
    status: 'failed',
    lastUpdated: subDays(today, 2).toISOString(),
    messageCount: 180,
    errorMessage: 'Access denied: insufficient permissions',
    chatbot: {
      id: '1',
      name: 'Documentation Bot',
    },
  },
  {
    id: '10',
    title: 'API Rate Limiting Policy',
    description: 'Documentation for API rate limiting and quotas',
    category: 'documentation',
    type: 'snippet',
    status: 'completed',
    lastUpdated: subDays(today, 1).toISOString(),
    messageCount: 567,
    content: `# API Rate Limiting\n\n## Default Limits\n- 1000 requests per hour\n- 10 concurrent connections\n\n## Premium Tier\n- 5000 requests per hour\n- 25 concurrent connections\n\nRate limits are applied per API key and reset hourly.`,
    chatbot: {
      id: '1',
      name: 'Documentation Bot',
    },
  }
];
