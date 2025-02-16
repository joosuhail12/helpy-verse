
import type { Content } from '@/types/content';

export const mockContent: Content[] = [
  {
    id: '1',
    title: 'Customer Support Bot',
    description: 'Handles basic customer inquiries and support tickets',
    category: 'support',
    status: 'completed',
    lastUpdated: '2024-03-15T10:00:00Z',
    messageCount: 1250,
    chatbot: {
      id: '1',
      name: 'Customer Support Bot',
    },
  },
  {
    id: '2',
    title: 'Sales Assistant',
    description: 'Helps with product recommendations and sales inquiries',
    category: 'sales',
    status: 'processing',
    lastUpdated: '2024-03-14T15:30:00Z',
    messageCount: 850,
    progress: 65,
    chatbot: {
      id: '2',
      name: 'Sales Assistant',
    },
  },
  {
    id: '3',
    title: 'Onboarding Guide',
    description: 'Assists new users with platform navigation and setup',
    category: 'onboarding',
    status: 'queued',
    lastUpdated: '2024-03-13T09:15:00Z',
    messageCount: 2100,
    chatbot: {
      id: '3',
      name: 'Onboarding Guide',
    },
  },
  {
    id: '4',
    title: 'Troubleshooting Guide',
    description: 'Technical issue resolution guide',
    category: 'support',
    status: 'failed',
    lastUpdated: '2024-03-12T14:20:00Z',
    messageCount: 500,
    errorMessage: 'Failed to process document',
    chatbot: {
      id: '1',
      name: 'Customer Support Bot',
    },
  },
];
