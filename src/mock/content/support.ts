
import { Content } from '@/types/content';
import { addDays, subDays } from 'date-fns';

const today = new Date();

export const supportContent: Content[] = [
  {
    id: '3',
    title: 'Support Knowledge Base',
    description: 'Customer support articles and troubleshooting guides',
    category: 'support',
    type: 'website',
    status: 'processing',
    lastUpdated: subDays(today, 1).toISOString(),
    messageCount: 2100,
    progress: 75,
    content: 'https://support.example.com/kb',
    chatbot: {
      id: '3',
      name: 'Support Bot',
    },
  }
];
