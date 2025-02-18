
import { Content } from '@/types/content';
import { addDays, subDays } from 'date-fns';

const today = new Date();

export const productContent: Content[] = [
  {
    id: '6',
    title: 'Product Feature Overview',
    description: 'Comprehensive overview of platform features',
    category: 'product',
    type: 'website',
    status: 'queued',
    lastUpdated: today.toISOString(),
    messageCount: 0,
    content: 'https://products.example.com/features',
    chatbot: {
      id: '3',
      name: 'Support Bot',
    },
  }
];
