
import { Content } from '@/types/content';

const today = new Date();
const defaultAuthor = {
  id: 'user1',
  name: 'John Doe',
  avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=John',
};

export const analyticsContent: Content[] = [
  {
    id: '9',
    title: 'Customer Feedback Analysis',
    description: 'Analysis of customer feedback and satisfaction scores',
    category: 'analytics',
    contentType: 'analytics',
    type: 'file',
    status: 'queued',
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(), // Add the missing property
    lastUpdated: today.toISOString(),
    author: defaultAuthor,
    messageCount: 0,
    chatbots: [{
      id: '3',
      name: 'Support Bot',
    }],
  }
];
