
import { Content } from '@/types/content';
import { addDays, subDays } from 'date-fns';

const today = new Date();
const defaultAuthor = {
  id: 'user1',
  name: 'John Doe',
  avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=John',
};

export const supportContent: Content[] = [
  {
    id: '3',
    title: 'Support Knowledge Base',
    description: 'Customer support articles and troubleshooting guides',
    category: 'support',
    contentType: 'knowledgebase',
    type: 'website',
    status: 'processing',
    createdAt: subDays(today, 5).toISOString(),
    updatedAt: subDays(today, 1).toISOString(), // Add the missing property
    lastUpdated: subDays(today, 1).toISOString(),
    author: defaultAuthor,
    messageCount: 2100,
    progress: 75,
    content: 'https://support.example.com/kb',
    chatbots: [{
      id: '3',
      name: 'Support Bot',
    }],
  }
];
