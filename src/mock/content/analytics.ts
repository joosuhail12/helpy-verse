
import { Content } from '@/types/content';
import { addDays, subDays } from 'date-fns';

const today = new Date();

export const analyticsContent: Content[] = [
  {
    id: '9',
    title: 'Customer Feedback Analysis',
    description: 'Analysis of customer feedback and satisfaction scores',
    category: 'analytics',
    type: 'file',
    status: 'queued',
    lastUpdated: today.toISOString(),
    messageCount: 0,
    chatbot: {
      id: '3',
      name: 'Support Bot',
    },
  }
];
