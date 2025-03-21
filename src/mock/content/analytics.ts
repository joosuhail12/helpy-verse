
import { Content } from '@/types/content';

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
    chatbots: [{
      id: '3',
      name: 'Support Bot',
    }],
  }
];
