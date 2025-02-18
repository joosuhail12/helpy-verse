import type { Content } from '@/types/content';
import { addDays, subDays } from 'date-fns';

const today = new Date();

export const mockContent: Content[] = [
  {
    id: '1',
    title: 'Customer Support Bot',
    description: 'Handles basic customer inquiries and support tickets',
    category: 'support',
    type: 'snippet',
    status: 'completed',
    lastUpdated: subDays(today, 1).toISOString(),
    messageCount: 1250,
    content: '# Customer Support Guidelines\n\n1. Always greet the customer politely\n2. Address their concerns promptly\n3. Provide clear solutions\n4. Follow up when necessary',
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
    lastUpdated: subDays(today, 2).toISOString(),
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
    lastUpdated: subDays(today, 3).toISOString(),
    messageCount: 2100,
    chatbot: {
      id: '3',
      name: 'Onboarding Guide',
    },
  },
  {
    id: '4',
    title: 'Technical Documentation',
    description: 'API documentation and integration guides',
    category: 'documentation',
    status: 'completed',
    lastUpdated: subDays(today, 4).toISOString(),
    messageCount: 750,
    chatbot: {
      id: '1',
      name: 'Customer Support Bot',
    },
  },
  {
    id: '5',
    title: 'Product Updates',
    description: 'Latest feature updates and release notes',
    category: 'product',
    status: 'completed',
    lastUpdated: subDays(today, 5).toISOString(),
    messageCount: 1500,
    chatbot: {
      id: '2',
      name: 'Sales Assistant',
    },
  },
  {
    id: '6',
    title: 'FAQ Database',
    description: 'Frequently asked questions and answers',
    category: 'support',
    status: 'failed',
    lastUpdated: subDays(today, 2).toISOString(),
    messageCount: 300,
    errorMessage: 'Failed to process document structure',
    chatbot: {
      id: '1',
      name: 'Customer Support Bot',
    },
  },
  {
    id: '7',
    title: 'Marketing Assistant',
    description: 'Helps create and optimize marketing content',
    category: 'marketing',
    status: 'processing',
    lastUpdated: subDays(today, 1).toISOString(),
    messageCount: 950,
    progress: 45,
    chatbot: {
      id: '2',
      name: 'Sales Assistant',
    },
  },
  {
    id: '8',
    title: 'Troubleshooting Guide',
    description: 'Step-by-step technical troubleshooting procedures',
    category: 'support',
    status: 'queued',
    lastUpdated: today.toISOString(),
    messageCount: 1800,
    chatbot: {
      id: '3',
      name: 'Onboarding Guide',
    },
  }
];
