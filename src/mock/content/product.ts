
import { Content } from '@/types/content';
import { addDays, subDays } from 'date-fns';

const today = new Date();
const defaultAuthor = {
  id: 'user1',
  name: 'John Doe',
  avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=John',
};

export const productContent: Content[] = [
  {
    id: '6',
    title: 'Product Feature Overview',
    description: 'Comprehensive overview of platform features',
    category: 'product',
    contentType: 'product',
    type: 'website',
    status: 'queued',
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(), // Add the missing property
    lastUpdated: today.toISOString(),
    author: defaultAuthor,
    messageCount: 0,
    content: 'https://products.example.com/features',
    chatbots: [{
      id: '3',
      name: 'Support Bot',
    }],
  }
];
